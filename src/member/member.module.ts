import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { Favorite } from "./entities/favorite.entity";
import { Member } from "./entities/member.entity";
import { MemberController } from "./member.controller";
import { MemberService } from "./member.service";
import { FavoriteController } from "./favorite.controller";
import { FavoriteService } from "./favorite.service";

@Module({
  imports: [TypeOrmModule.forFeature([Member, Favorite])],
  controllers: [MemberController, FavoriteController],
  providers: [MemberService, FavoriteService, JwtAuthGuard],
  exports: [MemberService],
})
export class MemberModule {}
