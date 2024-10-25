import { Module } from '@nestjs/common';
import { GroupChatService } from './group-chat.service';
import { GroupChatController } from './group-chat.controller';
import { Group, GroupModel } from './model/group.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { GroupMember, GroupMemberModel } from './model/members.schema';
import { GroupChatGateway } from './group-chat.gateway';
import { GroupMessage, GroupMessageModel } from './model/group-chat.schema';

@Module({
  imports:[
    MongooseModule.forFeature([{name:Group.name,schema:GroupModel}]),
    MongooseModule.forFeature([{name:GroupMember.name,schema:GroupMemberModel}]),
    MongooseModule.forFeature([{name:GroupMessage.name,schema:GroupMessageModel}]),
  ],
  controllers: [GroupChatController],
  providers: [GroupChatGateway,GroupChatService],
})
export class GroupChatModule {}
