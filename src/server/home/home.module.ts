import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { HomeController } from './home.controller';
import { HomeService } from './home.service';
import { LoginModule } from '../login/login.module';
import { LoginService } from '../login/login.service';

const cookie = LoginService.getCookie();
@Module({
  imports: [
    HttpModule.register({
      baseURL: 'https://pure-music-service.vercel.app',
      withCredentials: true,
      transformRequest: [
        function (data, headers) {
          headers.cookie = cookie;
          console.log(headers);
          return data;
        },
      ],
    }),
    LoginModule,
  ],
  controllers: [HomeController],
  providers: [HomeService],
})
export class HomeModule {}
