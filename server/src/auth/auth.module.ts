import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './passport/jwt.strategy';
import { LocalStrategy } from './passport/local.strategy';

@Module({
  imports: [
    PassportModule.register({
      session: false,
      property: 'user',
      defaultStrategy: 'jwt',
    }),
    JwtModule.register({
      secret: 'secretKey',
      signOptions: {
        expiresIn: 1000 * 60 * 60 * 24, // 7 days,
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, LocalStrategy],
})
export class AuthModule {}
