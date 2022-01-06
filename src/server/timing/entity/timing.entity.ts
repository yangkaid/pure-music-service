import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('albums')
export class Album {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  coverImgUrl: string;
  @Column()
  name: string;
  @Column('text')
  description: string;
  @Column()
  album_id: string;
}

@Entity('songs')
export class Songs {
  @PrimaryGeneratedColumn()
  id: number;
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
  @Column({
    default: false,
  })
  isRecommend: boolean;
  @Column({
    default: 0,
  })
  list_id: string;
}
