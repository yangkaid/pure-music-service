import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  UploadedFile,
  UseInterceptors,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { BannerService } from './banner.service';

@Controller('banner')
export class BannerController {
  constructor(private readonly bannerService: BannerService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async create(@UploadedFile() file, @Body() body) {
    return this.bannerService.create(file, body);
  }

  @Get()
  findAll() {
    return this.bannerService.findAll();
  }

  @Delete()
  remove(@Query('id') id: string) {
    return this.bannerService.remove(+id);
  }
  @Get('delete')
  remmoveAll() {
    return this.bannerService.removeAll();
  }
}
