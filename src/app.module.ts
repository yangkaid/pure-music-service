import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HomeModule } from './server/home/home.module';

@Module({
  imports: [HttpModule, HomeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
