import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProspectorProfile } from './prospector-profile.entity';
import { ProspectorProfileDto } from '../dto/prospector-profile/prospector-profile.dto';

@Injectable()
export class ProspectorProfileService {
  constructor(
    @InjectRepository(ProspectorProfile)
    private prospectorProfileRepository: Repository<ProspectorProfile>,
  ) {}

  async publishProfile(
    prospectorProfileDto: ProspectorProfileDto,
  ): Promise<ProspectorProfile> {
    const existingProfile = await this.prospectorProfileRepository.findOne({
      where: { user_id: prospectorProfileDto.user_id },
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

    const prospectorProfile = this.prospectorProfileRepository.create({
      user_id: prospectorProfileDto.user_id,
      about_me: prospectorProfileDto.about_me,
      specialization: prospectorProfileDto.specialization,
      location: prospectorProfileDto.location,
      collaboration_areas: prospectorProfileDto.collaboration_areas || [],
      work_modes: prospectorProfileDto.work_modes || [],
      experience_level: prospectorProfileDto.experience_level,
      industries: prospectorProfileDto.industries || [],
      required_skills: prospectorProfileDto.required_skills || [],
      project_type: prospectorProfileDto.project_type,
      time_commitment: prospectorProfileDto.time_commitment,
      budget_range: prospectorProfileDto.budget_range,
      availability_status: prospectorProfileDto.availability_status || 'active',
      additional_notes: prospectorProfileDto.additional_notes,
    });

    return await this.prospectorProfileRepository.save(prospectorProfile);
  }

  async getProfileByUserId(userId: number): Promise<ProspectorProfile> {
    const profile = await this.prospectorProfileRepository.findOne({
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
    updateData: Partial<ProspectorProfileDto>,
  ): Promise<ProspectorProfile> {
    const profile = await this.prospectorProfileRepository.findOne({
      where: { user_id: userId },
    });

    if (!profile) {
      throw new NotFoundException('Profil nie został znaleziony');
    }

    const fieldsToUpdate = {
      about_me: updateData.about_me,
      specialization: updateData.specialization,
      location: updateData.location,
      collaboration_areas: updateData.collaboration_areas,
      work_modes: updateData.work_modes,
      experience_level: updateData.experience_level,
      industries: updateData.industries,
      required_skills: updateData.required_skills,
      project_type: updateData.project_type,
      time_commitment: updateData.time_commitment,
      budget_range: updateData.budget_range,
      availability_status: updateData.availability_status,
      additional_notes: updateData.additional_notes,
    };
    Object.keys(fieldsToUpdate).forEach((key) => {
      if (fieldsToUpdate[key] === undefined) {
        delete fieldsToUpdate[key];
      }
    });

    Object.assign(profile, fieldsToUpdate);

    return await this.prospectorProfileRepository.save(profile);
  }
}
