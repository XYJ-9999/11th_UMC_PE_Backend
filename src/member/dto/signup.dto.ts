import { ApiProperty } from "@nestjs/swagger";
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
} from "class-validator";

export class SignupDto {
  @ApiProperty({ description: "로그인에 사용할 이메일", example: "movie@example.com" })
  @IsEmail({}, { message: "이메일 형식이 올바르지 않습니다." })
  email: string;

  @ApiProperty({ description: "2~40자의 닉네임", example: "영화조아" })
  @IsString()
  @IsNotEmpty({ message: "닉네임을 입력해주세요." })
  @Length(2, 40, { message: "닉네임은 2자 이상 40자 이하여야 합니다." })
  nickname: string;

  @IsString()
  @Length(8, 72, { message: "비밀번호는 8자 이상 72자 이하여야 합니다." })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d]).+$/, {
    message: "비밀번호는 영문, 숫자, 특수문자를 각각 포함해야 합니다.",
  })
  @ApiProperty({ description: "영문, 숫자, 특수문자를 포함한 8~72자 비밀번호", example: "Movie123!" })
  password: string;
}
