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
        const hashed_password : string = await bcrypt.hash(password, saltRounds);
        const password_length : number = password.length

        const user = this.userRepository.create({ email, password: hashed_password, account_type, password_length });
        await this.userRepository.save(user);

        const user_avatar_color = this.generateRandomHexColor();
        const username = await this.generateUniqueUsername(name, surname, email);

        const profile = this.profileRepository.create({ name, surname, user, user_avatar_color,username});
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

    async generateUniqueUsername(name: string, surname: string, email: string): Promise<string> {
        const baseUsername = `${name}${surname}`.toLowerCase().replace(/\s+/g, '');

        const exists = await this.checkUsernameExists(baseUsername);
        if (!exists) {
            return baseUsername;
        }

        let counter = 1;
        let username = `${baseUsername}${counter}`;

        while (await this.checkUsernameExists(username)) {
            counter++;
            username = `${baseUsername}${counter}`;

            if (counter > 9999) {
                username = `${baseUsername}${Math.random().toString(36).substring(2, 7)}`;
                break;
            }
        }

        return username;
    }

    async checkUsernameExists(username: string): Promise<boolean> {
        const count = await this.profileRepository.count({
            where: { username }
        });
        return count > 0;
    }
}