import {Injectable, NotFoundException, BadRequestException, Get} from '@nestjs/common';
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

    async publishProfile(ProspectorProfileDto: ProspectorProfileDto): Promise<ProspectorProfile> {
        const { about_me, user_id} = ProspectorProfileDto;

        const prospectorProfile : ProspectorProfile = this.prospectorProfileRepository.create({
            user_id: user_id,
            about_me,
        });

        return await this.prospectorProfileRepository.save(prospectorProfile);
    }

    async getProfileByUserId(userId: number): Promise<ProspectorProfile> {
        const profile = await this.prospectorProfileRepository.findOne({
            where: { user_id: userId },
            relations: ['user']
        });

        if (!profile) {
            throw new NotFoundException('Profil nie został znaleziony');
        }

        return profile;
    }

    async updateProfile(userId: number, updateData: Partial<ProspectorProfileDto>): Promise<ProspectorProfile> {
        const profile = await this.prospectorProfileRepository.findOne({
            where: { user_id: userId }
        });

        if (!profile) {
            throw new NotFoundException('Profil nie został znaleziony');
        }
        Object.assign(profile, updateData);

        return await this.prospectorProfileRepository.save(profile);
    }
}