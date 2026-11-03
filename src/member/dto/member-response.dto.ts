export class MemberResponseDto {
  memberId: number;
  email: string;
  nickname: string;

  constructor(memberId: number, email: string, nickname: string) {
    this.memberId = memberId;
    this.email = email;
    this.nickname = nickname;
  }
}
