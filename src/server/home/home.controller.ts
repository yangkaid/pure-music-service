import { Controller, Get, Query } from '@nestjs/common';
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
    return this.homeService.getBannerInfo();
  }

  @Get('recommend-songs')
  async getRecommendSongs() {
    return this.homeService.getRecommendSongs();
  }

  @Get('recommend-album')
  async getRecommendAlbum(@Query('offset') offset) {
    return this.homeService.getRecommendAlbums(offset);
  }

  @Get('recommend-rank')
  async getRecommendRank() {
    return this.homeService.getAllRankList();
  }

  @Get('music-url')
  async getMusicUrl(@Query('id') id) {
    return this.homeService.getMusicUrl(id);
  }

  @Get('album-songs')
  async getAlbumSongs(@Query('id') id) {
    return this.homeService.getAlbumList(id);
  }
}
