import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from 'config/typeorm';
import { User } from '.././user/entities/user.entity';

@Module({
    imports:[ 
        ConfigModule.forRoot({ isGlobal: true }),
        TypeOrmModule.forRoot(dataSourceOptions)
       
    ]
})
export class DatabaseModule {}
