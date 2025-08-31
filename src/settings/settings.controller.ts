import {
    Controller,
    HttpStatus,
    Res,
    Put,
    Body,
    UsePipes,
    ValidationPipe
} from '@nestjs/common';
import { Response } from 'express';
import { SettingsService } from "./settings.service";
import { PasswordDto } from "../dto/settings/password.dto";
import { NameDto } from "../dto/settings/name.dto";
import { BiogramDto } from "../dto/settings/biogram.dto";
import { UsernameDto } from "../dto/settings/username.dto";

@Controller('settings')
export class SettingsController {
    constructor(
        private readonly settingsService: SettingsService,
    ) {}

    @Put('personal-data/name')
    @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
    async updateName(
        @Body() body: NameDto,
        @Res() res: Response
    ) {
        try {
            await this.settingsService.updateName(body.name, body.surname, body.user_id);

            return res.status(HttpStatus.OK).json({
                success: true,
                message: 'Imię i nazwisko zostały zaktualizowane',
            });
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                success: false,
                message: error.message || 'Błąd podczas aktualizacji imienia i nazwiska'
            });
        }
    }

    @Put('personal-data/username')
    @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
    async updateUsername(
        @Body() body: UsernameDto,
        @Res() res: Response
    ) {
        try {
            await this.settingsService.updateUsername(body.username, body.user_id);

            return res.status(HttpStatus.OK).json({
                success: true,
                message: 'Nazwa użytkownika została zaktualizowana',
            });
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                success: false,
                message: error.message || 'Błąd podczas aktualizacji nazwy użytkownika'
            });
        }
    }

    @Put('personal-data/biogram')
    @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
    async updateBiogram(
        @Body() body: BiogramDto,
        @Res() res: Response
    ) {
        try {
            await this.settingsService.updateBiogram(body.biogram, body.user_id);

            return res.status(HttpStatus.OK).json({
                success: true,
                message: 'Biogram został zaktualizowany',
            });
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                success: false,
                message: error.message || 'Błąd podczas aktualizacji biogramu'
            });
        }
    }

    @Put('personal-data/password')
    @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
    async changePassword(
        @Body() body: PasswordDto,
        @Res() res: Response
    ) {
        try {
            const isCurrentPasswordValid = await this.settingsService.validateCurrentPassword(
                body.user_id,
                body.currentPassword
            );

            if (!isCurrentPasswordValid) {
                return res.status(HttpStatus.BAD_REQUEST).json({
                    success: false,
                    message: 'Podane obecne hasło jest nieprawidłowe'
                });
            }

            const isSamePassword = await this.settingsService.validateCurrentPassword(
                body.user_id,
                body.newPassword
            );

            if (isSamePassword) {
                return res.status(HttpStatus.BAD_REQUEST).json({
                    success: false,
                    message: 'Nowe hasło musi być różne od obecnego hasła'
                });
            }

            await this.settingsService.updatePassword(body.user_id, body.newPassword);
            return res.status(HttpStatus.OK).json({
                success: true,
                message: 'Hasło zostało zaktualizowane'
            });

        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                success: false,
                message: error.message || 'Błąd podczas zmiany hasła'
            });
        }
    }
}