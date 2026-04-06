import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

// note: http에서 dto는 요청/응답 body의 타입과 유효성 검사를 위한 것
//  class-validator의 validator decorator를 통해 NestJS가 자동으로 검증
//  WebSocket에서는 http처럼 자동으로 ValidationPipe가 적용되지 않음.
//  따라서 @IsString() 같은 데코레이터들이 동작하지 않음
//  WebSocket에서 유효성 검사를 위해 별도 설정이 필요하며, 지금은 사실상 타입 힌트 역할을 하고 있음
export class CreateMessageDto {
  @ApiProperty()
  @IsString()
  content: string;

  @ApiProperty({ description: '해당 메세지가 저장될 채널의 ID' })
  @IsNumber()
  channelId: number;

  @ApiProperty({ description: '메시지 작성자 ID' })
  @IsNumber()
  authorId: number;
}
