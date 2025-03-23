import {Controller, Post, Body, Request, Res, HttpStatus, UseGuards, Get} from '@nestjs/common';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from "./auth.service";
import { LocalAuthGuard } from './local-auth.guard';
import {UserService} from "../user/user.service";

@Controller('auth')
export class AuthController{
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService
    ) {}

    @Post('register')
    async createUser(
        @Body() body: { name:string, surname:string, email: string; password: string, account_type: string },
        @Res() res: Response
    ) : Promise<any>  {
        await this.authService.createUser(body.name, body.surname, body.email, body.password, body.account_type);

        return res.status(HttpStatus.CREATED).json({
            success: true,
            message: 'Twoje konto zostało poprawnie utworzone. Możesz się już zalogować.',
        });
    }

    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Request() req, @Res() res: Response) : Promise<any> {
        const { access_token } = await this.authService.login(req.user);

        res.cookie('access_token', access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 1000,
        });

        return res.status(HttpStatus.OK).json({ success: true });
    }

    @Post('logout')
    async logout(@Res() res: Response) : Promise<any> {
        res.clearCookie('access_token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
        });

        return res.status(HttpStatus.OK).json({ success: true });
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('me')
    async getProfile(@Request() req) {
        if (!req.user) {
            return { user: null };
        }
        const user  = await this.userService.findUserByEmail(req.user.email);

        return {
            user: {
                id: user.id,
                email: user.email,
                account_type: user.account_type
            }
        };
    }
}