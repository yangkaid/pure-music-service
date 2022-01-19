import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Album } from './album.entity';

@Entity('songs')
export class Songs {
  @PrimaryGeneratedColumn()
  song_id: number;
  @Column()
  name: string;
  @Column()
  name_id: string;
  @Column()
  singer: string;
  @Column()
  singer_id: string;
  @Column()
  album_cover: string;
  @Column()
  album_id: string;
  @Column()
  album_name: string;
  @OneToMany(() => Album, (album) => album.song, {
    cascade: true,
  })
  album_list: Album[];
}
