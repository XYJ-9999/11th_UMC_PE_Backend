import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ApiException } from "../common/exceptions/api.exception";
import { Favorite } from "./entities/favorite.entity";
import { Member } from "./entities/member.entity";

@Injectable()
export class FavoriteService {
  constructor(
    @InjectRepository(Favorite) private readonly favoriteRepository: Repository<Favorite>,
    @InjectRepository(Member) private readonly memberRepository: Repository<Member>,
  ) {}

  async create(memberId: number, movieId: number) {
    const member = await this.memberRepository.findOne({ where: { memberId } });
    if (!member) throw new ApiException(HttpStatus.NOT_FOUND, "MEMBER404_1", "해당 회원을 찾을 수 없습니다.");
    const existing = await this.favoriteRepository.findOne({ where: { member: { memberId }, movieId } });
    if (existing) throw new ApiException(HttpStatus.CONFLICT, "FAVORITE409_1", "이미 이 영화를 즐겨찾기하셨습니다.");
    const saved = await this.favoriteRepository.save(this.favoriteRepository.create({ member, movieId }));
    return { favoriteId: saved.favoriteId, movieId: saved.movieId, createdAt: saved.createdAt };
  }

  async getMyFavorites(memberId: number) {
    const favorites = await this.favoriteRepository.find({ where: { member: { memberId } }, order: { favoriteId: "DESC" } });
    return favorites.map(({ favoriteId, movieId, createdAt }) => ({ favoriteId, movieId, createdAt }));
  }

  async getStatus(memberId: number, movieId: number) {
    const isFavorite = await this.favoriteRepository.exists({ where: { member: { memberId }, movieId } });
    return { isFavorite };
  }

  async delete(memberId: number, movieId: number) {
    const favorite = await this.favoriteRepository.findOne({ where: { member: { memberId }, movieId } });
    if (!favorite) throw new ApiException(HttpStatus.NOT_FOUND, "FAVORITE404_1", "즐겨찾기한 영화를 찾을 수 없습니다.");
    await this.favoriteRepository.remove(favorite);
  }
}
