import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';


@WebSocketGateway({
  cors:{
    origin: 'http://localhost:4200',
  }
})
export class ChatGateway {
  @SubscribeMessage('sendMessage')
  handleMessage(@MessageBody() message: string, @ConnectedSocket() client: Socket): void {
    client.emit('newMessage', message)
  }
}
