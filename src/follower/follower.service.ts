import {ConflictException, Injectable, NotFoundException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Follower } from './follower.entity';

@Injectable()
@Injectable()
export class FollowerService {
    constructor(
        @InjectRepository(Follower)
        private followerRepository: Repository<Follower>,
    ) {}

    async getMentorFollowers(mentorId: number): Promise<any[]> {
        return await this.followerRepository
            .createQueryBuilder('follower')
            .leftJoinAndSelect('follower.follower', 'user')
            .leftJoinAndSelect('user.profile', 'userProfile')
            .where('follower.mentor_id = :mentorId', { mentorId })
            .orderBy('follower.created_at', 'DESC')
            .getMany();
    }

    async setFollowMentor(userId: number, mentorId: number): Promise<Follower> {
        const existingFollow = await this.followerRepository.findOne({
            where: { user_id: userId, mentor_id: mentorId }
        });

        if (existingFollow) {
            throw new ConflictException('Już obserwujesz tego mentora');
        }

        const follower = this.followerRepository.create({
            user_id: userId,
            mentor_id: mentorId
        });

        return await this.followerRepository.save(follower);
    }

    async setUnfollowMentor(userId: number, mentorId: number): Promise<void> {
        const result = await this.followerRepository.delete({
            user_id: userId,
            mentor_id: mentorId
        });

        if (result.affected === 0) {
            throw new NotFoundException('Nie obserwujesz tego mentora');
        }
    }

    async isFollowing(userId: number, mentorId: number): Promise<boolean> {
        const count = await this.followerRepository.count({
            where: { user_id: userId, mentor_id: mentorId }
        });
        return count > 0;
    }
}