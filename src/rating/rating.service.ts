import {
  ConflictException, ForbiddenException, Injectable, NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Member } from '../member/entities/member.entity';
import { Rating } from './entities/rating.entity';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';

@Injectable()
export class RatingService {
  constructor(
    @InjectRepository(Rating) private readonly ratingRepository: Repository<Rating>,
    @InjectRepository(Member) private readonly memberRepository: Repository<Member>,
  ) {}

  async create(dto: CreateRatingDto) {
    const member = await this.memberRepository.findOneBy({ memberId: dto.memberId });
    if (!member) throw new NotFoundException('존재하지 않는 회원입니다.');

    const duplicated = await this.ratingRepository.exist({
      where: { member: { memberId: dto.memberId }, movieId: dto.movieId },
    });
    if (duplicated) {
      throw new ConflictException({
        code: 'RATING4091',
        message: '이미 해당 영화에 평점을 등록했습니다.',
      });
    }

    const rating = this.ratingRepository.create({
      member,
      movieId: dto.movieId,
      score: dto.score,
      comment: dto.comment ?? null,
    });
    const saved = await this.ratingRepository.save(rating);
    return {
      ratingId: saved.ratingId,
      memberId: member.memberId,
      movieId: saved.movieId,
      score: saved.score,
      comment: saved.comment,
    };
  }

  async update(ratingId: number, memberId: number, dto: UpdateRatingDto) {
    const rating = await this.findOwnedRating(ratingId, memberId);
    rating.score = dto.score;
    rating.comment = dto.comment ?? null;
    const saved = await this.ratingRepository.save(rating);
    return {
      ratingId: saved.ratingId,
      memberId,
      movieId: saved.movieId,
      score: saved.score,
      comment: saved.comment,
    };
  }

  async delete(ratingId: number, memberId: number): Promise<void> {
    const rating = await this.findOwnedRating(ratingId, memberId);
    await this.ratingRepository.remove(rating);
  }

  private async findOwnedRating(ratingId: number, memberId: number): Promise<Rating> {
    const rating = await this.ratingRepository.findOne({
      where: { ratingId },
      relations: { member: true },
    });
    if (!rating) throw new NotFoundException('존재하지 않는 평점입니다.');
    if (rating.member.memberId !== memberId) {
      throw new ForbiddenException('본인이 작성한 평점만 수정하거나 삭제할 수 있습니다.');
    }
    return rating;
  }
}
