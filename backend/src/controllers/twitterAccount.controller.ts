import { Request, Response } from 'express';
import { ClientSession } from 'mongoose';
import { sendResponse } from '../utils/response.utils';
import {
  handleTwitterAccountCreation,
  handleTwitterAccountUpdate,
  deleteDocument,
  getTwitterAccountByToken,
} from '../services/twitterAccount.services';
import { DecodedToken } from '../types/req.type';

export const create = async (
  req: Request & { userId?: DecodedToken['userId'] },
  res: Response
) => {
  const { twitterAccount } = req.body;
  const session: ClientSession = req.session!;

  const newTwitterAccount = await handleTwitterAccountCreation(
    twitterAccount,
    session
  );

  return sendResponse(res, 200, 'Created twitter account', newTwitterAccount);
};

export const update = async (req: Request, res: Response) => {
  const { twitterAccount } = req.body;

  const updatedTwitterAccount =
    await handleTwitterAccountUpdate(twitterAccount);

  return sendResponse(
    res,
    200,
    'twitter account Updated Successfully',
    updatedTwitterAccount
  );
};

export const deleteTwitterAccount = async (req: Request, res: Response) => {
  const { twitterAccountId } = req.body;

  const deletedTwitterAccount = await deleteDocument(twitterAccountId);

  return sendResponse(
    res,
    200,
    'Twitter account Deleted Successfully',
    deletedTwitterAccount
  );
};

export const getByToken = async (
  req: Request & { userId?: DecodedToken['userId'] },
  res: Response
) => {
  const userId = req.userId;

  const strategies = await getTwitterAccountByToken(userId);

  return sendResponse(res, 200, 'Get Account', strategies);
};
