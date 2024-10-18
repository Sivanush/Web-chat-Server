import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, userModal } from './model/user.schema';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { Request, requestModal } from './model/request.schema';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
    imports:[
        ConfigModule.forRoot(),
        MongooseModule.forFeature([{name:User.name,schema:userModal}]),
        MongooseModule.forFeature([{name:Request.name,schema:requestModal}]),
        JwtModule.register({
            secret:process.env.JWT_SECRET,
            signOptions:{expiresIn:'1d'}
        })
    ],
    controllers:[UserController],
    providers:[UserService]
})
export class AuthModule {}
