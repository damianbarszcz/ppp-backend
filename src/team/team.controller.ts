import {Controller, Post, Body, Res, HttpStatus, Get, Param, Delete} from '@nestjs/common';
import { Response } from 'express';
import { TeamService } from "./team.service";

@Controller('team')
export class TeamController{
    constructor(
        private readonly teamService: TeamService
    ) {}

    @Post('create')
    async createTeam(
        @Body() body: {
            title: string,
            description: string,
            tags?: string[],
            user_id: number,
            members: number[]
        },
        @Res() res: Response
    ) : Promise<any>  {
        try {
            await this.teamService.createTeam(
                body.title,
                body.description,
                body.tags || [],
                body.user_id,
                body.members || []
            );

            return res.status(HttpStatus.CREATED).json({
                success: true,
                message: 'Zespół został utworzony pomyślnie',
            });
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                success: false,
                message: 'Błąd podczas tworzenia zespołu',
                error: error.message
            });
        }
    }


    @Get('user/:userId')
    async getTeamsByUser(@Param('userId') userId: string, @Res() res: Response): Promise<any> {
        const teams = await this.teamService.getTeamsByUserId(Number(userId));

        return res.status(HttpStatus.OK).json({
            success: true,
            data: teams,
        });
    }

    @Get(':slug')
    async getTeamBySlug(@Param('slug') slug: string, @Res() res: Response): Promise<any> {
        const team = await this.teamService.getTeamBySlug(slug);

        if (!team) {
            return res.status(HttpStatus.NOT_FOUND).json({
                success: false,
                message: 'Team not found',
            });
        }

        return res.status(HttpStatus.OK).json({
            success: true,
            data: team,
        });
    }

    @Get('invitations/:userId')
    async getTeamInvitations(@Param('userId') userId: string, @Res() res: Response): Promise<any> {
        const invitations = await this.teamService.getTeamInvitationsForUser(Number(userId));

        return res.status(HttpStatus.OK).json({
            success: true,
            data: invitations,
        });
    }

    @Post('invitations/:invitationId/accept')
    async acceptTeamInvitation(
        @Param('invitationId') invitationId: string,
        @Body() body: { user_id: number },
        @Res() res: Response
    ): Promise<any> {
        try {
            await this.teamService.acceptTeamInvitation(Number(invitationId), body.user_id);

            return res.status(HttpStatus.OK).json({
                success: true,
                message: 'Zaproszenie zostało zaakceptowane',
            });
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                success: false,
                message: 'Błąd podczas akceptacji zaproszenia',
                error: error.message
            });
        }
    }

    @Delete('invitations/:invitationId/reject')
    async rejectTeamInvitation(
        @Param('invitationId') invitationId: string,
        @Body() body: { user_id: number },
        @Res() res: Response
    ): Promise<any> {
        try {
            await this.teamService.rejectTeamInvitation(Number(invitationId), body.user_id);

            return res.status(HttpStatus.OK).json({
                success: true,
                message: 'Zaproszenie zostało odrzucone',
            });
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                success: false,
                message: 'Błąd podczas odrzucania zaproszenia',
                error: error.message
            });
        }
    }
}