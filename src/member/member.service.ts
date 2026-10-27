import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Member } from './entities/member.entity';
import { Rating } from '../rating/entities/rating.entity';
import { AvailabilityResponseDto } from './dto/availability-response.dto';
import { MemberRatingResponseDto } from './dto/member-rating-response.dto';

@Injectable()
export class MemberService {
  constructor(
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,
    @InjectRepository(Rating)
    private readonly ratingRepository: Repository<Rating>,
  ) {}

  async checkNickname(nickname: string): Promise<AvailabilityResponseDto> {
    const exists = await this.memberRepository.exists({ where: { nickname } });
    return new AvailabilityResponseDto(!exists);
  }

  async checkEmail(email: string): Promise<AvailabilityResponseDto> {
    const exists = await this.memberRepository.exists({ where: { email } });
    return new AvailabilityResponseDto(!exists);
  }

  async getMemberRatings(memberId: number): Promise<MemberRatingResponseDto[]> {
    const member = await this.memberRepository.findOne({
      where: { memberId: String(memberId) },
      select: { memberId: true },
    });

    if (!member) {
      throw new NotFoundException('회원이 존재하지 않습니다.');
    }

    const ratings = await this.ratingRepository.find({
      where: { member: { memberId: String(memberId) } },
      order: { createdAt: 'DESC', ratingId: 'DESC' },
    });

    return ratings.map(
      (rating) =>
        new MemberRatingResponseDto({
          ratingId: rating.ratingId,
          movieId: rating.movieId,
          score: rating.score,
          comment: rating.comment,
          createdAt: rating.createdAt,
          updatedAt: rating.updatedAt,
        }),
    );
  }
}
