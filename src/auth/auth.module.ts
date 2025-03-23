import { Module } from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "../user/user.entity";
import {AuthController} from "./auth.controller";
import {AuthService} from "./auth.service";
import {UserProfile} from "../user/user-profile.entity";
import {LocalStrategy} from "./local.strategy";
import {JwtModule} from "@nestjs/jwt";
import {PassportModule} from "@nestjs/passport";
import {UserModule} from "../user/user.module";
import {JwtStrategy} from "./jwt.strategy";

@Module({
    imports: [
        TypeOrmModule.forFeature([User, UserProfile]),
        PassportModule,
        UserModule,
        JwtModule.register({
            secret: process.env.JWT_SECRET || 'super-secret-key',
            signOptions: { expiresIn: '1h' },
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, LocalStrategy, JwtStrategy],
    exports: [AuthService],
})

export class AuthModule {}