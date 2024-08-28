import { Request, Response } from 'express';
import { ClientSession } from 'mongoose';
import { sendResponse } from '../utils/response.utils';
import {
  handleOwnerCreation,
  handleOwnerUpdate,
  deleteDocument,
  getOnwersByToken,
} from '../services/owner.services';
import { DecodedToken } from '../types/req.type';

export const create = async (
  req: Request & { userId?: DecodedToken['userId'] },
  res: Response
) => {
  const { owner } = req.body;
  const session: ClientSession = req.session!;

  const newOwner = await handleOwnerCreation(
    { ...owner, userId: req.userId },
    session
  );

  return sendResponse(res, 200, 'Created Owner', newOwner);
};

export const update = async (req: Request, res: Response) => {
  const { owner } = req.body;

  const updatedOnwer = await handleOwnerUpdate(owner);

  return sendResponse(res, 200, 'Onwer Updated Successfully', updatedOnwer);
};

export const deleteOwner = async (req: Request, res: Response) => {
  const { ownerId } = req.body;

  const deletedOwner = await deleteDocument(ownerId);

  return sendResponse(res, 200, 'Owner Deleted Successfully', deletedOwner);
};

export const getByToken = async (
  req: Request & { userId?: DecodedToken['userId'] },
  res: Response
) => {
  const userId = req.userId;

  const owners = await getOnwersByToken(userId);

  return sendResponse(res, 200, 'Get Owners', owners);
};
