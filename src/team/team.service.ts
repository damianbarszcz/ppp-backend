import {Injectable} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Team } from './team.entity';
import {TeamDetails} from "./team-details.entity";

@Injectable()
export class TeamService {
    constructor(
        @InjectRepository(Team)
        private teamRepository: Repository<Team>,
        @InjectRepository(TeamDetails)
        private teamDetailsRepository: Repository<TeamDetails>,
    ) {}

    async createTeam(title: string, description: string, tags: string[], user_id: number) : Promise<void>  {
        const team = this.teamRepository.create({ title,user_id });
        await this.teamRepository.save(team);

        const team_avatar_color = this.generateRandomHexColor();

        const teamDetails = this.teamDetailsRepository.create({tags,description,team_avatar_color });
        await this.teamDetailsRepository.save(teamDetails);
    }

    async getTeamsByUserId(userId: number): Promise<Team[]> {
        return this.teamRepository.find({
            where: { user_id: userId },
            relations: ['team_details', 'creator'],
            order: { created_at: 'DESC' },
        });
    }


    generateRandomHexColor() : string {
        return '#' + Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, '0');
    }
}