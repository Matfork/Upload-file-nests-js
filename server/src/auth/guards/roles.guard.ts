import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // const hasRole = () =>
    // user.roles.some(role => !!roles.find(item => item === role));

    if (!(user && user.role && roles.includes(user.role))) {
      throw new UnauthorizedException(`User provided is not ${roles[0]}`);
    }
    return true;
  }
}
