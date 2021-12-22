import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom, map } from 'rxjs';

@Injectable()
export class HomeService {
  constructor(private httpService: HttpService) {}
  getHello(): string {
    return 'Hello World!';
  }
  // getMusicInfo(): any {
  //   console.log('进入service');
  //   return this.httpService
  //     .get(
  //       'https://pure-music-service.vercel.app/song/url?br=320000&id=591340934',
  //     )
  //     .pipe(map((response) => response.data));
  // }
  async getBannerInfo(): Promise<any> {
    const observable = this.httpService
      .get('https://pure-music-service.vercel.app/banner?type=1')
      .pipe(map((response) => response.data));
    return await lastValueFrom(observable);
  }
  async getRecommendSongs(): Promise<any> {
    const observable = this.httpService
      .get('https://pure-music-service.vercel.app/recommend/songs')
      .pipe(map((response) => response.data));
    return await lastValueFrom(observable);
  }
}
