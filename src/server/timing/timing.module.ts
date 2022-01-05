import { Module } from '@nestjs/common';
import { TimingService } from './timing.service';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Album, Songs } from './entity/timing.entity';
import { ScheduleModule } from '@nestjs/schedule';

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
    TypeOrmModule.forFeature([Album, Songs]),
    ScheduleModule.forRoot(),
  ],
  providers: [TimingService],
})
export class TimingModule {}
