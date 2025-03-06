import { UseGuards } from '@nestjs/common';
import {
  WebSocketGateway,
  SubscribeMessage,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { commonFun } from 'clsfunc/commonfunc';
import { SocketHeadersGuard } from 'guard/header.guard';
import { WebSocketPerformanceAndErrorLoggingInterceptor } from 'interceptor/performance.interceptor';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  namespace: 'Guardian',
  cors: {
    origin: '*',
  },
})
@UseGuards(SocketHeadersGuard)
export class GuardianGateway
  implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly interceptor: WebSocketPerformanceAndErrorLoggingInterceptor
  ) { }

  private rooms: Map<string, { Id: string; members: Set<string> }> = new Map();

  private keys: Map<string, { roomId: string; boss?: boolean }> = new Map();

  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket, ...args: any[]) {
    commonFun.interceptorLogging(this.interceptor, client)
    client.emit('getId', client.id);
    console.log('connect success', client.id);
  }

  handleDisconnect(client: Socket) {
    commonFun.interceptorLogging(this.interceptor, client)
    const { roomId, boss } = this.keys.get(client.id);
    const room = this.rooms.get(roomId);
    if (!room) {
      // 방이 존재하지 않는 경우의 처리
      client.emit('error', `Room ${roomId} does not exist.`);
      return;
    }

    if (room.Id === roomId && boss) {
      // 사용자가 방장일 때의 처리 로직
      this.userLeave(client, roomId);
      this.server
        .to(roomId)
        .emit('roomDeleted', `Room ${roomId} has been deleted.`);
    } else {
      this.guardianLeave(client, roomId, room);
    }
    console.log('disconnect success', client.id);
  }

  //roomId 가 eq 값

  @SubscribeMessage('createRoom')
  handleCreateRoom(
    @MessageBody() data: { userId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { userId } = data;
    const roomId = userId; // 방 ID 생성 로직은 별도로 구현해야 합니다.
    this.rooms.set(roomId, { Id: userId, members: new Set([client.id]) });
    client.join(roomId);
    this.keys.set(client.id, { roomId: roomId, boss: true });

    // 방 생성 및 방장 지정 메시지 전송
    this.server.to(roomId).emit('roomCreated', { roomId, clientId: client.id });
  }

  @SubscribeMessage('userLeave')
  handleCheckHost(
    @MessageBody() data: { userId: string; roomId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { userId, roomId } = data;
    const room = this.rooms.get(roomId);

    if (!room) {
      // 방이 존재하지 않는 경우의 처리
      client.emit('error', `Room ${roomId} does not exist.`);
      return;
    }

    if (room.Id === userId) {
      // 사용자가 방장일 때의 처리 로직
      this.userLeave(client, roomId);
      this.server
        .to(roomId)
        .emit('roomDeleted', `Room ${roomId} has been deleted.`);
    }
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(
    @MessageBody() data: { roomId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { roomId } = data;
    const room = this.rooms.get(roomId);

    if (!room) {
      // 방이 존재하지 않는 경우
      client.emit('error', `Room ${roomId} does not exist.`);
      return;
    }

    room.members.add(client.id);
    this.keys.set(client.id, { roomId: roomId });
    client.join(roomId);
    this.server
      .to(roomId)
      .emit('joinedRoom', `User ${client.id} has joined room ${roomId}`);
  }

  @SubscribeMessage('sendMessage')
  handleSendMessage(@MessageBody() data: { roomId: string; message: string }) {
    const { roomId, message } = data;

    this.server.to(roomId).emit('newMessage', message);
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(
    @MessageBody() data: { roomId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { roomId } = data;
    const room = this.rooms.get(roomId);

    if (!room) {
      client.emit('error', `Room ${roomId} does not exist.`);
      return;
    }

    this.guardianLeave(client, roomId, room);
    // 클라이언트가 Room을 떠났음을 알립니다.
    this.server
      .to(roomId)
      .emit('leftRoom', `User ${client.id} has left room ${roomId}`);
  }

  guardianLeave = (
    client: Socket,
    roomId: string,
    room: { Id: string; members: Set<string> },
  ) => {
    client.leave(roomId);
    room.members.delete(client.id);
    this.keys.delete(client.id);
  };

  userLeave = (client: Socket, roomId: string) => {
    client.leave(roomId);
    this.rooms.delete(roomId);
    this.keys.delete(client.id);
  };


}
