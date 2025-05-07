import { IsNumber, IsString } from 'class-validator';

export class createUserProfileDto {

  @IsNumber()
  age: Number;

  @IsString()
  dob: string;
}
