import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Rating } from '../../rating/entities/rating.entity';
import { Favorite } from './favorite.entity';

@Entity('members')
export class Member {
  @PrimaryGeneratedColumn({ name: 'member_id', type: 'int' })
  memberId: number;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 40, unique: true })
  nickname: string;

  @Column({ type: 'varchar', length: 255, select: false })
  password: string;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
  updatedAt: Date;

  @OneToMany(() => Rating, (rating) => rating.member)
  ratings: Rating[];

  @OneToMany(() => Favorite, (favorite) => favorite.member)
  favorites: Favorite[];
}
