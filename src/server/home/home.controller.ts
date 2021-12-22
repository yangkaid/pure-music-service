import { Controller, Get } from '@nestjs/common';
import { HomeService } from './home.service';

@Controller('home')
export class HomeController {
  constructor(private readonly homeService: HomeService) {}
  @Get()
  getHello(): string {
    return this.homeService.getHello();
  }
  @Get('banner')
  async getInfo(): Promise<any> {
    const res = await this.homeService.getBannerInfo();
    const bannerArr = res.banners;
    const banners = [];
    bannerArr.forEach((item) => {
      const { pic, url } = item;
      banners.push({ pic, url });
    });
    return banners;
  }

  @Get('recommend-songs')
  async getRecommendSongs(): Promise<any[]> {
    interface songInfo {
      index: number;
      name: string;
      name_id: number;
      singer: string;
      singer_id: number;
      album_id: number;
      album_cover: string;
      album_name: string;
    }
    let songList: songInfo[] = [];
    const res = await this.homeService.getRecommendSongs();
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
    } else {
      songList = [
        {
          index: 1,
          name: '测试数据',
          name_id: 1,
          singer: '测试数据',
          singer_id: 1,
          album_id: 1,
          album_cover: '测试数据',
          album_name: '测试数据',
        },
      ];
    }
    console.log(songList);
    return songList;
  }
}
