import {
  Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne,
  PrimaryGeneratedColumn, UpdateDateColumn,
} from 'typeorm';
import { Member } from '../../member/entities/member.entity';

@Entity('rating')
@Index('uq_rating_member_movie', ['member', 'movieId'], { unique: true })
export class Rating {
  @PrimaryGeneratedColumn({ name: 'rating_id', type: 'int' })
  ratingId: number;

  @ManyToOne(() => Member, (member) => member.ratings, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'member_id', referencedColumnName: 'memberId' })
  member: Member;

  @Column({ name: 'movie_id', type: 'int' })
  movieId: number;

  @Column({ type: 'tinyint', unsigned: true })
  score: number;

  @Column({ type: 'varchar', length: 500, nullable: true })
  comment: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
