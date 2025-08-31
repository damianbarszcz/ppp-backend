import { Controller, Get, Param, NotFoundException, ParseIntPipe } from '@nestjs/common';
import { PaymentService } from './payment.service';

@Controller('payments')
export class PaymentController {
    constructor(
        private readonly paymentService: PaymentService
    ) {}

    @Get('user/:userId')
    async getUserPayments(@Param('userId', ParseIntPipe) user_id: number) {
        try {
            const payments = await this.paymentService.getUserPaymentHistory(user_id);
            return {
                success: true,
                data: payments,
                count: payments.length
            };
        } catch (error) {
            throw new NotFoundException('Nie znaleziono płatności dla tego użytkownika');
        }
    }

    @Get('user/:userId/status')
    async getUserSubscriptionStatus(@Param('userId', ParseIntPipe) user_id: number) {
        try {
            const subscription_data = await this.paymentService.getUserSubscriptionStatus(user_id);

            return {
                success: true,
                data: subscription_data
            };
        } catch (error) {
            console.error('Błąd podczas pobierania statusu subskrypcji:', error);
        }
    }
}