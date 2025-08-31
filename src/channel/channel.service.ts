import {Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import { User } from '../user/user.entity';
import { Repository, In } from 'typeorm';

@Injectable()
export class ChannelService {
    private activeParticipants = new Map<number, Set<number>>();

    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) {}

    public async getActiveParticipants(teamId: number): Promise<{ users: User[], count: number }> {
        const participantIds = Array.from(this.activeParticipants.get(teamId) || new Set());

        if (participantIds.length === 0) {
            return { users: [], count: 0 };
        }

        const users = await this.userRepository.find({
            where: { id: In(participantIds) },
            relations: ['profile']
        });

        return { users, count: users.length };
    }

    public async joinChannel(teamId: number, userId: number): Promise<void> {
        if (!this.activeParticipants.has(teamId)) {
            this.activeParticipants.set(teamId, new Set());
        }

        this.activeParticipants.get(teamId)!.add(userId);
    }

    public async leaveChannel(teamId: number, userId: number): Promise<void> {
        const participants = this.activeParticipants.get(teamId);

        if (participants) {
            participants.delete(userId);
            if (participants.size === 0) {
                this.activeParticipants.delete(teamId);
            }
        }
    }
}