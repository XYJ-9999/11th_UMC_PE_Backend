# NestJS Movie Rating API

## 설치 및 실행

```bash
npm install
```

`.env.example`을 복사해 `.env`를 만들고 MySQL 접속 정보와 `JWT_SECRET`을 설정합니다.

```bash
npm run start:dev
```

- Swagger UI: `http://localhost:3000/swagger-ui`
- OpenAPI JSON: `http://localhost:3000/swagger-ui-json`

Swagger의 Authorize 버튼에서 로그인 API가 반환한 `accessToken`을 입력하면 인증이 필요한 API를 호출할 수 있습니다.

## 테스트

```bash
# 평점 서비스 단위 테스트 (2개)
npm test -- --runInBand

# 평점 API 통합 테스트 (2개, sql.js 메모리 DB 사용)
npm run test:e2e -- --runInBand
```

통합 테스트는 MySQL 개발 DB를 사용하지 않습니다.

## 주요 API

- `POST /ratings`: 평점 등록 (인증 필요)
- `PATCH /ratings/:ratingId`: 평점 수정 (인증 필요)
- `DELETE /ratings/:ratingId`: 평점 삭제 (인증 필요)
- `GET /members/:memberId/ratings`: 회원별 평점 조회 (공개)
- `GET /members/me`, `PATCH /members/me`: 내 정보 조회/수정 (인증 필요)
- `GET /favorites`: 내 즐겨찾기 조회 (인증 필요)
- `GET /favorites/:movieId`: 즐겨찾기 여부 조회 (인증 필요)
- `POST /favorites` 또는 `POST /favorites/:movieId`: 즐겨찾기 추가 (인증 필요)
- `DELETE /favorites/:movieId`: 즐겨찾기 해제 (인증 필요)
