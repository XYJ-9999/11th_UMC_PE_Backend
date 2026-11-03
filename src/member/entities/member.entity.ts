import {
  Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn,
} from 'typeorm';
import { Rating } from '../../rating/entities/rating.entity';
import { Favorite } from '../../favorite/entities/favorite.entity';

@Entity('member')
export class Member {
  @PrimaryGeneratedColumn({ name: 'member_id', type: 'int' })
  memberId: number;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 60, select: false })
  password: string;

  @Column({ type: 'varchar', length: 12, unique: true })
  nickname: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @OneToMany(() => Rating, (rating) => rating.member)
  ratings: Rating[];

  @OneToMany(() => Favorite, (favorite) => favorite.member)
  favorites: Favorite[];
}
