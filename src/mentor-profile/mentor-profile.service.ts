import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MentorProfileDto } from '../dto/mentor-profile/mentor-profile.dto';
import { MentorProfile } from './mentor-profile.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MentorProfileService {
  constructor(
    @InjectRepository(MentorProfile)
    private mentorProfileRepository: Repository<MentorProfile>,
  ) {}

  async publishProfile(
    mentorProfileDto: MentorProfileDto,
  ): Promise<MentorProfile> {
    const existingProfile = await this.mentorProfileRepository.findOne({
      where: { user_id: mentorProfileDto.user_id },
    });

    if (existingProfile) {
      throw new ConflictException({
        success: false,
        message: 'Profil już istnieje',
        errors: [
          { field: 'user_id', message: 'Użytkownik ma już utworzony profil' },
        ],
      });
    }

    const mentorProfile = this.mentorProfileRepository.create({});
    return await this.mentorProfileRepository.save(mentorProfile);
  }

  async getProfileByUserId(userId: number): Promise<MentorProfile> {
    const profile = await this.mentorProfileRepository.findOne({
      where: { user_id: userId },
      relations: ['user'],
    });

    if (!profile) {
      throw new NotFoundException('Profil nie został znaleziony');
    }

    return profile;
  }

  async updateProfile(
    userId: number,
    updateData: Partial<MentorProfileDto>,
  ): Promise<any> {
    const profile = await this.mentorProfileRepository.findOne({
      where: { user_id: userId },
    });

    if (!profile) {
      throw new NotFoundException('Profil nie został znaleziony');
    }

    const fieldsToUpdate = {};

    Object.keys(fieldsToUpdate).forEach((key) => {
      if (fieldsToUpdate[key] === undefined) {
        delete fieldsToUpdate[key];
      }
    });

    Object.assign(profile, fieldsToUpdate);

    return await this.mentorProfileRepository.save(profile);
  }
}
