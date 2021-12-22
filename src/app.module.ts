import { HttpModule } from '@nestjs/axios';
import { ScheduleModule } from '@nestjs/schedule';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoginService } from './server/login/login.service';
import { HomeModule } from './server/home/home.module';
import { LoginModule } from './server/login/login.module';

@Module({
  imports: [HttpModule, HomeModule, ScheduleModule.forRoot(), LoginModule],
  controllers: [AppController],
  providers: [AppService, LoginService],
})
export class AppModule {}
