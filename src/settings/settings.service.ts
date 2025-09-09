import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from '../user/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserProfile } from '../user/user-profile.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserProfile)
    private readonly profileRepository: Repository<UserProfile>,
  ) {}

  async updateName(
    name: string,
    surname: string,
    user_id: number,
  ): Promise<User> {
    try {
      const user = await this.userRepository.findOne({
        where: { id: user_id },
        relations: ['profile'],
      });

      if (!user) {
        throw new NotFoundException('Użytkownik nie został znaleziony');
      }

      if (!user.profile) {
        throw new NotFoundException('Profil użytkownika nie został znaleziony');
      }

      user.profile.name = name.trim();
      user.profile.surname = surname.trim();

      user.profile.updated_at = new Date();
      await this.profileRepository.save(user.profile);

      user.updated_at = new Date();
      await this.userRepository.save(user);

      return user;
    } catch (error) {
      throw error;
    }
  }

  async updateUsername(username: string, user_id: number): Promise<User> {
    try {
      const user = await this.userRepository.findOne({
        where: { id: user_id },
        relations: ['profile'],
      });

      if (!user) {
        throw new NotFoundException('Użytkownik nie został znaleziony');
      }

      if (!user.profile) {
        throw new NotFoundException('Profil użytkownika nie został znaleziony');
      }

      const existingUserWithUsername = await this.profileRepository.findOne({
        where: { username: username.trim() },
        relations: ['user'],
      });

      if (
        existingUserWithUsername &&
        existingUserWithUsername.user.id !== user_id
      ) {
        throw new BadRequestException('Nazwa użytkownika jest już zajęta');
      }

      user.profile.username = username.trim();

      user.profile.updated_at = new Date();
      await this.profileRepository.save(user.profile);

      user.updated_at = new Date();
      await this.userRepository.save(user);

      return user;
    } catch (error) {
      throw error;
    }
  }

  async updateBiogram(biogram: string, user_id: number): Promise<User> {
    try {
      const user = await this.userRepository.findOne({
        where: { id: user_id },
        relations: ['profile'],
      });

      if (!user) {
        throw new NotFoundException('Użytkownik nie został znaleziony');
      }

      if (!user.profile) {
        throw new NotFoundException('Profil użytkownika nie został znaleziony');
      }

      user.profile.biogram = biogram ? biogram.trim() : '';

      user.profile.updated_at = new Date();
      await this.profileRepository.save(user.profile);

      user.updated_at = new Date();
      await this.userRepository.save(user);

      return user;
    } catch (error) {
      throw error;
    }
  }

  async updateMentorSubscribePrice(
    mentor_subscribe_price: number,
    user_id: number,
  ): Promise<User> {
    try {
      const user = await this.userRepository.findOne({
        where: { id: user_id },
        relations: ['profile'],
      });

      if (!user) {
        throw new NotFoundException('Użytkownik nie został znaleziony');
      }

      if (!user.profile) {
        throw new NotFoundException('Profil użytkownika nie został znaleziony');
      }

      user.profile.mentor_subscribe_price = mentor_subscribe_price;
      user.profile.updated_at = new Date();
      await this.profileRepository.save(user.profile);

      user.updated_at = new Date();
      await this.userRepository.save(user);

      return user;
    } catch (error) {
      throw error;
    }
  }

  async checkUsernameExists(
    username: string,
    excludeUserId?: number,
  ): Promise<boolean> {
    try {
      const query = this.profileRepository
        .createQueryBuilder('profile')
        .leftJoinAndSelect('profile.user', 'user')
        .where('LOWER(profile.username) = LOWER(:username)', {
          username: username.trim(),
        });

      if (excludeUserId) {
        query.andWhere('user.id != :userId', { userId: excludeUserId });
      }

      const existingProfile = await query.getOne();
      return !!existingProfile;
    } catch (error) {
      throw error;
    }
  }

  async validateCurrentPassword(
    userId: number,
    currentPassword: string,
  ): Promise<boolean> {
    try {
      const user = await this.userRepository.findOne({
        where: { id: userId },
        select: ['id', 'password'],
      });

      if (!user) {
        throw new NotFoundException('Użytkownik nie został znaleziony');
      }

      return await bcrypt.compare(currentPassword, user.password);
    } catch (error) {
      throw error;
    }
  }

  async updatePassword(userId: number, newPassword: string): Promise<void> {
    try {
      const user = await this.userRepository.findOne({
        where: { id: userId },
        relations: ['profile'],
      });

      if (!user) {
        throw new NotFoundException('Użytkownik nie został znaleziony');
      }

      const saltRounds = 12;
      user.password = await bcrypt.hash(newPassword, saltRounds);
      user.password_length = newPassword.length;
      user.updated_at = new Date();

      if (user.profile) {
        user.profile.updated_at = new Date();
        await this.profileRepository.save(user.profile);
      }

      await this.userRepository.save(user);
    } catch (error) {
      throw error;
    }
  }
}
