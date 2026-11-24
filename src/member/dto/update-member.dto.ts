import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Length } from "class-validator";

export class UpdateMemberDto {
  @ApiProperty({ description: "변경할 닉네임 (2~40자)", example: "영화조아" })
  @IsString()
  @IsNotEmpty({ message: "닉네임을 입력해주세요." })
  @Length(2, 40, { message: "닉네임은 2자 이상 40자 이하여야 합니다." })
  nickname: string;
}
