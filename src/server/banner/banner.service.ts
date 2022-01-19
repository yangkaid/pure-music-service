import { Injectable } from '@nestjs/common';
import { UpdateBannerDto } from './dto/update-banner.dto';
import { encryptFileMD5 } from './utils/crypto';
import * as fs from 'fs';
import { Banner } from './entity/banner.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { join } from 'path';

@Injectable()
export class BannerService {
  constructor(
    @InjectRepository(Banner)
    private readonly bannerRepository: Repository<Banner>,
  ) {}
  create(file, body) {
    const { buffer } = file;
    const currentSign = encryptFileMD5(buffer);
    const arr = file.originalname.split('.');
    const fileType = arr[arr.length - 1];
    const fileName = currentSign + '.' + fileType;
    console.log(join(__dirname, '..', 'banner'));
    fs.writeFileSync(`public/${fileName}`, buffer);
    const src = 'banner' + fileName;
    const banner = new Banner();
    banner.coverImgUrl = src;
    banner.album_id = body.album_id;
    banner.description = body.description;
    banner.sign = currentSign;
    const res = this.bannerRepository.save(banner);
    return res;
  }

  findAll() {
    return `This action returns all banner`;
  }

  findOne(id: number) {
    return `This action returns a #${id} banner`;
  }

  update(id: number, updateBannerDto: UpdateBannerDto) {
    return `This action updates a #${id} banner`;
  }

  remove(id: number) {
    return `This action removes a #${id} banner`;
  }
}
