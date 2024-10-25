import { InjectModel } from "@nestjs/mongoose";
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Model } from "mongoose";
import { Server, Socket } from "socket.io";
import { GroupMessage } from "./model/group-chat.schema";

require('dotenv').config();

@WebSocketGateway({
    cors: {
        origin: process.env.CLIENT_DOMAIN,
    }
})

export class GroupChatGateway {
    @WebSocketServer()
    server: Server

    constructor(@InjectModel(GroupMessage.name) private messageModel: Model<GroupMessage>) { }


    @SubscribeMessage('sendGroupMessage')
    async handleJoinChat(@MessageBody() data: { groupId: string, sender: string, content: string, type?: string }, @ConnectedSocket() client: Socket): Promise<void> {
        const newMessage = await this.messageModel.create(data)

        const populatedMessage = await newMessage.populate([
            { path: 'sender', select: 'username image' },
            { path: 'groupId', select: 'name' }
        ])

        this.server.to(`group-${data.groupId}`).emit('newGroupMessage', populatedMessage)
    }

    @SubscribeMessage('getGroupMessages')
    async handleGetGroupMessages(@MessageBody() groupId: string, @ConnectedSocket() client: Socket): Promise<void> {

        const messages = await this.messageModel.find({ groupId })
            .sort({ timestamp: 1 })
            .populate([
                { path: 'sender', select: 'username image' },
                { path: 'groupId', select: 'name' }
            ]);

        client.emit('allGroupMessages', messages);

    }

}
