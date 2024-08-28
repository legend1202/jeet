import express from 'express';
import verifyToken from '../middleware/auth.middleware';

import {
  create,
  getByToken,
  update,
  deleteStrategy,
} from '../controllers/strategy.controller';
import { errorWrap } from '../utils/error.utils';

const router = express.Router();

router.post(
  '/',
  errorWrap(verifyToken, 'Could not verify JWT token'),
  errorWrap(create, 'Could not create Strategy')
);

router.put(
  '/',
  errorWrap(verifyToken, 'Could not verify JWT token'),
  errorWrap(update, 'Could not update Strategy')
);

router.delete(
  '/',
  errorWrap(verifyToken, 'Could not verify JWT token'),
  errorWrap(deleteStrategy, 'Could not delete Strategy')
);

router.get(
  '/',
  errorWrap(verifyToken, 'Could not verify JWT token'),
  errorWrap(getByToken, 'Could not get Strategys')
);

export default router;
