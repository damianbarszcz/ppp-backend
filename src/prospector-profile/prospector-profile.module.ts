import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProspectorProfile } from './prospector-profile.entity';
import { ProspectorProfileService } from './prospector-profile.service';
import { ProspectorProfileController } from './prospector-profile.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ProspectorProfile])],
  controllers: [ProspectorProfileController],
  providers: [ProspectorProfileService],
  exports: [ProspectorProfileService],
})
export class ProspectorProfileModule {}
