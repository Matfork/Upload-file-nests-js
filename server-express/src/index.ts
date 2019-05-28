import * as express from 'express';
import * as bodyParser from 'body-parser';
import { ApolloServer } from 'apollo-server-express';
import { schema } from './graphql';
import appRoutes from './routes';
import * as cors from 'cors';
import * as cookieParser from 'cookie-parser';

const maxSizePerFile: number = 10;

export const startServer = async () => {
  const app = express();

  //Adding all middlewaes
  app.use(
    cors({
      origin: 'http://localhost:3000',
      optionsSuccessStatus: 200,
      credentials: true
    })
  );
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(cookieParser());

  const server = new ApolloServer({
    schema: schema,
    context: ({ req, res }: any) => ({
      req,
      res
    }),
    introspection: true,
    playground: true,
    uploads: {
      //maxFieldSize: ?,
      maxFileSize: maxSizePerFile * 1000000,
      maxFiles: 3
    }
  });

  server.applyMiddleware({
    app,
    cors: false,
    path: '/api/graphql'
  });

  //Adding Routes
  app.use(appRoutes);

  return app.listen({ port: 4001 }, () => {
    console.log('Server initialized in port 4001');
  });
};

startServer();
