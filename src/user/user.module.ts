import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserProfile } from './user-profile.entity';
import { UserService } from './user.service';

@Module({
    imports: [TypeOrmModule.forFeature([User, UserProfile])],
    providers: [UserService],
    exports: [UserService],
})
export class UserModule {}
