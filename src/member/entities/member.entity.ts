import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Rating } from '../../rating/entities/rating.entity';
import { Favorite } from '../../favorite/entities/favorite.entity';

@Entity({ name: 'member' })
export class Member {
  @PrimaryGeneratedColumn({ name: 'member_id', type: 'bigint' })
  memberId: string;

  @Column({ type: 'varchar', length: 254, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 60 })
  password: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  nickname: string;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
  updatedAt: Date;

  @OneToMany(() => Rating, (rating) => rating.member)
  ratings: Rating[];

  @OneToMany(() => Favorite, (favorite) => favorite.member)
  favorites: Favorite[];
}
