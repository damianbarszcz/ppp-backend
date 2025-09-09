import {
  Controller,
  Post,
  Body,
  Request,
  Res,
  HttpStatus,
  UseGuards,
  Get,
  UnauthorizedException,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { plainToInstance } from 'class-transformer';
import { LoginDto } from '../dto/auth/login.dto';
import { validate } from 'class-validator';
import { RegisterDto } from '../dto/auth/register.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('login')
  public async login(@Body() body: any, @Res() res: Response): Promise<void> {
    try {
      const dto = plainToInstance(LoginDto, body);
      const errors = await validate(dto);

      if (errors.length > 0) {
        const formattedErrors = errors.map((error) => ({
          field: error.property,
          message: Object.values(error.constraints || {})[0],
        }));

        res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
          success: false,
          errors: formattedErrors,
        });
        return;
      }

      const user = await this.authService.validateUser(dto.email, dto.password);
      const { access_token } = await this.authService.login(user);

      res.clearCookie('access_token', {
        path: '/',
        domain: 'localhost',
      });
      res.cookie('access_token', access_token, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 1000,
      });
      res.status(HttpStatus.OK).json({
        success: true,
        account_type: user.account_type,
      });
    } catch (error: any) {
      if (error instanceof UnauthorizedException) {
        res.status(HttpStatus.UNAUTHORIZED).json({
          success: false,
          message: error.message,
        });
      } else {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false });
      }
    }
  }

  @Post('logout')
  public async logout(@Res() res: Response): Promise<any> {
    res.clearCookie('access_token', {
      path: '/',
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
    });

    return res.status(HttpStatus.OK).json({ success: true });
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  public async getProfile(@Request() req) {
    if (!req.user) {
      return { user: null };
    }
    const user = await this.userService.findUserByEmail(req.user.email);

    return {
      user: {
        id: user.id,
        email: user.email,
        account_type: user.account_type,
        password_length: user.password_length,
        profile: {
          user_avatar_color: user.profile?.user_avatar_color,
          username: user.profile?.username,
          biogram: user.profile?.biogram,
          name: user.profile?.name,
          surname: user.profile?.surname,
          mentor_subscribe_price: user.profile?.mentor_subscribe_price,
        },
      },
    };
  }

  @Post('register')
  public async createUser(
    @Body() body: any,
    @Res() res: Response,
  ): Promise<void> {
    try {
      const dto = plainToInstance(RegisterDto, body);
      const errors = await validate(dto);

      if (errors.length > 0) {
        const formattedErrors = errors.map((error) => ({
          field: error.property,
          message: Object.values(error.constraints || {})[0],
        }));

        res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
          success: false,
          errors: formattedErrors,
        });
        return;
      }
      await this.authService.createUser(
        dto.name,
        dto.surname,
        dto.email,
        dto.password,
        dto.account_type,
      );

      res.status(HttpStatus.CREATED).json({
        success: true,
        message:
          'Twoje konto zostało poprawnie utworzone. Możesz się już zalogować.',
      });
    } catch {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false });
    }
  }

  @Post('register-validate-step1')
  public async reigsterValidateStep1(
    @Body() body: any,
    @Res() res: Response,
  ): Promise<void> {
    try {
      const step1Data = {
        name: body.name,
        surname: body.surname,
        email: body.email,
        password: body.password,
      };

      const dto = plainToInstance(RegisterDto, step1Data);
      const errors = await validate(dto, {
        skipMissingProperties: true,
      });

      if (errors.length > 0) {
        const formattedErrors = errors.map((error) => ({
          field: error.property,
          message: Object.values(error.constraints || {})[0],
        }));

        res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
          success: false,
          errors: formattedErrors,
        });
        return;
      }

      const existingUser = await this.userService.findUserByEmail(body.email);
      if (existingUser) {
        res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
          success: false,
          errors: [
            { field: 'email', message: 'Ten adres email jest już zajęty.' },
          ],
        });
        return;
      }
      res.status(HttpStatus.OK).json({ success: true });
    } catch {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false });
    }
  }

  @Post('register-validate-step2')
  public async registerValidateStep2(
    @Body() body: any,
    @Res() res: Response,
  ): Promise<void> {
    try {
      const step2Data = { account_type: body.account_type };

      const dto = plainToInstance(RegisterDto, step2Data);
      const errors = await validate(dto, {
        skipMissingProperties: true,
      });

      if (errors.length > 0) {
        const formattedErrors = errors.map((error) => ({
          field: error.property,
          message: Object.values(error.constraints || {})[0],
        }));

        res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
          success: false,
          errors: formattedErrors,
        });
        return;
      }
      res.status(HttpStatus.OK).json({ success: true });
    } catch {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false });
    }
  }
}
