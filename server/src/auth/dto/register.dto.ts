import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  // forbidNonWhiteListed 옵션이 true 일 때,
  // class-validator 데코레이터가 없으면 모든 프로퍼티가 DTO에 정의 안된 것으로 취급됨
  // FIXME: 모든 이메일 형식을 잘 검증하는지?
  @ApiProperty({ example: 'test@test.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'jeong' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @IsNotEmpty()
  password: string;
}
