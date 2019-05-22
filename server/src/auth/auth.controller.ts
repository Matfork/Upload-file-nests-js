import {
  Controller,
  Get,
  UseGuards,
  Post,
  Query,
  HttpStatus,
  HttpCode,
  UseFilters,
  Body,
  Session,
  Req,
  Res,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { HttpExceptionFilter } from '../common/filters/http-exception.filter';
import { JwtAuthGuard } from './guards/jwt-ath.guard';
import { RolesGuard } from './guards/roles.guard';
import { UserDtoRegister } from './dto/userDtoRegister';
import { Roles } from './decorators/roles.decorator';
import { redisClient } from '../redis.store';

@Controller('auth')
@UseFilters(HttpExceptionFilter)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  //@SetMetadata('roles', ['admin'])
  @Roles('admin')
  public async getAllUsers() {
    return {
      code: HttpStatus.OK,
      data: 'Provided user is admin',
    };
  }

  @Get('test')
  @UseGuards(JwtAuthGuard) //JwtAuthGuard handles custom error
  public async getUser(@Session() req) {
    return {
      code: HttpStatus.OK,
      data: 'ok',
    };
  }

  @Get('login')
  //@UseInterceptors(CacheInterceptor)
  @UseGuards(AuthGuard('local'))
  public async login(@Query('email') email, @Req() req) {
    req.session.user = email;
    if (req.sessionID) {
      redisClient.lpush(`nestjs_id:${email}`, req.sessionID);
    }

    return {
      code: HttpStatus.OK,
      data: await this.authService.createToken(email),
    };
  }

  @Post('register')
  @HttpCode(HttpStatus.OK)
  public async register(@Body() data: UserDtoRegister) {
    const role = data.role || 'user';
    const result = await this.authService.createUser({
      ...data,
      role,
    });
    return {
      code: HttpStatus.OK,
      data: result,
    };
  }

  @Get('logout')
  public async logout(@Session() ses, @Res() res) {
    const { user } = ses;

    if (user) {
      const sessionIds = await (redisClient as any).lrangeAsync(
        `nestjs_id:${user}`,
        0,
        -1,
      );

      const promises = [];
      for (let i = 0; i < sessionIds.length; i += 1) {
        promises.push(redisClient.del(`rid:${sessionIds[i]}`));
      }

      await Promise.all(promises);

      res.clearCookie('session_user');

      return res.status(HttpStatus.OK).json({
        code: HttpStatus.OK,
        data: true,
      });
    }

    return res.status(HttpStatus.OK).json({
      code: HttpStatus.OK,
      data: false,
    });
  }
}
