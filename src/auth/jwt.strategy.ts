
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/user/entities/user.entity';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy,'jwt') {
  constructor(private  UserService: UserService,
    private configService: ConfigService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey:configService.getOrThrow('JWTSECRET'),
      passReqToCallback: true,
    });
  }

//   async validate(data:{email}):Promise<User>{
// const {email}  = data;
// const user = await this.UserService.findEmail(email);
// if(!user){
//     throw new UnauthorizedException('login first to access this endpoints');
    
// }
// return user
// }


// // jwt.strategy.ts
// async validate(payload: any) {
//   return {
//     id: payload.sub,
//     email: payload.email,
//     roles: payload.role // This must be here
//   };
// }



async validate(payload: any): Promise<any> {
  const user = await this.UserService.findEmail(payload.email);
  if (!user) {
    throw new UnauthorizedException('User not found or unauthorized');
  }

  return {
    id: user.id,
    email: user.email,
    role: user.role, 
  };
}
}


