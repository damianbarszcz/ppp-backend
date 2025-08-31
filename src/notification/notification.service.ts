import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './notification.entity';

@Injectable()
export class NotificationService {
    constructor(
        @InjectRepository(Notification)
        private notificationRepository: Repository<Notification>,
    ) {}

    public async getUserNotifications(userId: number): Promise<Notification[]> {
        return await this.notificationRepository.find({
            where: { user_id: userId },
            relations: ['sender', 'sender.profile'],
            order: { created_at: 'DESC' },
        });
    }

    public async createNotification(userId: number, senderId: number, message: string): Promise<Notification> {
        const notification = this.notificationRepository.create({
            user_id: userId,
            sender_id: senderId,
            message: message
        });

        return await this.notificationRepository.save(notification);
    }
}