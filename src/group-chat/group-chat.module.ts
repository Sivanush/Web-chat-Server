import { Module } from '@nestjs/common';
import { GroupChatService } from './group-chat.service';
import { GroupChatController } from './group-chat.controller';
import { Group, GroupModel } from './model/group.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { GroupMember, GroupMemberModel } from './model/members.schema';

@Module({
  imports:[
    MongooseModule.forFeature([{name:Group.name,schema:GroupModel}]),
    MongooseModule.forFeature([{name:GroupMember.name,schema:GroupMemberModel}]),
  ],
  controllers: [GroupChatController],
  providers: [GroupChatService],
})
export class GroupChatModule {}
