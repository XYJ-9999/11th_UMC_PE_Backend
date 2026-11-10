import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { Member } from '../../member/entities/member.entity';

@Entity('ratings')
@Unique('uq_rating_member_movie', ['member', 'movieId'])
export class Rating {
  @PrimaryGeneratedColumn({ name: 'rating_id', type: 'int' })
  ratingId: number;

  @ManyToOne(() => Member, (member) => member.ratings, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'member_id' })
  member: Member;

  @Column({ name: 'movie_id', type: 'int' })
  movieId: number;

  @Column({ type: 'tinyint' })
  score: number;

  @Column({ type: 'text', nullable: true })
  comment: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
  updatedAt: Date;
}
