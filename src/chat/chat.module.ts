import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { MongooseModule } from '@nestjs/mongoose';
import { Chat, chatModal } from './model/chat.schema';
import { User, userModal } from 'src/auth/model/user.schema';

@Module({
  imports:[
    MongooseModule.forFeature([{name:Chat.name,schema:chatModal}]),
    MongooseModule.forFeature([{name:User.name,schema:userModal}])
  ],
  providers: [ChatGateway]
})
export class ChatModule {}
