import { Body, Controller, Post } from '@nestjs/common';
import { CredentialDto } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { ThrottlerGuard } from '@nestjs/throttler';
import { UseGuards } from '@nestjs/common';

@UseGuards(ThrottlerGuard)
@Controller('auth')
export class AuthController {
  constructor(private service: AuthService) {}
  @Post('login')
  login(@Body() dto: CredentialDto) {
    return this.service.login(dto.nickname);
  }
}
