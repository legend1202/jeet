import express from 'express';
import verifyToken from '../middleware/auth.middleware';

import {
  create,
  getByToken,
  update,
  deleteOwner,
} from '../controllers/owner.controller';
import { errorWrap } from '../utils/error.utils';

const router = express.Router();

router.post(
  '/',
  errorWrap(verifyToken, 'Could not verify JWT token'),
  errorWrap(create, 'Could not create Owner')
);

router.put(
  '/',
  errorWrap(verifyToken, 'Could not verify JWT token'),
  errorWrap(update, 'Could not update Owner')
);

router.delete(
  '/',
  errorWrap(verifyToken, 'Could not verify JWT token'),
  errorWrap(deleteOwner, 'Could not delete Onwer')
);

router.get(
  '/',
  errorWrap(verifyToken, 'Could not verify JWT token'),
  errorWrap(getByToken, 'Could not get Owner')
);

export default router;
