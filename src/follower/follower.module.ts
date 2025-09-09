import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Follower } from './follower.entity';
import { FollowerService } from './follower.service';
import { FollowerController } from './follower.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Follower])],
  providers: [FollowerService],
  controllers: [FollowerController],
  exports: [FollowerService],
})
export class FollowerModule {}
