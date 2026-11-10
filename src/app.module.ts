import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { MemberModule } from './member/member.module';
import { RatingModule } from './rating/rating.module';
import { AuthModule } from './auth/auth.module';
import { Member } from './member/entities/member.entity';
import { Rating } from './rating/entities/rating.entity';
import { Favorite } from './member/entities/favorite.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql' as const,
        host: config.get<string>('DB_HOST', 'localhost'),
        port: Number(config.get<string>('DB_PORT', '3306')),
        username: config.get<string>('DB_USERNAME', 'root'),
        password: config.get<string>('DB_PASSWORD', ''),
        database: config.get<string>('DB_DATABASE', 'movie_rating'),
        entities: [Member, Rating, Favorite],
        synchronize: false,
        autoLoadEntities: true,
        charset: 'utf8mb4',
      }),
    }),
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: Number(config.get<string>('JWT_ACCESS_EXPIRATION', '3600')),
        },
      }),
    }),
    MemberModule,
    RatingModule,
    AuthModule,
  ],
})
export class AppModule {}
