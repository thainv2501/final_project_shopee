import { ApiProperty } from '@nestjs/swagger';
import {  Entity, CreateDateColumn, UpdateDateColumn} from 'typeorm';

@Entity()
export abstract class baseEntity {
    @ApiProperty()
    @CreateDateColumn({type : "timestamptz"})
    created_at: Date; // Creation date

    @ApiProperty()
    @UpdateDateColumn({type : "timestamptz"})
    updated_at: Date; // Last updated date
}