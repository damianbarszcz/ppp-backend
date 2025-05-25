import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {ContactService} from "./contact.service";
import {Contact} from "./contact.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Contact])],
    providers: [ContactService],
    exports: [ContactService],
})
export class ChannelModule {}
