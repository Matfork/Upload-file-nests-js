import * as express from 'express';
import { uploaderMulterController } from './controllers/uploader.multer.controller';
import { upload } from './storage';
import { middlewareHandleMulterErrors } from './middleware';
import { downloadController } from './controllers/download.controller';

const appRoutes = express();
const router = express.Router();


// Multer
router.post(
  '/uploader/add',
  middlewareHandleMulterErrors.bind(upload.single('single_file')),
  uploaderMulterController.uploaderFile
);

router.post(
  '/uploader/addMultiple',
  middlewareHandleMulterErrors.bind(upload.single('multiple_files')),
  uploaderMulterController.uploaderFile
);


router.get(
  '/download/',  
  downloadController.download
);

appRoutes.use('/api/', router);

export default appRoutes;
