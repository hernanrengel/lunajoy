import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: { origin: true },
  path: '/ws',
})
export class EventsGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    // El frontend puede enviar ?uid=... en la conexión
    const uid = client.handshake.query?.uid as string | undefined;
    if (uid) client.join(uid);
  }

  // Join room explícito
  @SubscribeMessage('join')
  join(@MessageBody() uid: string, @ConnectedSocket() client: Socket) {
    if (uid) client.join(uid);
    return { ok: true };
  }

  // Emitir un nuevo log a la sala del usuario
  emitNewLog(uid: string, payload: any) {
    console.log(`Emitting log:new to user ${uid}`, payload);
    this.server.to(uid).emit('log:new', payload);
  }

  // Mensaje de prueba
  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    console.log('Message received:', client.id, payload);
    return 'Hello world!';
  }
}
