import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
}
