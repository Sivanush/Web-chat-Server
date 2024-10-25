import { Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatService } from './chat/chat.service';
import { ChatController } from './chat/chat.controller';
import { ChatModule } from './chat/chat.module';
import { AuthModule } from './auth/user.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthGuard } from './guards/guards.guard';
import { GroupChatModule } from './group-chat/group-chat.module';



@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGODB_URI),
    ChatModule, AuthModule, GroupChatModule],
  controllers: [AppController],
  providers: [AppService, AuthGuard],
})
export class AppModule { }
