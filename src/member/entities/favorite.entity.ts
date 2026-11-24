import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from "typeorm";
import { Member } from "./member.entity";

@Entity("favorite")
@Unique("uk_favorite_member_movie", ["member", "movieId"])
export class Favorite {
  @PrimaryGeneratedColumn({ name: "favorite_id" })
  favoriteId: number;

  @ManyToOne(() => Member, (member) => member.favorites, { nullable: false, onDelete: "CASCADE" })
  @JoinColumn({ name: "member_id" })
  member: Member;

  @Column({ name: "movie_id", type: "int" })
  movieId: number;

  @CreateDateColumn({ name: "created_at", type: "datetime" })
  createdAt: Date;
}
