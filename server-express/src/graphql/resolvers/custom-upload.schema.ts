import { GraphQLSchema, GraphQLObjectType, GraphQLBoolean } from 'graphql';
import { GraphQLUpload } from 'graphql-upload';

// No needed when using apollo-server
export const schema = new GraphQLSchema({
  query: null,
  mutation: new GraphQLObjectType({
    name: 'Mutation',
    fields: {
      uploadImage: {
        description: 'Uploads an image.',
        type: GraphQLBoolean,
        args: {
          image: {
            description: 'Image file.',
            type: GraphQLUpload
          }
        },
        async resolve(parent, { image }) {
          const { filename, mimetype, createReadStream } = await image;
          const stream = createReadStream();
          // Promisify the stream and store the file, then…
          return true;
        }
      }
    }
  })
});
