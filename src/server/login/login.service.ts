import { Injectable, Logger } from '@nestjs/common';
import { Timeout } from '@nestjs/schedule';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom, map } from 'rxjs';

@Injectable()
export class LoginService {
  private readonly logger = new Logger(LoginService.name);
  static cookie: any;
  constructor(private httpService: HttpService) {}

  @Timeout(1000 * 60 * 5)
  async loginByCellphone() {
    const observable = this.httpService
      .get(`/login/cellphone?phone=17513363195&password=yk19990614`)
      .pipe(map((response) => response.data));
    const res: any = await lastValueFrom(observable);
    this.logger.log(res.cookie);
    LoginService.cookie = res.cookie;
    this.logger.log('重新登录');
  }

  static getCookie() {
    return this.cookie;
  }
}
