import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { map } from 'rxjs';

@Injectable()
export class AppService {
  constructor(private httpService: HttpService) {}
  getHello(): string {
    return 'Hello World!';
  }
  getMusicInfo(): any {
    console.log('进入service');
    return this.httpService
      .get(
        'https://pure-music-service.vercel.app/song/url?br=320000&id=591340934',
      )
      .pipe(map((response) => response.data));
  }
}
