import express from 'express';
import upload from '../middlewares/uploadMiddleware.js';
import { getContracts, uploadContent } from '../controllers/contractController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();
router.post('/upload', authMiddleware, upload.single('contract'), uploadContent);
router.get('/', authMiddleware, getContracts);

export default router;
