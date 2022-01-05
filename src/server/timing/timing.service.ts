import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Cron, Interval } from '@nestjs/schedule';
import { lastValueFrom, map } from 'rxjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Album, Songs } from './entity/timing.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TimingService {
  constructor(
    private httpService: HttpService,
    @InjectRepository(Album)
    private albumsRepository: Repository<Album>,
    @InjectRepository(Songs)
    private songsRepository: Repository<Songs>,
  ) {}
  async getApiData(url): Promise<any> {
    const observable = this.httpService
      .get(url)
      .pipe(map((response) => response.data));
    return lastValueFrom(observable);
  }
  @Interval(1000 * 60 * 60)
  async getBanner() {
    await this.albumsRepository.clear();
    const res = await this.getApiData('/top/playlist?order=hot&limit=12');
    res.playlists.forEach(async (item) => {
      const banner = new Album();
      const { name, id: album_id, coverImgUrl, description } = item;
      banner.name = name;
      banner.album_id = album_id;
      banner.coverImgUrl = coverImgUrl;
      banner.description = description;
      await this.albumsRepository.save(banner);
    });
    console.log('banner创建成功');
  }

  @Cron('15 15 0 * * ? *')
  async getRecommendSongs() {
    await this.songsRepository.clear();
    const res = await this.getApiData('/recommend/songs');
    const songArr = res.data?.dailySongs;
    songArr.forEach(async (item) => {
      const song = new Songs();
      const {
        name,
        id: name_id,
        ar: [{ id: singer_id, name: singer }],
        al: { id: album_id, picUrl: album_cover, name: album_name },
      } = item;
      song.name_id = name_id;
      song.name = name;
      song.singer_id = singer_id;
      song.singer = singer;
      song.album_id = album_id;
      song.album_cover = album_cover;
      song.album_name = album_name;
      await this.songsRepository.save(song);
    });
    console.log('推荐歌曲已更新');
  }

  @Cron('15 20 0 * * ? *')
  async getRecommendAlbums() {
    await this.albumsRepository.clear();
    const res = await this.getApiData('/top/playlist/highquality?limit=50');
    res.playlists.forEach(async (item) => {
      const banner = new Album();
      const { name, id: album_id, coverImgUrl, description } = item;
      banner.name = name;
      banner.album_id = album_id;
      banner.coverImgUrl = coverImgUrl;
      banner.description = description;
      await this.albumsRepository.save(banner);
    });
    console.log('banner创建成功');
  }
}
