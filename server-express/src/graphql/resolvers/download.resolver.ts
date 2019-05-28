import { IResolvers } from 'graphql-tools';
import { GraphQLUpload } from 'graphql-upload';
import * as fs from 'fs';

const UPLOAD_DIR = '../uploads/uploads-graphql/';

export const downloadResolver: IResolvers = {
  Mutation: {
    donwloadFile: async (_, params, { req }) => {
      const path = `${UPLOAD_DIR}${params.name}`;
      console.log(path);

      if (fs.existsSync(path)) {
        const file = fs.readFileSync(path);
        // convert binary data to base64 encoded string
        const fileInBase64 = Buffer.from(file).toString('base64');
        return fileInBase64;
      }

      return null;
    }
  }
};

export const customUploadResolvers = {
  Upload: GraphQLUpload
};
