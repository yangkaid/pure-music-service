import { Module } from '@nestjs/common';
import { TimingService } from './timing.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { Songs } from './entity/song.entity';
import { Album } from './entity/album.entity';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule.register({
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
