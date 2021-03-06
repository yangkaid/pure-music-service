import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { HomeController } from './home.controller';
import { HomeService } from './home.service';
@Module({
  imports: [
    HttpModule.register({
      baseURL: 'https://pure-music-service.vercel.app',
      withCredentials: true,
      transformRequest: [
        function (data, headers) {
          headers.cookie = process.env.COOKIE;
          return data;
        },
      ],
    }),
  ],
  controllers: [HomeController],
  providers: [HomeService],
})
export class HomeModule {}
