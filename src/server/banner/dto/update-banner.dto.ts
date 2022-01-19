import { PartialType } from '@nestjs/mapped-types';
import { CreateBannerDto } from './create-banner.dto';

export class UpdateBannerDto extends PartialType(CreateBannerDto) {
  album_id?: string;
  coverImgUrl?: string;
  description?: string;
}
