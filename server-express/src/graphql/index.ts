import * as glob from 'glob';
import * as path from 'path';
import * as fs from 'fs';
import { makeExecutableSchema } from 'graphql-tools';
import { mergeResolvers, mergeTypes } from 'merge-graphql-schemas';
import {
  uploaderResolver,
  customUploadResolvers
} from './resolvers/uploader.resolver';
import { downloadResolver } from './resolvers/download.resolver';

const pathToTypes = path.join(__dirname, '../graphql/schemas');

const graphqlTypes = glob
  .sync(`${pathToTypes}/**.graphql`)
  .map(x => fs.readFileSync(x, { encoding: 'utf8' }));

const typeDefs = mergeTypes(graphqlTypes);

// Good old manual way
const resolvers = mergeResolvers([
  customUploadResolvers,
  uploaderResolver,
  downloadResolver
]);

export const schema = makeExecutableSchema({
  typeDefs: typeDefs,
  resolvers: resolvers
});
