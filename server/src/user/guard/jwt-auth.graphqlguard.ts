import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGraphqlGuard extends AuthGuard('jwt') {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const { req } = ctx.getContext();

    return super.canActivate(new ExecutionContextHost([req]));
  }

  // getRequest(context: ExecutionContext) {
  //   const ctx = GqlExecutionContext.create(context);
  //   return ctx.getContext().req;
  // }

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
