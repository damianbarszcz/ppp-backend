import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactService } from './contact.service';
import { ContactController } from './contact.controller';
import { Contact } from './contact.entity';
import { User } from '../user/user.entity';
import {NotificationModule} from "../notification/notification.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([Contact, User]),
        NotificationModule
    ],
    providers: [ContactService],
    controllers: [ContactController],
    exports: [ContactService],
})
export class ContactModule {}