import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { HomeController } from './home.controller';
import { HomeService } from './home.service';

@Module({
  imports: [
    HttpModule.registerAsync({
      useFactory: () => ({
        timeout: 5000,
        maxRedirects: 5,
      }),
    }),
  ],
  controllers: [HomeController],
  providers: [HomeService],
})
export class HomeModule {}
