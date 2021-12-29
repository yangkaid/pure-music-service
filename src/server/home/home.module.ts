import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { HomeController } from './home.controller';
import { HomeService } from './home.service';
const tempCookie =
  'NMTID=00OqMB_o4gNiRg8TkM1nbHpmpuR8XYAAAF97ONh0g; MUSIC_U=816eaa2bd8db8743c312735d66de35e27ce07ca0589ea1aa7eae91a70278cbd3993166e004087dd3d78b6050a17a35e705925a4e6992f61d07c385928f88e8de; __remember_me=true; __csrf=7df2f4b98249ab5ffbdaaa7ae1529b02';
@Module({
  imports: [
    HttpModule.register({
      baseURL: 'https://pure-music-service.vercel.app',
      withCredentials: true,
      transformRequest: [
        function (data, headers) {
          headers.cookie = tempCookie;
          return data;
        },
      ],
    }),
  ],
  controllers: [HomeController],
  providers: [HomeService],
})
export class HomeModule {}
