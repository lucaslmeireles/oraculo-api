import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwt: JwtService) {}

  login(nickname: string) {
    return { token: this.jwt.sign({ nickname }) };
  }
}
