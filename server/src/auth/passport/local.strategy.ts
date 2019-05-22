import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import * as passportLocal from 'passport-local';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(passportLocal.Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: false,
    });
  }

  async validate(email, password, done) {
    const users = await this.authService.getUsers();
    const user = users.find(el => el.email === email);

    if (!user) {
      throw new UnauthorizedException('Wrong email');
    }

    if (password !== '12345678') {
      throw new UnauthorizedException('Wrong password');
    }

    return done(null, { user: { email, password } });
  }
}
