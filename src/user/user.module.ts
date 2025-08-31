import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserProfile } from './user-profile.entity';
import { UserService } from './user.service';
import {UserController} from "./user.controller";
import {UserPayment} from "../payment/user-payment.entity";

@Module({
    imports: [TypeOrmModule.forFeature([User, UserProfile, UserPayment])],
    providers: [UserService],
    controllers: [UserController],
    exports: [UserService],
})
export class UserModule {}
