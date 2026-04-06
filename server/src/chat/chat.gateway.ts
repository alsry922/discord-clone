import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { DefaultEventsMap, Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { MessagesService } from '../messages/messages.service';

type AuthSocket = Socket<
  DefaultEventsMap,
  DefaultEventsMap,
  DefaultEventsMap,
  { user: JwtPayload }
>;

@WebSocketGateway({ cors: { origin: 'http://localhost:5173' } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  // fixme: WebSocketServer 데코레이터는 뭐지?
  // note: NestJS가 생성한 Socket.IO의 Server 인스턴스를 주입받는 데코레이터
  //  서버 레벨에서 브로드캐스트할 때 쓰는 객체
  //  같은 HTTP 서버를 공유해서 WS 요청도 처리할 수 있게 연결한다
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly jwtService: JwtService,
    private readonly messagesService: MessagesService,
  ) {}
  // 클라이언트 연결 시 호출 (JWT 검증 여기서)
  handleConnection(client: AuthSocket) {
    // fixme: ESLint: Unsafe assignment of an `any` value. (@typescript-eslint/no-unsafe-assignment)
    const token = (client.handshake.auth as { token?: string }).token?.split(
      ' ',
    )[1];
    if (!token) {
      client.disconnect();
      return;
    }
    try {
      const payload = this.jwtService.verify<JwtPayload>(token);
      // Note: client.data는 Socket.IO가 제공하는 소켓 인스턴스별 저장공간(HTTP의 request.user 같은 역할)
      // fixme: socket instance는 뭐지?
      // note: socket은 연결된 클라이언트 하나하나를 나타내는 객체
      //  클라이언트 A가 접속하면 A의 Socket, B가 접속하면 B의 Socket이 따로 생김.
      // fixme: client.data가 any 타입이라 user 접근에서 lint 에러 발생
      //  ESLint: Unsafe member access .user on an `any` value. (@typescript-eslint/no-unsafe-member-access)
      // note: AuthSocket을 정의해서 SocketData 타입을 정의해서 해결
      (client.data as { user: JwtPayload }).user = payload;
    } catch {
      client.disconnect(); // 토큰이 유효하지 않으면 연결 끊기
    }
  }

  handleDisconnect(client: AuthSocket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  // 클라이언트가 joinChannel 이벤트를 보내면 Room에 입장
  @SubscribeMessage('joinChannel')
  async handleJoinChannel(
    @MessageBody() data: { channelId: number },
    @ConnectedSocket() client: AuthSocket,
  ) {
    // note:
    await client.join(`channel-${data.channelId}`); // body 추가
  }

  // 클라이언트가 sendMessage 이벤트를 보내면 DB 저장 후 브로드캐스트
  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @MessageBody() data: { channelId: number; content: string },
    @ConnectedSocket() client: AuthSocket,
  ) {
    const user = client.data.user;

    const message = await this.messagesService.create({
      content: data.content,
      channelId: data.channelId,
      authorId: user.sub,
    });
    // 해당 channel room에 브로드캐스트
    // note: client.emit은 해당 client에게만 emit, server.to(...).eit은 특정 room 전체에 보내는거
    this.server.to(`channel-${data.channelId}`).emit('newMessage', message);
  }
}
