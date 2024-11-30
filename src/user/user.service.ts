import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) {}

    async getUsers(): Promise<User[]> {
        return this.userRepository.find();
    }

    async createUser(user: Partial<User>): Promise<User> {
        const newUser = this.userRepository.create(user);
        return this.userRepository.save(newUser);
    }
}