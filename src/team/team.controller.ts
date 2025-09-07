import {Controller, Post, Body, Res, HttpStatus, Get, Param, Delete} from '@nestjs/common';
import { Response } from 'express';
import { TeamService } from "./team.service";
import {CreateTeamDto} from "../dto/team/team.dto";
import {validate} from "class-validator";
import {plainToInstance} from "class-transformer";

@Controller('team')
export class TeamController{
    constructor(
        private readonly teamService: TeamService
    ) {}

    @Post('create')
    public async createTeam(@Body() body: any, @Res() res: Response): Promise<any> {
        try {
            const dto = plainToInstance(CreateTeamDto, body);
            const errors = await validate(dto);

            if (errors.length > 0) {
                const formattedErrors = errors.map(error => ({
                    field: error.property,
                    message: Object.values(error.constraints || {})[0]
                }));

                return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({success: false, errors: formattedErrors});
            }

            const existingTeam = await this.teamService.checkTeamExists(dto.title.trim(), dto.user_id);
            if (existingTeam) {
                return res.status(HttpStatus.CONFLICT).json({
                    success: false,
                    errors: [{field: 'title', message: 'Zespół o tej nazwie już istnieje'}]
                });
            }
            await this.teamService.createTeam(dto.title.trim(), dto.description.trim(), dto.user_id, dto.members || []);

            return res.status(HttpStatus.CREATED).json({success: true, message: 'Zespół został utworzony pomyślnie',});

        } catch (error) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({success: false});
        }
    }

    @Get('user/:userId')
    public async getTeamsByUser(@Param('userId') userId: string, @Res() res: Response): Promise<any> {
        const teams = await this.teamService.getTeamsByUserId(Number(userId));

        return res.status(HttpStatus.OK).json({success: true, data: teams});
    }

    @Get(':slug')
    public async getTeamBySlug(@Param('slug') slug: string, @Res() res: Response): Promise<any> {
        const team = await this.teamService.getTeamBySlug(slug);
        if (!team) {
            return res.status(HttpStatus.NOT_FOUND).json({
                success: false
            });
        }
        return res.status(HttpStatus.OK).json({success: true, data: team});
    }

    @Get('invitations/:userId')
    public async getTeamInvitations(@Param('userId') userId: string, @Res() res: Response): Promise<any> {
        const invitations = await this.teamService.getTeamInvitationsForUser(Number(userId));

        return res.status(HttpStatus.OK).json({success: true, data: invitations});
    }

    @Post('invitations/:invitationId/accept')
    public async acceptTeamInvitation(@Param('invitationId') invitationId: string, @Body() body: { user_id: number }, @Res() res: Response): Promise<any> {
        try {
            await this.teamService.acceptTeamInvitation(Number(invitationId), body.user_id);
            return res.status(HttpStatus.OK).json({success: true});

        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json({success: false, error: error.message});
        }
    }

    @Delete('invitations/:invitationId/reject')
    async rejectTeamInvitation(@Param('invitationId') invitationId: string, @Body() body: { user_id: number }, @Res() res: Response): Promise<any> {
        try {
            await this.teamService.rejectTeamInvitation(Number(invitationId), body.user_id);
            return res.status(HttpStatus.OK).json({success: true});

        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json({success: false, error: error.message});
        }
    }
}