import {
    Controller,
    Post,
    Body,
    HttpStatus,
    Res
} from '@nestjs/common';
import { Response } from 'express';
import {SubscriptionService} from "./subscription.service";
import {UserPayment} from "../payment/user-payment.entity";

@Controller('subscriptions')
export class SubscriptionController {
    constructor(
        private readonly subscriptionService: SubscriptionService,
    ) {}

    @Post('user-subscribe-session')
    async mentorSubscribeSession(
        @Body() body: {
            mentor_id: number,
            user_id: number,
            price_value: number,
            mentor_username: string
        },
        @Res() res: Response
    ): Promise<any> {
        const session = await this.subscriptionService.subscribeMentorByUser(
            body.mentor_id,
            body.user_id,
            body.price_value,
            body.mentor_username
        );

        return res.status(HttpStatus.OK).json({
            success: true,
            data: { sessionId: session.id }
        });
    }

    @Post('mentor-plus-session')
    async mentorPlusSession(
        @Body() body: { user_id: number },
        @Res() res: Response
    ): Promise<any> {
        const session = await this.subscriptionService.subscribeMentorPlus(body.user_id);

        return res.status(HttpStatus.OK).json({
            success: true,
            data: { sessionId: session.id }
        });
    }

    @Post('process-payment')
    async processPayment(
        @Body() body: { session_id: string },
        @Res() res: Response
    ): Promise<any> {
        try {
            const payment : UserPayment = await this.subscriptionService.handleProcessPayment(body.session_id);
            return res.status(HttpStatus.OK).json({
                success: true,
                message: 'Płatność przetworzona pomyślnie',
                data: payment
            });

        } catch (error) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: 'Błąd podczas przetwarzania płatności',
                error: error.message
            });
        }
    }
}