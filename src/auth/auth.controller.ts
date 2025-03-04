import {Controller, Post, Body, Request, Res, HttpStatus, UseGuards, Get} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from "./auth.service";
import { LocalAuthGuard } from './local-auth.guard';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController{
    constructor(private readonly authService: AuthService) {}

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
        console.log("✔️ Logowanie udane, generuję token...");

        const { access_token } = await this.authService.login(req.user);

        res.cookie('access_token', access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 1000,
        });

        console.log("✔️ Token JWT wygenerowany:", access_token);

        return res.status(HttpStatus.OK).json({
            success: true,
            message: "Logowanie zakończone sukcesem.",
        });
    }

    @Post('logout')
    async logout(@Res() res: Response) : Promise<any> {
        res.clearCookie('access_token');
        return res.status(HttpStatus.OK);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('me')
    async getProfile(@Request() req) {
        console.log("🔍 Sprawdzam użytkownika w /auth/me:", req.user);

        if (!req.user) {
            return { user: null };
        }

        return { user: req.user };
    }
}