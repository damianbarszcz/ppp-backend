import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';

@Injectable()
export class SearchService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) {}

    public async searchMentors(query: string, limit: number = 10): Promise<any[]> {
        if (!query || query.length < 2) {
            return [];
        }

        return await this.userRepository
            .createQueryBuilder('user')
            .leftJoinAndSelect('user.profile', 'profile')
            .where('user.account_type = :accountType', { accountType: 'M' })
            .andWhere(
                '(LOWER(profile.username) LIKE LOWER(:query) OR ' +
                'LOWER(profile.name) LIKE LOWER(:query) OR ' +
                'LOWER(profile.surname) LIKE LOWER(:query) OR ' +
                'LOWER(CONCAT(profile.name, \' \', profile.surname)) LIKE LOWER(:query))',
                { query: `%${query}%` }
            )
            .orderBy('profile.username', 'ASC')
            .limit(limit)
            .getMany();
    }
}