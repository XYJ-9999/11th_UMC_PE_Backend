import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Favorite } from './entities/favorite.entity';
import { Member } from './entities/member.entity';
import { MemberController } from './member.controller';
import { MemberService } from './member.service';

@Module({
  imports: [TypeOrmModule.forFeature([Member, Favorite])],
  controllers: [MemberController],
  providers: [MemberService, JwtAuthGuard],
  exports: [MemberService],
})
export class MemberModule {}
