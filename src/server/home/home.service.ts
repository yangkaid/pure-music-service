import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom, map } from 'rxjs';

@Injectable()
export class HomeService {
  constructor(private httpService: HttpService) {}
  getHello(): string {
    return 'Hello World!';
  }
  async getBannerInfo(): Promise<any> {
    const observable = this.httpService
      .get('/banner?type=1')
      .pipe(map((response) => response.data));
    const res = await lastValueFrom(observable);
    const bannerArr = res.banners;
    const banners = [];
    bannerArr.forEach((item) => {
      const { pic, url } = item;
      banners.push({ pic, url });
    });
    return banners;
  }

  async getRecommendSongs(): Promise<any> {
    const time = new Date().getTime();
    const observable = this.httpService
      .get(`/recommend/songs`)
      .pipe(map((response) => response.data));
    console.log(time);

    const res = await lastValueFrom(observable);
    // eslint-disable-next-line prefer-const
    let songList = [];
    const songArr = res.data?.dailySongs.slice(0, 9);
    if (songArr) {
      songArr.forEach((item, index) => {
        const {
          name,
          id: name_id,
          ar: [{ id: singer_id, name: singer }],
          al: { id: album_id, picUrl: album_cover, name: album_name },
        } = item;
        songList.push({
          index: index + 1,
          name,
          name_id,
          singer,
          singer_id,
          album_cover,
          album_id,
          album_name,
        });
      });
    }
    return songList;
  }
}
