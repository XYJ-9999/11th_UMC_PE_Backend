import { INestApplication, ValidationPipe } from "@nestjs/common";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { Test, TestingModule } from "@nestjs/testing";
import { TypeOrmModule, getRepositoryToken } from "@nestjs/typeorm";
import request from "supertest";
import { Repository } from "typeorm";
import { JwtAuthGuard } from "../src/auth/jwt-auth.guard";
import { HttpExceptionFilter } from "../src/common/filters/http-exception.filter";
import { Member } from "../src/member/entities/member.entity";
import { Favorite } from "../src/member/entities/favorite.entity";
import { Rating } from "../src/rating/entities/rating.entity";
import { RatingController } from "../src/rating/rating.controller";
import { RatingService } from "../src/rating/rating.service";

describe("평점 API (통합 테스트)", () => {
  let app: INestApplication;
  let memberRepository: Repository<Member>;
  let ratingRepository: Repository<Rating>;
  let jwtService: JwtService;
  let member: Member;
  let authorization: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: "sqljs",
          autoSave: false,
          entities: [Member, Rating, Favorite],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([Member, Rating, Favorite]),
        JwtModule.register({
          global: true,
          secret: "rating-e2e-test-secret",
          signOptions: { expiresIn: 3600 },
        }),
      ],
      controllers: [RatingController],
      providers: [RatingService, JwtAuthGuard],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
    app.useGlobalFilters(new HttpExceptionFilter());
    await app.init();

    memberRepository = moduleFixture.get<Repository<Member>>(getRepositoryToken(Member));
    ratingRepository = moduleFixture.get<Repository<Rating>>(getRepositoryToken(Rating));
    jwtService = moduleFixture.get(JwtService);
    member = await memberRepository.save(memberRepository.create({
      email: "rating-test@example.com",
      nickname: "평점테스터",
      password: "hashed-password",
    }));
    authorization = `Bearer ${jwtService.sign({ sub: String(member.memberId), email: member.email })}`;
  });

  beforeEach(async () => {
    await ratingRepository.clear();
  });

  afterAll(async () => {
    await app.close();
  });

  it("인증 토큰 없이 POST /ratings를 요청하면 401과 AUTH401_2를 응답한다", async () => {
    const response = await request(app.getHttpServer())
      .post("/ratings")
      .send({ movieId: 550, score: 9 })
      .expect(401);

    expect(response.body.isSuccess).toBe(false);
    expect(response.body.code).toBe("AUTH401_2");
  });

  it("유효한 Bearer 토큰으로 POST /ratings를 요청하면 201과 등록된 평점 정보를 응답한다", async () => {
    const response = await request(app.getHttpServer())
      .post("/ratings")
      .set("Authorization", authorization)
      .send({ movieId: 550, score: 9, comment: "재미있었습니다." })
      .expect(201);

    expect(response.body.isSuccess).toBe(true);
    expect(response.body.code).toBe("COMMON201");
    expect(response.body.result.movieId).toBe(550);
    expect(response.body.result.score).toBe(9);
    expect(await ratingRepository.count()).toBe(1);
  });
});
