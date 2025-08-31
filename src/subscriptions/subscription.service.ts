import Stripe from 'stripe';
import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {UserPayment} from "../payment/user-payment.entity";
import {Repository} from "typeorm";

@Injectable()
export class SubscriptionService {
    private stripe: Stripe;

    constructor(
        @InjectRepository(UserPayment)
        private userPaymentRepository: Repository<UserPayment>,
    ) {
        this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
            apiVersion: '2025-06-30.basil',
        });
    }

    async createCheckoutSession(mentorId: number, userId: number, priceId: string, mentorUsername: string)   {
        return await this.stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.FRONTEND_URL}/member/mentor-finder?username=${mentorUsername}`,
            metadata: {
                mentor_id: mentorId.toString(),
                user_id: userId.toString(),
            },
        });
    }

    async subscribeMentorPlus(user_id: number)    {
        return await this.stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price: process.env.MENTOR_PLUS_PRICE_ID,
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            success_url: `${process.env.FRONTEND_URL}/member/mentor/manage-plan/payment-process?session_id={CHECKOUT_SESSION_ID}`,
            metadata: {
                user_id: user_id.toString(),
            },
        });
    }

    async handleProcessPayment(session_id: string) : Promise<UserPayment> {
        try {
            const session  = await this.stripe.checkout.sessions.retrieve(session_id);
            const user_id: number = parseInt(session.metadata?.user_id);
            const subscription  = await this.stripe.subscriptions.retrieve(session.subscription as string);
            let subscription_type : string = 'mentor_plus';
            const price_id : string = subscription.items.data[0].price.id;

            const existing_payment : UserPayment = await this.userPaymentRepository.findOne({
                where: {
                    user_id: user_id,
                    status: 'active',
                    subscription_type: subscription_type
                },
                order: { created_at: 'DESC' }
            });

            if (existing_payment) {
                return existing_payment;
            }

            const subscriptionStart = new Date();
            const subscriptionEnd = new Date(subscriptionStart);
            subscriptionEnd.setMonth(subscriptionEnd.getMonth() + 1);

            const userPayment = this.userPaymentRepository.create({
                user_id: user_id,
                price_id: price_id,
                amount: subscription.items.data[0].price.unit_amount! / 100,
                currency: subscription.items.data[0].price.currency,
                status: subscription.status,
                subscription_type: subscription_type,
                current_period_start: subscriptionStart,
                current_period_end: subscriptionEnd,
                canceled_at: null,
            });

            return await this.userPaymentRepository.save(userPayment);

        } catch (error) {
            console.error('Błąd podczas obsługi pomyślnej płatności:', error);
            throw error;
        }
    }
}