import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Cron, Interval, Timeout } from '@nestjs/schedule';
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
  // @Interval(1000 * 60 * 60)
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

  // @Cron('15 15 0 * * ? *')
  // @Interval(1000 * 5)
  @Timeout(1000 * 5)
  async getRecommendSongs() {
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
      const obj = await this.songsRepository.findOne({ name_id });
      if (!obj) {
        song.name_id = name_id;
        song.name = name;
        song.singer_id = singer_id;
        song.singer = singer;
        song.album_id = album_id;
        song.album_cover = album_cover;
        song.album_name = album_name;
        song.isRecommend = true;
        await this.songsRepository.save(song);
      } else {
        await this.songsRepository.update(obj, { isRecommend: true });
      }
    });
    console.log('推荐歌曲已更新');
  }

  // @Cron('15 20 0 * * ? *')
  @Timeout(1000 * 20)
  async getRecommendAlbums() {
    await this.albumsRepository.clear();
    const res = await this.getApiData('/top/playlist/highquality?limit=30');
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
    // res.playlists.forEach(async (item) => {
    //   const album = new Album();
    //   const { name, id: album_id, coverImgUrl, description } = item;
    //   const obj = await this.albumsRepository.findOne({ album_id });
    //   if (!obj) {
    //     album.name = name;
    //     album.album_id = album_id;
    //     album.coverImgUrl = coverImgUrl;
    //     album.description = description;
    //     await this.albumsRepository.save(album);
    //     await this.getAlbumSongs(album_id);
    //   }
    // });
    console.log('推荐歌单创建成功');
  }

  async getAlbumSongs(id) {
    const res = await this.getApiData(`/playlist/detail?id=${id}`);
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
        song.list_id = id;
        await this.songsRepository.save(song);
      } else if (!obj.list_id.includes(id)) {
        const newListId = obj.list_id + `,${id}`;
        await this.songsRepository.update(obj, { list_id: newListId });
      }
    }
    console.log('歌曲创建成功', id);
  }

  @Timeout(1000 * 60 * 5)
  async getRankAlbums() {
    const res = await this.getApiData('/toplist/detail');
    for (const item of res.list) {
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
