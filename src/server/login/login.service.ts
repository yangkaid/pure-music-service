import { Injectable, Logger } from '@nestjs/common';
import { Timeout } from '@nestjs/schedule';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class LoginService {
  private readonly logger = new Logger(LoginService.name);
  constructor(private httpService: HttpService) {}

  @Timeout(1000 * 60 * 5)
  async loginByCellphone() {
    const time = new Date().getTime();
    const observable = this.httpService.get(
      `https://pure-music-service.vercel.app/login/cellphone?timestamp=${time}`,
    );
    this.logger.log('重新登录');
  }
}
