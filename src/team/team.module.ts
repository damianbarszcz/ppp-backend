import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {Team} from "./team.entity";
import {TeamDetails} from "./team-details.entity";
import {TeamService} from "./team.service";
import {TeamController} from "./team.controller";

@Module({
    imports: [TypeOrmModule.forFeature([Team, TeamDetails])],
    providers: [TeamService],
    exports: [TeamService],
    controllers: [TeamController],
})
export class TeamModule {}
