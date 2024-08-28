import express from 'express';
import authRoutes from './auth.routes';
import ownerRoutes from './owner.routes';
import uploadRoutes from './upload.routes';
import strategyRoutes from './strategy.routes';
import { sendResponse } from '../utils/response.utils';
import twitterAccountRoutes from './twitterAccount.routes';

const router = express.Router();

router.get('/', (req, res) => sendResponse(res, 200, `API is running`));
router.use('/api/auth', authRoutes);
router.use('/api/owner', ownerRoutes);
router.use('/api/upload', uploadRoutes);
router.use('/api/strategy', strategyRoutes);
router.use('/api/twitteraccount', twitterAccountRoutes);

export default router;
