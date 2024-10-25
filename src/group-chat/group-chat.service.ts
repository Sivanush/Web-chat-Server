import { ConflictException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateGroupChatDto } from './dto/create-group-chat.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GroupMember } from './model/members.schema';
import { Group } from './model/group.schema';

@Injectable()
export class GroupChatService {

  constructor(
    @InjectModel(Group.name) private groupModel: Model<Group>,
    @InjectModel(GroupMember.name) private groupMemberModel: Model<GroupMember>
  ) { }


  async create(createGroup: CreateGroupChatDto, userId: string) {
    try {
      const isExist = await this.groupModel.findOne({ name: createGroup.name });

      if (isExist) {
        throw new HttpException('This name already exists! Choose another one', HttpStatus.BAD_REQUEST);
      }

      const group = await this.groupModel.create({
        ...createGroup,
        createdBy: userId,
      });

      await this.joinGroup(group._id as unknown as string, userId, 'admin')

      return group;
    } catch (error) {
      throw new HttpException(`Create Group failed: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


  async searchGroup(query: string) {
    try {
      const groups = await this.groupModel.find({
        $or: [
          { name: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } },
        ],
      }).exec();

      // if (groups.length === 0) {
      //   throw new HttpException('No groups found matching the query', HttpStatus.NOT_FOUND);
      // }

      return groups;
    } catch (error) {
      throw new HttpException(`Search Group failed: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


  async joinGroup(groupId: string, userId: string, role?: string) {
    try {
      const existingMember = await this.groupMemberModel.findOne({ groupId, userId });

      if (existingMember) {
        throw new ConflictException('User is already a member of this group');
      }


      const newMember = await this.groupMemberModel.create({ groupId, userId, role });

      return await newMember.save();
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new HttpException(`Join Group failed: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


  async getMyGroups(userId: string) {
    try {
      const groupMemberships = await this.groupMemberModel
        .find({ userId })
        .populate('groupId')
        .exec();
      const groups = groupMemberships.map(member => member.groupId);

      return groups;
    } catch (error) {
      throw new HttpException(`Get Group failed: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


  async getGroupData(groupId: string) {
    try {
      return this.groupModel.findById(groupId)
    } catch (error) {
      throw new HttpException(`Get Group Data failed: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
