import {
    Controller, Get, HttpStatus, Param, Res,
} from '@nestjs/common';
import { Response } from 'express';
import { NotificationService } from './notification.service';

@Controller('notification')
export class NotificationController {
    constructor(
        private readonly notificationService: NotificationService,
    ) {}

    @Get(':userId')
    public async getUserNotifications(@Param('userId') userId: string, @Res() res: Response): Promise<any> {
        const userNotifications = await this.notificationService.getUserNotifications(Number(userId));

        return res.status(HttpStatus.OK).json({
            success: true,
            data:  userNotifications
        });
    }
}