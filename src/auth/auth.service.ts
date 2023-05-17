import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Auth } from './schemas/auth.schema';
import { AuthCredentialsDto } from './dtos/auth-credentials.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(@InjectModel('Auth') private readonly authModel: Model<Auth>) {}

  async createAuthUser(authCredentials: AuthCredentialsDto): Promise<void> {
    const { username, password } = authCredentials;

    // hashing
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const authUser = new this.authModel({
      username,
      password: hashedPassword,
    });

    try {
      await authUser.save();
    } catch (erort) {}
  }

  signUp(authCredentials: Auth): Promise<void> {
    return this.createAuthUser(authCredentials);
  }
}
