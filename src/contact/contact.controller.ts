import {
    Controller,
    Get,
    HttpStatus,
    Res, Param, Post, Body, ConflictException, NotFoundException,Delete,Put
} from '@nestjs/common';
import { Response } from 'express';
import { ContactService } from './contact.service';
import {plainToInstance} from "class-transformer";
import {validate} from "class-validator";
import {ContactDto} from "../dto/contact/contact.dto";

@Controller('contact')
export class ContactController {
    constructor(
        private readonly contactService: ContactService,
    ) {}

    @Get('accepted/user/:userId')
    public async getMyContacts(@Param('userId') userId: string, @Res() res: Response): Promise<any> {
        const acceptedContacts = await this.contactService.getMyContacts(Number(userId));

        return res.status(HttpStatus.OK).json({
            success: true,
            data:  acceptedContacts
        });
    }

    @Get('pending/user/:userId')
    public async getInvitationsContact(@Param('userId') userId: string, @Res() res: Response): Promise<any> {
        const pendingContacts = await this.contactService.getInvitationsContact(Number(userId));

        return res.status(HttpStatus.OK).json({
            success: true,
            data: pendingContacts
        });
    }

    @Get('invitations/user/:userId')
    public async getReceivedInvitations(@Param('userId') userId: string, @Res() res: Response): Promise<any> {
        const invitations = await this.contactService.getReceivedInvitations(Number(userId));

        return res.status(HttpStatus.OK).json({
            success: true,
            data: invitations
        });
    }

    @Post('invitation/send/:userId')
    public async sendContactInvitation(
        @Param('userId') userId: string,
        @Body() body: { username: string },
        @Res() res: Response
    ): Promise<any> {
        try {
            const contactData = {
                username: body.username,
                user_id: Number(userId)
            };

            const dto = plainToInstance(ContactDto, contactData);
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

            await this.contactService.sendContactInvitation(dto);

            return res.status(HttpStatus.CREATED).json({
                success: true,
                message: 'Zaproszenie do kontaktu zostało prawidłowo wysłane.',
            });

        } catch (error) {
            if (error instanceof ConflictException || error instanceof NotFoundException) {
                const errorResponse = error.getResponse() as any;
                return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json(errorResponse);
            }

            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: 'Wystąpił błąd podczas wysyłania zaproszenia',
                errors: []
            });
        }
    }

    @Put('invitation/accept/:userId/:contactId')
    public async acceptInvitation(
        @Param('userId') userId: string,
        @Param('contactId') contactId: string,
        @Res() res: Response
    ): Promise<any> {
        try {
            const updatedContact = await this.contactService.acceptInvitation(
                Number(userId),
                Number(contactId)
            );

            return res.status(HttpStatus.OK).json({
                success: true,
                message: 'Zaproszenie zostało zaakceptowane',
                data: updatedContact
            });

        } catch (error) {
            if (error instanceof NotFoundException) {
                const errorResponse = error.getResponse() as any;
                return res.status(HttpStatus.NOT_FOUND).json(errorResponse);
            }

            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: 'Wystąpił błąd podczas akceptowania zaproszenia',
                errors: []
            });
        }
    }

    @Delete('invitation/reject/:userId/:contactId')
    public async rejectInvitation(
        @Param('userId') userId: string,
        @Param('contactId') contactId: string,
        @Res() res: Response
    ): Promise<any> {
        try {
            await this.contactService.rejectInvitation(
                Number(userId),
                Number(contactId)
            );

            return res.status(HttpStatus.OK).json({
                success: true,
                message: 'Zaproszenie zostało odrzucone'
            });

        } catch (error) {
            if (error instanceof NotFoundException) {
                const errorResponse = error.getResponse() as any;
                return res.status(HttpStatus.NOT_FOUND).json(errorResponse);
            }

            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: 'Wystąpił błąd podczas odrzucania zaproszenia',
                errors: []
            });
        }
    }
}