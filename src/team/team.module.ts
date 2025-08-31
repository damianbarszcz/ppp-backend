import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {Team} from "./team.entity";
import {TeamDetails} from "./team-details.entity";
import {TeamService} from "./team.service";
import {TeamController} from "./team.controller";
import {NotificationModule} from "../notification/notification.module";
import {TeamInvitation} from "./team-invitation.entity";
import { Notification } from '../notification/notification.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Team, TeamDetails, TeamInvitation, Notification]),
        NotificationModule
    ],
    providers: [TeamService],
    exports: [TeamService],
    controllers: [TeamController],
})
export class TeamModule {}
