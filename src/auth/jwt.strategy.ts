import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { User, UserSchema } from './schema/users.schemas';
import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @InjectModel(User.name)
        private readonly userModel: Model<User>,
        private readonly configService: ConfigService,
    ) {
        super({
            secretOrKey: configService.get('JWT_SECRET'),
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        });
    }

    async validate(payload: any): Promise<User> {
        const { username } = payload;
        const findUser: User = await this.userModel.find({ username }).exec();
        if (!findUser) {
            throw new UnauthorizedException();
        }
        return findUser;
    }
}
