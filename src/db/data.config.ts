import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import {  TypeOrmModuleOptions, TypeOrmOptionsFactory} from '@nestjs/typeorm';

@Injectable()
export class  DatabaseConfig implements TypeOrmOptionsFactory {
   constructor(private configService : ConfigService){}

   createTypeOrmOptions() : TypeOrmModuleOptions{
    return this.configService.get('database')
   }
  }


