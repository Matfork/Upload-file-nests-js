import { Module, CacheModule } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { UploadModule } from './upload/upload.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { redisConn, redisCache } from './redis.store';

@Module({
  imports: [
    AuthModule,
    UploadModule,
    UserModule,
    CacheModule.register(redisConn),
    GraphQLModule.forRoot({
      context: ({ req, res }) => ({
        redis: redisCache,
        session: req ? req.session : undefined,
        req,
        res,
      }),
      typePaths: ['./**/*.graphql'],
      installSubscriptionHandlers: true,
      debug: true,
      playground: true,
      introspection: true,
      cors: false,
      path: '/api/graphql',
    }),
  ],
})
export class AppModule {}
