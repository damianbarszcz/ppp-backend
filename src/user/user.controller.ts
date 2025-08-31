
import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
    constructor(
        private readonly userService: UserService,
    ) {}

    @Get('username/:username')
    async getUserByUsername(@Param('username') username: string) {
        const user = await this.userService.findByUsername(username);
        if (!user) {
            throw new NotFoundException('Użytkownik nie został znaleziony');
        }
        return { success: true, data: user };
    }
}