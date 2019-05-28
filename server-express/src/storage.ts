import * as multer from 'multer';

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

// Validating Max file size
const maxSizeInMb: number = 3.4;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, '../tmp/uploads');
  },
  filename: (req, file, cb) => {
    console.log('filename', file);
    const mimeType = supporttedMimeTypes.find(el => el === file.mimetype);
    const extension = mimeType ? extensions[mimeType] : '.txt';
    cb(null, `${file.fieldname}-${Date.now()}${extension}`);
  }
});

export const upload = multer({
  storage: storage,
  limits: {
    // fieldNameSize: 100,
    // fieldSize: 1000000,
    // fields: 100,
    fileSize: maxSizeInMb * 1000000,
    files: 2
  },
  //This will run for every file that we have (Single or array)
  fileFilter(req, file, cb) {
    console.log('fileFilter', file);
    let err = []; // create empty array
    const files: Express.Multer.File[] = [file];

    try {
      for (var x = 0; x < files.length; x++) {
        if (supporttedMimeTypes.every(type => files[x].mimetype !== type)) {
          // assign message to array
          err[x] = files[x].mimetype + ' is not a supported format\n';
        }
      }

      // The function should call `cb` with a boolean to indicate if the file should be accepted
      if (err.length !== 0) {
        // To reject this file pass `false`, like so:
        cb(null, false);
        throw new Error(err[0]);
      } else {
        // To accept the file pass `true`, like so:
        cb(null, true);
      }

      // You can always pass an error if something goes wrong:
    } catch (e) {
      cb(new Error(e), false);
    }
  }
});
