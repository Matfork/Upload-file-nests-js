import * as fs from 'fs';

const TMP_UPLOAD_DIR = '../tmp/uploads/';

export class downloadController {
  public static async download(req: any, res: any) {
    try {
      const { query } = req;
      console.log('downloadFile');
      console.log('req', query.name);

      const path = `${TMP_UPLOAD_DIR}${query.name}`;
      console.log(path);

      if (fs.existsSync(path)) {
        return res.download(path); // Set disposition and send it.
      } else {
        throw new Error(`File ${query.name} not found in server`);
      }
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: err.message });
    }
  }
}
