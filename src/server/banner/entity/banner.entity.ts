import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('banner')
export class Banner {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  album_id: string;
  @Column()
  coverImgUrl: string;
  @Column()
  description: string;
  @Column()
  sign: string;
}
