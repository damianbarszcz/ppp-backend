import {ConflictException, Injectable, UnauthorizedException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/user.entity';
import { UserProfile } from "../user/user-profile.entity";
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService{
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(UserProfile)
        private profileRepository: Repository<UserProfile>,
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
    ) {}

    async createUser(name: string, surname:string, email: string, password: string, account_type: string) : Promise<void>  {
        const existingUser = await this.userService.findUserByEmail(email);
        if (existingUser) {
            throw new ConflictException('Użytkownik z tym adresem email już istnieje.');
        }

        const saltRounds = 10
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const user = this.userRepository.create({ email, password: hashedPassword, account_type });
        await this.userRepository.save(user);

        const user_avatar_color = this.generateRandomHexColor();

        const profile = this.profileRepository.create({ name, surname, user, user_avatar_color });
        await this.profileRepository.save(profile);
    }

    async login(user: any) {
        const payload = { email: user.email, sub: user.id };
        const access_token = this.jwtService.sign(payload, {
            expiresIn: '1h',
        });

        return { access_token };
    }

    async validateUser(email: string, password: string): Promise<User | null> {
        const user = await this.userService.findUserByEmail(email);
        const isPasswordValid = await bcrypt.compare(password, user.password);
        const errorMessage = "Nie znaleźliśmy konta pasującego do podanego adresu e-mail i hasła. Sprawdź swój adres e-mail i hasło i spróbuj ponownie.";

        if (!user) {
            throw new UnauthorizedException(errorMessage);
        }
        if (!isPasswordValid) {
            throw new UnauthorizedException(errorMessage);
        }
        return user;
    }

    generateRandomHexColor() : string {
        return '#' + Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, '0');
    }
}