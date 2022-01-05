import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom, map } from 'rxjs';

@Injectable()
export class HomeService {
  constructor(private httpService: HttpService) {}
  getHello(): string {
    return 'Hello World!';
  }
  async getApiData(url): Promise<any> {
    const observable = this.httpService
      .get(url)
      .pipe(map((response) => response.data));
    return lastValueFrom(observable);
  }
  async getBannerInfo(): Promise<any> {
    // const observable = this.httpService
    //   .get('/banner?type=1')
    //   .pipe(map((response) => response.data));
    // const res = await lastValueFrom(observable);
    const res = await this.getApiData('/banner?type=1');
    const bannerArr = res.banners;
    const banners = [];
    bannerArr.forEach((item) => {
      const { pic, url } = item;
      banners.push({ pic, url });
    });
    return banners;
  }

  async getRecommendSongs(): Promise<any> {
    const observable = this.httpService
      .get(`/recommend/songs`)
      .pipe(map((response) => response.data));

    const res = await lastValueFrom(observable);
    // eslint-disable-next-line prefer-const
    let songList = [];
    const songArr = res.data?.dailySongs;
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
    }
    return songList;
  }

  async getRecommendAlbums(offset) {
    const observable = this.httpService
      .get(`/top/playlist?limit=12&order=hot&offset=${offset * 12}`)
      .pipe(map((response) => response.data));

    const res = await lastValueFrom(observable);
    const albumList = [];
    res.playlists.forEach((item) => {
      const { name, id, coverImgUrl, description } = item;
      albumList.push({
        name,
        id,
        coverImgUrl,
        description,
      });
    });
    return albumList;
  }

  async getAllRankList() {
    const observable = this.httpService
      .get('/toplist/detail')
      .pipe(map((response) => response.data));

    const res = await lastValueFrom(observable);
    const list = res.list;
    const rankList = [];
    list.forEach((item) => {
      const { tracks, coverImgUrl, name, id } = item;
      rankList.push({
        id,
        name,
        coverImgUrl,
        tracks,
      });
    });
    return rankList;
  }

  async getMusicUrl(id) {
    const observable = this.httpService
      .get(`/song/url?id=${id}`)
      .pipe(map((response) => response.data));
    const res = await lastValueFrom(observable);
    return {
      url: res.data[0].url,
    };
  }

  async getAlbumList(id) {
    const observable = this.httpService
      .get(`/playlist/track/all?id=${id}&limit=50`)
      .pipe(map((response) => response.data));
    const observable1 = this.httpService
      .get(`/playlist/detail?id=${id}`)
      .pipe(map((response) => response.data));
    const res = await lastValueFrom(observable);
    const res1 = await lastValueFrom(observable1);
    const songList = [];
    const { coverImgUrl, description } = res1.playlist;
    res.songs.forEach((item, index) => {
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
    return {
      songList,
      coverImgUrl,
      description,
    };
  }
}
