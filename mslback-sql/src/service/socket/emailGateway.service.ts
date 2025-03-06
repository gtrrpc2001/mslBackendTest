import { ExecutionContext, Inject, UseGuards, forwardRef } from '@nestjs/common';
import {
  WebSocketGateway,
  SubscribeMessage,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { EmailService } from '@service/email.service';
import { commonFun } from 'clsfunc/commonfunc';
import { SocketHeadersGuard } from 'guard/header.guard';
import { WebSocketPerformanceAndErrorLoggingInterceptor } from 'interceptor/performance.interceptor';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  namespace: 'Email',
  cors: {
    origin: '*',
  },
})
@UseGuards(SocketHeadersGuard)
export class EmailGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    @Inject(forwardRef(() => EmailService))
    private readonly emailService: EmailService,
    private readonly interceptor: WebSocketPerformanceAndErrorLoggingInterceptor
  ) { }

  @WebSocketServer()
  server: Server;

  handleDisconnect(client: any) {
    commonFun.interceptorLogging(this.interceptor, client)
    console.log('disconnect success', client.id);
  }
  handleConnection(client: any, ...args: any[]) {
    commonFun.interceptorLogging(this.interceptor, client)
    console.log('connect success', client.id);
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(client: any, roomId: string) {
    console.log(`client : ${client.id} -- roomId : ${roomId}`)
    client.join(roomId);
  }

  @SubscribeMessage('checkEmailVerification')
  async handleEmailVerification(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { token: string; roomId: string }
  ) {
    try {
      const result = await this.emailService.verifyEmail(data);

      this.server.to(data.roomId).emit('emailVerified', { message: result });
    } catch (error) {
      this.server.to(data.roomId).emit('emailVerificationError', { message: error });
    }
  }
}
