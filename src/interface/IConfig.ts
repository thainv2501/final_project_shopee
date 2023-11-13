import { TypeOrmModuleOptions } from "@nestjs/typeorm";

export interface IConfig { 
    database : TypeOrmModuleOptions,
    access_token : string,
}