import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    // add your custom authentication logic here
    // for example, call super.logIn(request) to establish a session.
    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    if (info && info.name === 'JsonWebTokenError') {
      throw new UnauthorizedException(info.message);
    }
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
