import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class RolesGraphqlGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const ctx = GqlExecutionContext.create(context);
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    const { req } = ctx.getContext();

    if (!roles) {
      return true;
    }

    const user = req.user;

    // const hasRole = () =>
    // user.roles.some(role => !!roles.find(item => item === role));

    if (!(user && user.role && roles.includes(user.role))) {
      throw new UnauthorizedException(`User provided is not ${roles[0]}`);
    }
    return true;
  }
}
