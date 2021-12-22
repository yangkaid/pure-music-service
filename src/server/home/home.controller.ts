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
      console.log(pic, url);
      banners.push({ pic, url });
    });
    return banners;
  }
}
