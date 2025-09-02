import {
    Controller,
    Post,
    Body,
    Req,
    HttpStatus,
    Res, ConflictException, Get, NotFoundException, Param, Put
} from '@nestjs/common';
import { Response } from 'express';
import { ProspectorProfileService } from './prospector-profile.service';
import { ProspectorProfileDto } from '../dto/prospector-profile/prospector-profile.dto';
import { validate } from "class-validator";
import { plainToInstance } from 'class-transformer';

@Controller('prospector-profile')
export class ProspectorProfileController {
    constructor(
        private readonly prospectorProfileService: ProspectorProfileService
    ) {}

    @Post('create')
    async publishProfile(@Body() body: any, @Res() res: Response): Promise<any> {
        try {
            const dto = plainToInstance(ProspectorProfileDto, body);
            const errors = await validate(dto);

            if (errors.length > 0) {
                const formattedErrors = errors.map(error => ({
                    field: error.property,
                    message: Object.values(error.constraints || {})[0] || 'Błąd walidacji'
                }));

                return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
                    success: false,
                    message: 'Błędy walidacji',
                    errors: formattedErrors
                });
            }

            await this.prospectorProfileService.publishProfile(dto);

            return res.status(HttpStatus.CREATED).json({
                success: true,
                message: 'Twój profil został poprawnie opublikowany.',
            });

        } catch (error) {
            if (error instanceof ConflictException) {
                const conflictResponse = error.getResponse() as any;
                return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json(conflictResponse);
            }

            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: 'Wystąpił błąd podczas publikacji profilu',
                errors: []
            });
        }
    }

    @Get('get/user/:userId')
    async getProfileByUserId(@Param('userId') userId: string, @Res() res: Response): Promise<any> {
        try {
            const userIdNumber = parseInt(userId, 10);

            if (isNaN(userIdNumber)) {
                return res.status(HttpStatus.BAD_REQUEST).json({
                    success: false,
                    message: 'Nieprawidłowe ID użytkownika'
                });
            }

            const profile = await this.prospectorProfileService.getProfileByUserId(userIdNumber);

            return res.status(HttpStatus.OK).json({
                success: true,
                data: profile
            });

        } catch (error) {
            if (error instanceof NotFoundException) {
                return res.status(HttpStatus.NOT_FOUND).json({
                    success: false,
                    message: error.message
                });
            }

            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: 'Wystąpił błąd podczas pobierania profilu'
            });
        }
    }

    @Put('update/user/:userId')
    async updateProfile(@Param('userId') userId: string, @Body() body: any, @Res() res: Response): Promise<any> {
        try {
            const userIdNumber = parseInt(userId, 10);
            const dto = plainToInstance(ProspectorProfileDto, body);
            const errors = await validate(dto);
            if (errors.length > 0) {
                const formattedErrors = errors.map(error => ({
                    field: error.property,
                    message: Object.values(error.constraints || {})[0] || 'Błąd walidacji'
                }));

                return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
                    success: false,
                    message: 'Błędy walidacji',
                    errors: formattedErrors
                });
            }

            const updatedProfile = await this.prospectorProfileService.updateProfile(userIdNumber, body);
            return res.status(HttpStatus.OK).json({
                success: true,
                message: 'Profil został zaktualizowany',
                data: updatedProfile
            });

        } catch (error) {
            if (error instanceof NotFoundException) {
                return res.status(HttpStatus.NOT_FOUND).json({
                    success: false,
                    message: error.message
                });
            }
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: 'Wystąpił błąd podczas aktualizacji profilu'
            });
        }
    }
}