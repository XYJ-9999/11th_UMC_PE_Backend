import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  Unique,
} from 'typeorm';
import { Member } from '../../member/entities/member.entity';

@Entity({ name: 'favorite' })
@Unique('uk_favorite_member_movie', ['member', 'movieId'])
export class Favorite {
  @PrimaryGeneratedColumn({ name: 'favorite_id', type: 'bigint' })
  favoriteId: string;

  @ManyToOne(() => Member, (member) => member.favorites, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'member_id', referencedColumnName: 'memberId' })
  member: Member;

  @Column({ name: 'movie_id', type: 'bigint' })
  movieId: string;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
  updatedAt: Date;
}
