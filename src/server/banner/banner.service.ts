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
    fs.writeFileSync(`public/${fileName}`, buffer);
    const src = process.env.LOCALHOST + '/' + fileName;
    const banner = new Banner();
    banner.coverImgUrl = src;
    banner.album_id = body.album_id;
    banner.description = body.description;
    banner.sign = fileName;
    const res = this.bannerRepository.save(banner);
    return res;
  }

  findAll() {
    return this.bannerRepository.query(`SELECT * FROM banner`);
  }

  async remove(id: number) {
    const banner: any = await this.bannerRepository.find({ id });
    console.log(banner);
    fs.unlinkSync(`public/${banner[0].sign}`);
    this.bannerRepository.delete({ id });
    return `删除成功${id}`;
  }

  removeAll() {
    this.bannerRepository.clear();
    return '全部删除';
  }
}
