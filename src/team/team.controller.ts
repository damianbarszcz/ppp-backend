import {Controller, Post, Body, Res, HttpStatus, Get, Param} from '@nestjs/common';
import { Response } from 'express';
import { TeamService } from "./team.service";

@Controller('team')
export class TeamController{
    constructor(
        private readonly teamService: TeamService
    ) {}

    @Post('create')
    async createTeam(
        @Body() body: { title:string, description:string, tags: string[], user_id: number },
        @Res() res: Response
    ) : Promise<any>  {
        await this.teamService.createTeam(body.title, body.description, body.tags, body.user_id);

        return res.status(HttpStatus.CREATED).json({
            success: true,
            message: 'Kanał został utworzony',
        });
    }

    @Get('user/:userId')
    async getTeamsByUser(@Param('userId') userId: string, @Res() res: Response): Promise<any> {
        const teams = await this.teamService.getTeamsByUserId(Number(userId));

        return res.status(HttpStatus.OK).json({
            success: true,
            data: teams,
        });
    }
}