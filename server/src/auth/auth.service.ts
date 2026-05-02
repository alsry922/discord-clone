import { Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { AuthException } from './exceptions/auth.exception';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async register(createAuthDto: RegisterDto) {
    const { email, username, password } = createAuthDto;
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw AuthException.conflict();
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = this.userRepository.create({
      email,
      nickname: username,
      password: hashedPassword,
    });

    await this.userRepository.save(user);
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw AuthException.invalidCredentials();
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw AuthException.invalidCredentials();
    }
    // JWT 표준 claim(클레임), payload에 들어감.
    // - sub: subject, 토큰의 주체(누구의 토큰인지)를 나타냄
    //    - 보통 user id
    // - iss: issuer, 토큰 발급자
    // - exp: expiration, 만료 시간
    // - aud: audience, 토큰 대상자
    //    - 누가 사용할 수 있는지 나타냄(모바일 전용, 웹 전용)
    const token = this.jwtService.sign<JwtPayload>({
      sub: user.id,
      email: user.email,
    });

    return { accessToken: token };
  }
}
