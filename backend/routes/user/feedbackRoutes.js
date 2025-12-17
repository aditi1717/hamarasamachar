import express from 'express';
import { createFeedback } from '../../controllers/user/feedbackController.js';
import { optionalUserAuth } from '../../middlewares/auth.js';

const router = express.Router();

router.post('/', optionalUserAuth, createFeedback);

export default router;

