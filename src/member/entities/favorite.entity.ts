import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Member } from './member.entity';

@Entity('favorites')
@Unique('uq_favorite_member_movie', ['member', 'movieId'])
export class Favorite {
  @PrimaryGeneratedColumn({ name: 'favorite_id', type: 'int' })
  favoriteId: number;

  @ManyToOne(() => Member, (member) => member.favorites, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'member_id' })
  member: Member;

  // Movie domain is outside this mission; movieId is kept as an external identifier.
  @Column({ name: 'movie_id', type: 'int' })
  movieId: number;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt: Date;
}
