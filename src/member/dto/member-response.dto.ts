import { Member } from '../entities/member.entity';

export class MemberResponseDto {
  email: string;
  nickname: string;
  createdAt: Date;

  static from(member: Member): MemberResponseDto {
    return {
      email: member.email,
      nickname: member.nickname,
      createdAt: member.createdAt,
    };
  }
}
