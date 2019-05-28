import * as multer from 'multer';

export const middlewareHandleMulterErrors = function(this: any) {
  const [req, res, next]: any = arguments;
  const multerMethod = this;

  return multerMethod(req, res, (err: any) => {
    if (err instanceof (multer as any).MulterError) {
      let message = '';
      switch (err.code) {
        case 'LIMIT_FILE_SIZE':
          message = 'File is too large';
          break;
        case 'LIMIT_UNEXPECTED_FILE':
          message = 'You can upload a maximun amount of 3 files';
          break;
      }
      res.status(400).json({
        error: message
      });
    } else if (err) {
      res.status(400).json({
        error: err.message
      });
    }
  });
};
