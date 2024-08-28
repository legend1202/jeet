import express from 'express';
import verifyToken from '../middleware/auth.middleware';

import {
  create,
  getByToken,
  update,
  deleteTwitterAccount,
} from '../controllers/twitterAccount.controller';
import { errorWrap } from '../utils/error.utils';

const router = express.Router();

router.post(
  '/',
  errorWrap(verifyToken, 'Could not verify JWT token'),
  errorWrap(create, 'Could not create Account')
);

router.put(
  '/',
  errorWrap(verifyToken, 'Could not verify JWT token'),
  errorWrap(update, 'Could not update Account')
);

router.delete(
  '/',
  errorWrap(verifyToken, 'Could not verify JWT token'),
  errorWrap(deleteTwitterAccount, 'Could not delete Account')
);

router.get(
  '/',
  errorWrap(verifyToken, 'Could not verify JWT token'),
  errorWrap(getByToken, 'Could not get Account')
);

export default router;
