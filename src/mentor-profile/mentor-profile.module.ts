import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MentorProfile } from './mentor-profile.entity';
import { MentorProfileService } from './mentor-profile.service';
import { MentorProfileController } from './mentor-profile.controller';

@Module({
    imports: [TypeOrmModule.forFeature([MentorProfile])],
    providers: [MentorProfileService],
    controllers: [MentorProfileController],
    exports: [MentorProfileService],
})
export class MentorProfileModule {}