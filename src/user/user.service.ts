import { HttpException, Injectable, Req, Res, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
// import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import * as bcrypt from 'bcrypt';
import { createUserProfileDto } from './dto/createUserProfile.dto';
import { profile } from './entities/profile';
import { createUserPostDto } from './dto/createUserPost.dto';
import { post } from './entities/post';
import { Roles } from 'src/auth/guard/role';
import { userRole } from './enum/user.role.enum';
import { LoginDto } from './dto/login.dto';
import { Request,Response } from 'express';

@Injectable()
// user.service file

export class UserService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>, 
  @InjectRepository(profile) private profileRepository: Repository<profile>,
  @InjectRepository(post) private postRepository: Repository<post>,
  private jwtService: JwtService) { }
   async create(payload: CreateUserDto) {
   payload.email = payload.email.toLowerCase()
   const { email, password, ...rest } = payload;
   const user = await this.userRepo.findOne({ where: { email: email } });
   if (user) {
    throw new HttpException('sorry user with this email already exist', 400)
   }
   const hashPassword = await argon2.hash(password);
  
   const userDetails = await this.userRepo.save({
    email,
    password: hashPassword,
    ...rest
   })
   
   const Userpayload = { id: userDetails.id, email: userDetails.email };
   return {
    access_token: await this.jwtService.signAsync(Userpayload),
   };
  
   }
  
  
   async signIn(payload: LoginDto,  @Res() res: Response) {
   const { email, password } = payload;
   // const user = await this.userRepo.findOne({where:{email:email}  })
   const user = await this.userRepo.createQueryBuilder("user").addSelect("user.password").where("user.email = :email", {email:payload.email}).getOne()
   if (!user) {
  throw new HttpException('No email found', 400)
  }
  const checkedPassword = await this.verifyPassword(user.password, password);
  if (!checkedPassword) {
   throw new HttpException('sorry password not exist', 400)
  }
  const token = await this.jwtService.signAsync({
  email: user.email,
   id: user.id
   });
  
   res.cookie('isAuthenticated', token, {
    httpOnly: true,
    maxAge: 1 * 60 * 60 * 1000
   });
   // delete user.password
   return res.send({
    success: true,
 userToken: token
  
   })
  }
  
  async logout(@Req() req: Request, @Res() res: Response) {
  const clearCookie = res.clearCookie('isAuthenticated');
  
  const response = res.send(` user successfully logout`)
  
  return {
   clearCookie,
   response
   }
   }
  
  
  async findEmail(email: string) {
   const mail = await this.userRepo.findOneByOrFail({ email })
   if (!mail) {
    throw new UnauthorizedException()
   }
   return mail;
  }
  
  async findAll() {
   return await this.userRepo.find()
  }
  
  findOne(id: number) {
   return `This action returns a #${id} user`;
   }
  
   update(id: number, updateUserDto: UpdateUserDto) {
  return `This action updates a #${id} user`;
   }
  
   remove(id: number) {
   return `This action removes a #${id} user`;
   }
   async verifyPassword(hashedPassword: string, plainPassword: string,): Promise<boolean> {
   try {
   return await argon2.verify(hashedPassword, plainPassword);
   } catch (err) {
    console.log(err.message)
    return false;
   }
   }
  
   async user(headers: any): Promise<any> {
    const authorizationHeader = headers.authorization; //It tries to extract the authorization header from the incoming request headers. This header typically contains the token used for authentication.
    if (authorizationHeader) {
    const token = authorizationHeader.replace('Bearer ', '');
    const secret = process.env.JWTSECRET;
    //checks if the authorization header exists. If not, it will skip to the else block and throw an error.
    try {
  const decoded = this.jwtService.verify(token);
  let id = decoded["id"]; // After verifying the token, the function extracts the user's id from the decoded token payload.
  let user = await this.userRepo.findOneBy({ id });
  return { id: id,  email: user?.email, role: user?.role };
   } catch (error) {
    throw new UnauthorizedException('Invalid token');
   
   }} else 
    throw new UnauthorizedException('Invalid or missing Bearer token');
   
   }
 
  async createUserProfile(
    id: string,
    createUserProfileDetails: createUserProfileDto,
  ) {
    const user = await this.userRepo.findOneBy({ id });
    if (!user) throw new HttpException('user not found', 401);

    const newProfile = this.profileRepository.create(createUserProfileDetails);
    const savedProfile = await this.profileRepository.save(newProfile);
    user.profile = savedProfile;
    return this.userRepo.save(user);
  }

  async createUserPost(id: string, createUserPostDetails: createUserPostDto) {
    const user = await this.userRepo.findOneBy({ id });
    if (!user) throw new HttpException('user not found', 401);

    const newPost = this.postRepository.create({
      ...createUserPostDetails,
      user,
    });
    return this.postRepository.save(newPost);
  }

  async promoteToAdmin(userId: string): Promise<User> {
    const user = await this.userRepo.findOneBy({ id: userId });

    if (!user) {
      throw new HttpException('User not found', 404);
    }

    user.role = userRole.ADMIN;
    return this.userRepo.save(user);
  }

}
