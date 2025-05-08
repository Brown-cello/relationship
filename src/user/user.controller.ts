import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Res, ParseIntPipe, } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { createUserProfileDto } from './dto/createUserProfile.dto';
import { createUserPostDto } from './dto/createUserPost.dto';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/guard/role';
import { RolesGuard } from '../auth/guard/role.guard';
import { JwtAuthGuard } from '../auth/JWT AuthGuard/jwt-auth.guard';
import { userRole } from './enum/user.role.enum';
import { LoginDto } from './dto/login.dto';
import {  Response } from 'express';
import { User } from './entities/user.entity';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }


  @Post('signin')
  signIn(@Body() LoginDto:LoginDto,    @Res() res: Response) {
    return this.userService.signIn(LoginDto,res);
  }
  @Get()
  @UseGuards(AuthGuard(),RolesGuard)
   @Roles('admin', 'superadmin') // Only allow admin and superadmin to access this route
   findAll() {
   return this.userService.findAll();
   }
   @Get(':id')
   async getById(@Param('id') id: string): Promise<User> {
     return this.userService.findOneById(id);
   }
    @Patch(':id')
   async update(@Param('id',) id: string, @Body() updateData: Partial<User>) {
     return  await this.userService.update(id, updateData);
   }
 
   @Delete(':id')
   async delete(@Param('id') id:string) {
     return this.userService.remove(id);
   }
  @Post(':id/profile')
  createUserProfile(@Param('id') id:string,@Body() createUserProfileDto: createUserProfileDto) {
    return this.userService.createUserProfile(id,createUserProfileDto)
  
  }


  @Post(':id/posts')
  createUserPost(@Param('id') id:string,@Body() CreateUserPostDto: createUserPostDto) {
    return this.userService.createUserPost(id,CreateUserPostDto)
  
  }

  @Patch(':id/demote')
  @UseGuards(AuthGuard())
  @Roles(userRole.SUPERADMIN) // Only allow superadmin to demote others
  async DemoteAdmin(@Param('id') id: string) {
    return this.userService.DemoteAdmin(id);
  }
  
  @Patch(':id/promote')
  @UseGuards(JwtAuthGuard)
  @Roles(userRole.ADMIN, userRole.SUPERADMIN) // Only allow admin to promote others
  async makeadmin(@Param('id') id: string) {
    return this.userService.promoteToAdmin(id);
  }
}
