import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Member } from '../member/entities/member.entity';
import { Rating } from './entities/rating.entity';
import { RatingController } from './rating.controller';
import { RatingService } from './rating.service';

@Module({
  imports: [TypeOrmModule.forFeature([Rating, Member])],
  controllers: [RatingController],
  providers: [RatingService, JwtAuthGuard],
})
export class RatingModule {}
