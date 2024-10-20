import { InjectModel } from '@nestjs/mongoose';
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Chat } from './model/chat.schema';
import { Model } from 'mongoose';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:4200',
  }
})


export class ChatGateway {
  @WebSocketServer()
  server: Server

  private userStatus: Map<string, 'online' | 'offline'> = new Map();

  constructor(@InjectModel(Chat.name) private messageModel: Model<Chat>) { }


  @SubscribeMessage('joinChat')
  handleJoinChat(@MessageBody() userId:string, @ConnectedSocket() client: Socket){
    client.join(userId)
    this.userStatus.set(userId, 'online')
    this.broadcastUserStatus(userId, 'online');
  }

  @SubscribeMessage('leaveChat')
  handleLeaveChat(@MessageBody() userId:string, @ConnectedSocket() client: Socket) {
    client.leave(userId)
    this.userStatus.set(userId,'offline')
    this.broadcastUserStatus(userId, 'offline');
  }


  @SubscribeMessage('sendMessage')
  async handleMessage(@MessageBody() data: { sender: string, receiver: string, content: string, type?:string}, @ConnectedSocket() client: Socket): Promise<void> {
    const newMessage = await (await this.messageModel.create(data)).populate({path:'receiver',select:'image'})
    this.server.to(data.sender).to(data.receiver).emit('newMessage', newMessage)
  }

  @SubscribeMessage('getAllMessages')
  async getMessages(@MessageBody() data: { sender: string, receiver: string }, @ConnectedSocket() client: Socket): Promise<void> {

    const messages = await this.messageModel.find({
      $or: [
        { sender: data.sender, receiver: data.receiver },
        { sender: data.receiver, receiver: data.sender }
      ]
    }).sort({ timestamp: 1 }).populate({path:'receiver',select:'image'})
    client.emit('allMessages', messages)
  }

  @SubscribeMessage('setUserStatus')
  async handleSetUserStatus(@MessageBody() data: { userId: string; status: 'online' | 'offline' }, @ConnectedSocket() client: Socket): Promise<void> {
    this.userStatus.set(data.userId, data.status);
    this.broadcastUserStatus(data.userId, data.status);
  }

  @SubscribeMessage('getUserStatus')
  async handleGetUserStatus(@MessageBody() userId: string, @ConnectedSocket() client: Socket): Promise<void> {
    const status = this.userStatus.get(userId) || 'offline';
    client.emit('userStatus', { userId, status });
  }

  private broadcastUserStatus(userId: string, status: 'online' | 'offline'): void {
    this.server.emit('userStatusChanged', { userId, status });
  }
  
}
