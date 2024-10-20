import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/createUserDto';
import { User } from './model/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { v2 as cloudinary } from 'cloudinary';
import { Request } from './model/request.schema';
import { Connection } from './model/connection.schema';

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        @InjectModel(Request.name) private requestModel: Model<Request>,
        @InjectModel(Connection.name) private connectionModel: Model<Connection>,
        private jwtService: JwtService
    ) {
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
        });
    }

    async userAuthentication(userData: CreateUserDto): Promise<{ user: User, token: string }> {
        try {
            let user = await this.userModel.findOne({ email: userData.email }).exec();
            if (!user) {
                const imageUrl = await this.uploadImageToCloud(userData.image);
                user = new this.userModel({ ...userData, image: imageUrl });
                await user.save();
                await this.connectionModel.create({
                    userId: user.id,
                })
            }
            const token = this.jwtService.sign({ userId: user._id });
            return { user, token };
        } catch (error) {
            throw new HttpException(`Authentication failed: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async uploadImageToCloud(imageUrl: string): Promise<string> {
        try {
            const result = await cloudinary.uploader.upload(imageUrl);
            return result.secure_url;
        } catch (error) {
            throw new HttpException(`Image upload failed: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async searchUser(input: string, userId: string): Promise<User[]> {
        try {

            const friends = await this.connectionModel.findOne({userId: userId});
            const connections = friends ? friends.connections : [];
            return await this.userModel.find({
                username: { $regex: input, $options: 'i' },
                _id: { $ne: userId  ,$nin: connections},
            }).exec();
        } catch (error) {
            throw new HttpException(`Search failed: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async sendUserRequest(sender: string, receiver: string): Promise<void> {
        try {
            const existingRequest = await this.requestModel.findOne({ sender, receiver }).exec();
            if (existingRequest) {
                throw new HttpException('Request already exists', HttpStatus.CONFLICT);
            }
            await this.requestModel.create({ sender, receiver });
        } catch (error) {
            throw new HttpException(`Request sending failed: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getRequests(userId: string) {
        try {
            return await this.requestModel.find({ receiver: userId }).populate('sender').exec();
        } catch (error) {
            throw new HttpException(`Failed to get requests: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getSendRequests(userId: string) {
        try {
            return await this.requestModel.find({ sender: userId }).exec();
        } catch (error) {
            throw new HttpException(`Failed to get sent requests: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async acceptAndRejectUserRequest(requestId: string, status: string): Promise<void> {
        try {
            const request = await this.requestModel.findById(requestId).exec();
            if (!request) {
                throw new HttpException('Request not found', HttpStatus.NOT_FOUND);
            }
            if (request.status === 'pending') {
                request.status = status === 'accepted' ? 'accepted' : 'rejected';

                if (status === 'accepted') {
                    await this.connectionModel.updateOne(
                        { userId: request.receiver },
                        { $addToSet: { connections: request.sender } },
                        { upsert: true }
                    )
                    await this.connectionModel.updateOne(
                        { userId: request.sender },
                        { $addToSet: { connections: request.receiver } },
                        { upsert: true }
                    )
                }

                await request.deleteOne();
            } else {
                throw new HttpException('Request cannot be updated', HttpStatus.BAD_REQUEST);
            }
        } catch (error) {
            throw new HttpException(`Failed to update request status: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    async getAllConnections(userId: string){        
        return await this.connectionModel.findOne({
            userId: userId
        }).populate('connections')
    }

    async getUserData(userId: string){
        return await this.userModel.findById(userId).populate('username image email')
    }
}
