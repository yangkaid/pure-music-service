import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Songs } from './song.entity';

@Entity('albums')
export class Album {
  @PrimaryGeneratedColumn()
  play_id: number;
  @Column()
  coverImgUrl: string;
  @Column()
  name: string;
  @Column('text')
  description: string;
  @Column()
  album_id: string;
  @Column({
    default: 0,
  })
  tracks: string;
  @ManyToOne(() => Songs, (song) => song.album_list)
  song: Songs;
}
