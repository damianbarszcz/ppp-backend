import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';

@Module({
    imports: [TypeOrmModule.forFeature([User])], // Rejestracja encji User
    controllers: [UserController], // Rejestracja kontrolera
    providers: [UserService],      // Rejestracja serwisu
})
export class UserModule {}