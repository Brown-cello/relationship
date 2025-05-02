import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { userRole } from '../enum/user.role.enum';

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsOptional()
  role: userRole;
}
