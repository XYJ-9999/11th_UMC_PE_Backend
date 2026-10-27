import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Unique,
} from 'typeorm';
import { Member } from '../../member/entities/member.entity';

@Entity({ name: 'rating' })
@Unique('uk_rating_member_movie', ['member', 'movieId'])
export class Rating {
  @PrimaryGeneratedColumn({ name: 'rating_id', type: 'bigint' })
  ratingId: string;

  @ManyToOne(() => Member, (member) => member.ratings, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'member_id', referencedColumnName: 'memberId' })
  member: Member;

  @Column({ name: 'movie_id', type: 'bigint' })
  movieId: string;

  @Column({ type: 'tinyint', unsigned: true })
  score: number;

  @Column({ type: 'text', nullable: true })
  comment: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
  updatedAt: Date;
}
