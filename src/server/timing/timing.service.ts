import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Cron, Interval, Timeout } from '@nestjs/schedule';
import { lastValueFrom, map } from 'rxjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Album } from './entity/album.entity';
import { Songs } from './entity/song.entity';

@Injectable()
export class TimingService {
  qq: 'http://139.196.195.142:3300';
  wangyi: 'https://pure-music-service.vercel.app';
  constructor(
    private httpService: HttpService,
    @InjectRepository(Album)
    private albumsRepository: Repository<Album>,
    @InjectRepository(Songs)
    private songsRepository: Repository<Songs>,
  ) {}
  async getApiData(url, type): Promise<any> {
    const observable = this.httpService
      .get(type + url)
      .pipe(map((response) => response.data));
    return lastValueFrom(observable);
  }

  // @Cron('15 15 0 * * ? *')
  // @Interval(1000 * 5)
  // @Timeout(1000 * 5)
  async getRecommendSongs() {
    const res = await this.getApiData('/recommend/songs', this.wangyi);
    const songArr = res.data?.dailySongs;
    const recommend_album = await this.albumsRepository.findOne({
      album_id: '000000',
    });
    if (!recommend_album) {
      const album = new Album();
      album.album_id = '000000';
      album.name = '推荐歌曲';
      album.description = '这个歌单是今天的推荐歌曲，每日更新';
      album.coverImgUrl = 'default';
      this.albumsRepository.save(album);
    }
    songArr.forEach(async (item) => {
      const song = new Songs();
      const {
        name,
        id: name_id,
        ar: [{ id: singer_id, name: singer }],
        al: { id: album_id, picUrl: album_cover, name: album_name },
      } = item;
      const obj = await this.songsRepository.findOne({ name_id });
      if (!obj) {
        song.name_id = name_id;
        song.name = name;
        song.singer_id = singer_id;
        song.singer = singer;
        song.album_id = album_id;
        song.album_cover = album_cover;
        song.album_name = album_name;
        song.album_list = [recommend_album];
        await this.songsRepository.save(song);
        console.log('保存歌曲完成');
      }
    });
    console.log('推荐歌曲已更新');
  }

  // @Cron('15 20 0 * * ? *')
  // @Timeout(1000 * 20)
  async getRecommendAlbums() {
    // await this.albumsRepository.clear();
    const res = await this.getApiData('/top/playlist/highquality?limit=50');
    for (const item of res.playlists) {
      const album = new Album();
      const { name, id: album_id, coverImgUrl, description } = item;
      const obj = await this.albumsRepository.findOne({ album_id });
      if (!obj) {
        album.name = name;
        album.album_id = album_id;
        album.coverImgUrl = coverImgUrl;
        album.description = description;
        await this.albumsRepository.save(album);
        await this.getAlbumSongs(album_id);
      }
    }
    console.log('推荐歌单创建成功');
  }

  async getAlbumSongs(id) {
    const res = await this.getApiData(`/playlist/detail?id=${id}`);
    const album_item = await this.albumsRepository.findOne({ album_id: id });
    for (const item of res.playlist.trackIds.slice(0, 50)) {
      const songInfo = await this.getApiData(`/song/detail?ids=${item.id}`);
      const song = new Songs();
      const {
        name,
        id: name_id,
        ar: [{ id: singer_id, name: singer }],
        al: { id: album_id, picUrl: album_cover, name: album_name },
      } = songInfo.songs[0];
      const obj = await this.songsRepository.findOne({ name_id: name_id });
      if (!obj) {
        song.name = name;
        song.name_id = name_id;
        song.singer_id = singer_id;
        song.singer = singer;
        song.album_id = album_id;
        song.album_cover = album_cover;
        song.album_name = album_name;
        song.album_list ? song.album_list.push(album_item) : [album_item];
        await this.songsRepository.save(song);
      } else {
        song.album_list ? song.album_list.push(album_item) : [album_item];
        await this.songsRepository.save(obj);
      }
    }
    console.log('歌曲创建成功', id);
  }

  // @Timeout(1000 * 60)
  async getRankAlbums() {
    console.log('开始');
    const res = await this.getApiData('/toplist/detail');
    for (const item of res.list.slice(0, 6)) {
      const album = new Album();
      // eslint-disable-next-line prefer-const
      let { name, id: album_id, coverImgUrl, description, tracks } = item;
      const obj = await this.albumsRepository.findOne({ album_id });
      if (!obj) {
        tracks = JSON.stringify(tracks);
        album.name = name;
        album.album_id = album_id;
        album.coverImgUrl = coverImgUrl;
        album.description = description;
        album.tracks = tracks;
        await this.albumsRepository.save(album);
        await this.getAlbumSongs(album_id);
      }
    }
    console.log('榜单创建成功');
  }
}
