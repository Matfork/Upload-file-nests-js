import { IResolvers } from 'graphql-tools';
import { GraphQLUpload } from 'graphql-upload';

import * as fs from 'fs';
import * as lowdb from 'lowdb';
import * as FileSync from 'lowdb/adapters/FileSync';
import * as mkdirp from 'mkdirp';
import * as shortid from 'shortid';

const TMP_UPLOAD_DIR = '../tmp/uploads-graphql';
const UPLOAD_DIR = '../uploads/uploads-graphql';
const db = lowdb(new FileSync('../tmp/db.json'));

// Seed an empty DB.
db.defaults({ uploads: [] }).write();

// Ensure upload directory exists.
mkdirp.sync(TMP_UPLOAD_DIR);

const storeFS = ({
  stream,
  filename,
  id
}: {
  id: string;
  stream: NodeJS.ReadableStream;
  filename: string;
}) => {
  const path = `${TMP_UPLOAD_DIR}/${id}-${filename}`;
  const writeableStream = fs.createWriteStream(path, {});
  const maxFileInMb = 5;
  const maxFileSize = maxFileInMb * 1000000;
  let bytes = 0;

  return new Promise((resolve, reject) =>
    stream
      .on('data', (chunksOfBytes: any) => {
        bytes += chunksOfBytes.length;
        // console.log('data rs', chunksOfBytes.length);
        // if (bytes >= maxFileSize) {
        //   stream.pause();
        //   (stream as any).destroy(new Error('reached filed limit'));
        //   reject('aaa');
        // }
      })
      .on('end', () => {
        if (bytes >= maxFileSize) {
          (stream as any).destroy(
            new Error(`${filename} file exceeds ${maxFileInMb}Mb size limit`)
          );
        }
      })
      .on('error', (error: any) => {
        console.log('error on rs');
        if (!!fs.existsSync(path)) {
          fs.unlinkSync(path);
        }
        reject(error);
      })
      .pipe(writeableStream)
      .on('error', (error: any) => {
        console.log('error on ws');
        reject(error);
      })
      .on('finish', () => {
        console.log('finish ws');
        // if (!!fs.existsSync(path)) {
        //   const stats = fs.statSync(path);
        //   console.log(stats);
        // }
        resolve({ path });
      })
  );
};

const storeDB = (file: any) => {
  return (db as any)
    .get('uploads')
    .push(file)
    .last()
    .write();
};

const processUpload = async (id: string, upload: any) => {
  const { createReadStream, filename, mimetype } = await upload;
  const stream: NodeJS.ReadableStream = createReadStream();

  const { path }: any = await storeFS({ id, stream, filename });
  return storeDB({ id, filename, mimetype, path });
};

const deleteFromTmp = async (paths: string[]) => {
  paths.forEach(path => {
    const np = `${TMP_UPLOAD_DIR}/${path}`;
    if (!!fs.existsSync(np)) {
      fs.unlinkSync(np);
    }
  });
};

const copyFilesFromTmpToUploads = async (paths: string[]) => {
  paths.forEach(path => {
    const op = `${TMP_UPLOAD_DIR}/${path}`;
    const np = `${UPLOAD_DIR}/${path}`;

    if (!!fs.existsSync(op)) {
      fs.copyFile(op, np, err => {
        if (err) throw err;
      });
    }
  });
};

// Validating MimeTypes
const supporttedMimeTypes = [
  'image/png',
  'image/jpeg',
  'image/gif',
  'application/pdf'
];
const extensions = {
  'image/png': '.png',
  'image/jpeg': '.jpg',
  'image/gif': '.gif',
  'application/pdf': '.pdf'
} as any;

export const uploaderResolver: IResolvers = {
  Query: {
    test: async (_, __, { req }) => {
      return true;
    }
  },
  Mutation: {
    singleUpload: async (_, params, ctx, info) => {
      let err = [];
      const { file, name, age } = params;
      const { filename, mimetype, encoding } = await file;
      // create empty array
      if (supporttedMimeTypes.every(type => mimetype !== type)) {
        err.push(mimetype + ' is not a supported format\n');
      }
      if (err.length !== 0) {
        throw err[0];
      }

      //console.log('singleUpload', file, name, age);
      const id = shortid.generate();
      const response = await processUpload(id, file);
      console.log('-->', response);

      return { filename, mimetype, encoding };
    },
    multipleUpload: async (_, params) => {
      const files: any[] = await Promise.all(params.file);
      let paths: any = [];
      let result = [];

      try {
        const promises = files.map(file => {
          const id = shortid.generate();
          paths.push(`${id}-${file.filename}`);
          return processUpload(id, file);
        });

        result = await Promise.all(promises);
        copyFilesFromTmpToUploads(paths);

        return result;
      } catch ($e) {
        deleteFromTmp(paths);
        throw $e;
      }
    }
  }
};

export const customUploadResolvers = {
  Upload: GraphQLUpload
};
