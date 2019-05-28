import { upload } from '../storage';
import * as multer from 'multer';

export class uploaderMulterController {
  public static async uploaderFile(req: any, res: any) {
    try {
      // uploadSingle(req, res, err => {

      //   if (err instanceof (multer as any).MulterError) {
      //     throw err;
      //   } else if (err) {
      //     throw err;
      //   }
      //   console.log('aaa');
      //   return res.status(200).send(req.file);
      // });

      console.log('uploaderFile');
      console.log('req', req.body, req.file, req.files);
      return res.status(200).json({ data: true });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: err.message });
    }
  }
}
