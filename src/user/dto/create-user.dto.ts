import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { userRole } from '../enum/user.role.enum';

export class CreateUserDto {
 

  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsOptional()
  role: userRole;
}
