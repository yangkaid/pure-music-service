import { Module } from '@nestjs/common';
import { BannerService } from './banner.service';
import { BannerController } from './banner.controller';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Banner } from './entity/banner.entity';

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
    TypeOrmModule.forFeature([Banner]),
  ],
  controllers: [BannerController],
  providers: [BannerService],
})
export class BannerModule {}
