import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([(req) => {
                return req?.cookies?.access_token || null;
            }]),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET || 'super-secret-key',
        });
    }

    async validate(payload: any) {
        return { userId: payload.sub, email: payload.email };
    }
}