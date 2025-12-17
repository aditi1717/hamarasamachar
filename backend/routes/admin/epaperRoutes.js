import express from 'express';
import {
  getAllEpapers,
  uploadEpaper,
  deleteEpaper
} from '../../controllers/admin/epaperController.js';
import { adminAuth } from '../../middlewares/auth.js';
import { uploadPDF } from '../../middlewares/upload.js';

const router = express.Router();

router.use(adminAuth);

router.get('/', getAllEpapers);
router.post('/', uploadPDF.single('file'), uploadEpaper);
router.delete('/:id', deleteEpaper);

export default router;

