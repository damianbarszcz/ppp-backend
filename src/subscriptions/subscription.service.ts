import Stripe from 'stripe';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserPayment } from '../payment/user-payment.entity';
import { Repository } from 'typeorm';

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

  public async subscribeMentorByUser(
    mentorId: number,
    userId: number,
    price_value: number,
    mentorUsername: string,
  ) {
    const priceId = await this.createOrGetMentorPrice(
      mentorId,
      mentorUsername,
      price_value,
    );

    return await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.FRONTEND_URL}/member/prospector/payment-process?session_id={CHECKOUT_SESSION_ID}&username=${mentorUsername}`,
      cancel_url: `${process.env.FRONTEND_URL}/member/prospector/mentor-search?username=${mentorUsername}`,
      metadata: {
        mentor_id: mentorId.toString(),
        user_id: userId.toString(),
        mentor_username: mentorUsername,
      },
    });
  }

  public async subscribeMentorPlus(user_id: number) {
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

  public async handleProcessPayment(session_id: string): Promise<UserPayment> {
    try {
      const session = await this.stripe.checkout.sessions.retrieve(session_id);
      const user_id: number = parseInt(session.metadata?.user_id);
      const mentor_id: number | null = session.metadata?.mentor_id
        ? parseInt(session.metadata.mentor_id)
        : null;
      const subscription = await this.stripe.subscriptions.retrieve(
        session.subscription as string,
      );

      const subscription_type: string = mentor_id
        ? 'mentor_subscription'
        : 'mentor_plus';
      const price_id: string = subscription.items.data[0].price.id;

      const whereCondition: any = {
        user_id: user_id,
        status: 'active',
        subscription_type: subscription_type,
      };
      if (mentor_id) {
        whereCondition.mentor_id = mentor_id;
      }

      const existing_payment: UserPayment =
        await this.userPaymentRepository.findOne({
          where: whereCondition,
          order: { created_at: 'DESC' },
        });

      if (existing_payment) {
        return existing_payment;
      }

      const subscriptionStart = new Date();
      const subscriptionEnd = new Date(subscriptionStart);
      subscriptionEnd.setMonth(subscriptionEnd.getMonth() + 1);

      const userPayment = this.userPaymentRepository.create({
        user_id: user_id,
        mentor_id: mentor_id,
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

  private async createOrGetMentorPrice(
    mentorId: number,
    mentorUsername: string,
    priceValue: number,
  ): Promise<string> {
    try {
      const existingProducts = await this.stripe.products.search({
        query: `metadata['mentor_id']:'${mentorId}'`,
      });

      let productId: string;
      const activeProduct = existingProducts.data.find(
        (p) => p.active === true,
      );

      if (activeProduct) {
        productId = activeProduct.id;

        const prices = await this.stripe.prices.list({
          product: productId,
          active: true,
        });

        const currentPrice = prices.data.find(
          (p) => p.unit_amount === Math.round(priceValue * 100),
        );
        if (currentPrice) {
          return currentPrice.id;
        }
      } else {
        const product = await this.stripe.products.create({
          name: `mentor @${mentorUsername}`,
          description: `Miesięczny dostęp do treści premium mentora @${mentorUsername}`,
          metadata: {
            mentor_id: mentorId.toString(),
          },
        });
        productId = product.id;
      }

      const price = await this.stripe.prices.create({
        unit_amount: Math.round(priceValue * 100),
        currency: 'pln',
        recurring: { interval: 'month' },
        product: productId,
      });

      return price.id;
    } catch (error) {
      console.error('Błąd podczas tworzenia ceny w Stripe:', error);
      throw error;
    }
  }
}
