import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoginService } from './server/login/login.service';
import { HomeModule } from './server/home/home.module';
import { LoginModule } from './server/login/login.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TimingModule } from './server/timing/timing.module';
import { Album, Songs } from './server/timing/entity/timing.entity';

@Module({
  imports: [
    HttpModule,
    HomeModule,
    LoginModule,
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '139.196.195.142',
      port: 3306,
      username: 'music',
      password: '123456789',
      database: 'music',
      entities: [Album, Songs],
      synchronize: true,
    }),
    TimingModule,
  ],
  controllers: [AppController],
  providers: [AppService, LoginService],
})
export class AppModule {}
