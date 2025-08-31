import { Module } from '@nestjs/common';
import { SettingsController } from './settings.controller';
import { SettingsService } from './settings.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "../user/user.entity";
import {UserProfile} from "../user/user-profile.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            User,
            UserProfile,
        ])
    ],

    controllers: [SettingsController],
    providers: [SettingsService],
    exports: [SettingsService],
})
export class SettingsModule {}