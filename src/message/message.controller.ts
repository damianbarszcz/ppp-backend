import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { MessageService } from './message.service';

@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Get('team/:teamId')
  public async getTeamMessages(
    @Param('teamId') teamId: string,
    @Res() res: Response,
  ): Promise<any> {
    try {
      const messages = await this.messageService.getTeamMessages(
        Number(teamId),
      );

      return res.status(HttpStatus.OK).json({
        success: true,
        data: messages,
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Błąd pobierania wiadomości kanału',
      });
    }
  }

  @Post('team/:teamId/:userId')
  public async createMessage(
    @Param('teamId') teamId: string,
    @Param('userId') userId: string,
    @Body('content') content: string,
    @Res() res: Response,
  ): Promise<any> {
    try {
      if (!content || content.trim().length === 0) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: 'Treść wiadomości nie może być pusta',
        });
      }

      const message = await this.messageService.createMessage(
        Number(teamId),
        Number(userId),
        content,
      );

      return res.status(HttpStatus.CREATED).json({
        success: true,
        data: message,
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Błąd podczas wysyłania wiadomości',
      });
    }
  }
}
