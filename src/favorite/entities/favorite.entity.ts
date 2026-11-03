import {
  Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn,
} from 'typeorm';
import { Member } from '../../member/entities/member.entity';

@Entity('favorite')
export class Favorite {
  @PrimaryGeneratedColumn({ name: 'favorite_id', type: 'int' })
  favoriteId: number;

  @ManyToOne(() => Member, (member) => member.favorites, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'member_id', referencedColumnName: 'memberId' })
  member: Member;

  // 영화 메타데이터는 외부 TMDB를 사용하므로 movie 테이블 FK를 두지 않음.
  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;
}
