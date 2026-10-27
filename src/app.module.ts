import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MemberModule } from './member/member.module';
import { RatingModule } from './rating/rating.module';
import { Member } from './member/entities/member.entity';
import { Rating } from './rating/entities/rating.entity';
import { Favorite } from './favorite/entities/favorite.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST ?? 'localhost',
      port: Number(process.env.DB_PORT ?? 3306),
      username: process.env.DB_USERNAME ?? 'root',
      password: process.env.DB_PASSWORD ?? '',
      database: process.env.DB_DATABASE ?? 'umc_movie',
      entities: [Member, Rating, Favorite],
      synchronize: process.env.NODE_ENV !== 'production',
      charset: 'utf8mb4',
    }),
    MemberModule,
    RatingModule,
  ],
})
export class AppModule {}
