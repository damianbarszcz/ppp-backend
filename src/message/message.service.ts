import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './message.entity';

@Injectable()
export class MessageService {
    constructor(
        @InjectRepository(Message)
        private messageRepository: Repository<Message>,
    ) {}

    public async getTeamMessages(teamId: number): Promise<Message[]> {
        return await this.messageRepository.find({
            where: { team_id: teamId },
            relations: ['user', 'user.profile'],
            order: { created_at: 'ASC' },
        });
    }

    public async createMessage(teamId: number, userId: number, content: string): Promise<Message> {
        const message = this.messageRepository.create({
            team_id: teamId,
            user_id: userId,
            content: content,
        });

        const savedMessage = await this.messageRepository.save(message);

        return await this.messageRepository.findOne({
            where: { id: savedMessage.id },
            relations: ['user', 'user.profile']
        });
    }
}