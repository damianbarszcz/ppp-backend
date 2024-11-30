import { Controller, Get, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './entities/user.entity';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get()
    async findAll(): Promise<User[]> {
        return this.userService.getUsers(); // Pobranie wszystkich użytkowników
    }

    @Post()
    async create(@Body() user: Partial<User>): Promise<User> {
        return this.userService.createUser(user); // Tworzenie nowego użytkownika
    }
}