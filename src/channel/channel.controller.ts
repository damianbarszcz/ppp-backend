import {Controller, Res, HttpStatus, Get, Param, Post} from '@nestjs/common';
import { ChannelService } from './channel.service';
import { Response } from 'express';

@Controller('channel')
export class ChannelController {
    constructor(private readonly channelService: ChannelService) {}

    @Get('team/active-participants/:teamId')
    public async getActiveParticipants(@Param('teamId') teamId: string, @Res() res: Response): Promise<any> {
        try {
            const result = await this.channelService.getActiveParticipants(Number(teamId));
            return res.status(HttpStatus.OK).json({
                success: true,
                data: result.users,
                count: result.count
            });
        } catch (error) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({success: false});
        }
    }

    @Post('team/join/:teamId/:userId')
    public async joinChannel(@Param('teamId') teamId: string, @Param('userId') userId: string, @Res() res: Response): Promise<any> {
        try {
            await this.channelService.joinChannel(Number(teamId), Number(userId));
            return res.status(HttpStatus.OK).json({success: true});
        } catch (error) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({success: false});
        }
    }

    @Post('team/leave/:teamId/:userId')
    public async leaveChannel(@Param('teamId') teamId: string, @Param('userId') userId: string, @Res() res: Response): Promise<any> {
        try {
            await this.channelService.leaveChannel(Number(teamId), Number(userId));
            return res.status(HttpStatus.OK).json({success: true});
        } catch (error) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({success: false});
        }
    }
}