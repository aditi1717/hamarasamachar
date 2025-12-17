import express from 'express';
import {
  getAllEpapers,
  getEpaperById
} from '../../controllers/user/epaperController.js';

const router = express.Router();

router.get('/', getAllEpapers);
router.get('/:id', getEpaperById);

export default router;

