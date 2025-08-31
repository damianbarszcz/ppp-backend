import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserPayment } from './user-payment.entity';

@Injectable()
export class PaymentService {
    constructor(
        @InjectRepository(UserPayment)
        private userPaymentRepository: Repository<UserPayment>,
    ) {}

    async getUserPaymentHistory(user_id: number): Promise<UserPayment[]> {
        return this.userPaymentRepository.find({
            where: { user_id: user_id },
            order: { created_at: 'DESC' }
        });
    }

    async getUserSubscriptionStatus(user_id: number) {
        try {
            const allPayments = await this.getUserPaymentHistory(user_id);
            const currentSubscription = await this.userPaymentRepository.findOne({
                where: {
                    user_id: user_id,
                    status: 'active'
                },
                order: { created_at: 'DESC' }
            });

            let hasMentorPlus = false;
            if (currentSubscription && currentSubscription.subscription_type === 'mentor_plus') {
                const now = new Date();
                const expirationDate = new Date(currentSubscription.current_period_end);
                hasMentorPlus = expirationDate > now;
            }

            const daysRemaining = currentSubscription
                ? Math.ceil((new Date(currentSubscription.current_period_end).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
                : null;

            return {
                hasMentorPlus,
                status: currentSubscription?.status || null,
                amount: currentSubscription?.amount || null,
                currency: currentSubscription?.currency || null,
                expiresAt: currentSubscription?.current_period_end || null,
                daysRemaining: Math.max(0, daysRemaining || 0),
                currentSubscription,
                allPayments,
                paymentCount: allPayments.length
            };

        } catch (error) {
            throw error;
        }
    }
}