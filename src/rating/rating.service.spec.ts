import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { HttpStatus } from "@nestjs/common";
import { ApiException } from "../common/exceptions/api.exception";
import { Member } from "../member/entities/member.entity";
import { Rating } from "./entities/rating.entity";
import { RatingService } from "./rating.service";

describe("RatingService", () => {
  let service: RatingService;
  const ratingRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
  };
  const memberRepository = { findOne: jest.fn() };

  const member = {
    memberId: 1,
    email: "user@example.com",
    nickname: "영화조아",
  } as Member;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RatingService,
        { provide: getRepositoryToken(Rating), useValue: ratingRepository },
        { provide: getRepositoryToken(Member), useValue: memberRepository },
      ],
    }).compile();
    service = module.get<RatingService>(RatingService);
  });

  it("같은 회원이 동일 영화에 평점을 중복 등록하면 RATING409_1 예외를 반환하고 저장하지 않는다", async () => {
    memberRepository.findOne.mockResolvedValue(member);
    ratingRepository.findOne.mockResolvedValue({ ratingId: 10, movieId: 550 });

    try {
      await service.create(1, { movieId: 550, score: 9 });
      fail("중복 평점 등록은 예외를 발생시켜야 합니다.");
    } catch (error) {
      expect(error).toBeInstanceOf(ApiException);
      expect((error as ApiException).getStatus()).toBe(HttpStatus.CONFLICT);
      expect((error as ApiException).code).toBe("RATING409_1");
    }
    expect(ratingRepository.save).not.toHaveBeenCalled();
  });

  it("다른 회원이 작성한 평점을 수정하려 하면 RATING403_1 예외를 반환하고 수정하지 않는다", async () => {
    ratingRepository.findOne.mockResolvedValue({
      ratingId: 20,
      member: { memberId: 2 },
      score: 7,
      comment: "기존 후기",
    });

    try {
      await service.update(1, 20, { score: 10 });
      fail("다른 회원의 평점 수정은 예외를 발생시켜야 합니다.");
    } catch (error) {
      expect(error).toBeInstanceOf(ApiException);
      expect((error as ApiException).getStatus()).toBe(HttpStatus.FORBIDDEN);
      expect((error as ApiException).code).toBe("RATING403_1");
    }
    expect(ratingRepository.save).not.toHaveBeenCalled();
  });
});
