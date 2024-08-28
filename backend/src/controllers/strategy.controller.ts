import { Request, Response } from 'express';
import { ClientSession } from 'mongoose';
import { sendResponse } from '../utils/response.utils';
import {
  handleStrategyCreation,
  handleStrategyUpdate,
  deleteDocument,
  getStrategiesByToken,
} from '../services/strategy.services';
import { DecodedToken } from '../types/req.type';

export const create = async (
  req: Request & { userId?: DecodedToken['userId'] },
  res: Response
) => {
  const { strategy } = req.body;
  const session: ClientSession = req.session!;

  const newOwner = await handleStrategyCreation(strategy, session);

  return sendResponse(res, 200, 'Created Strategy', newOwner);
};

export const update = async (req: Request, res: Response) => {
  const { strategy } = req.body;

  const updatedStrategy = await handleStrategyUpdate(strategy);

  return sendResponse(res, 200, 'Onwer Updated Successfully', updatedStrategy);
};

export const deleteStrategy = async (req: Request, res: Response) => {
  const { strategyId } = req.body;

  const deletedStrategy = await deleteDocument(strategyId);

  return sendResponse(res, 200, 'Strategy Deleted Successfully', deletedStrategy);
};

export const getByToken = async (
  req: Request & { userId?: DecodedToken['userId'] },
  res: Response
) => {
  const userId = req.userId;

  const strategies = await getStrategiesByToken(userId);

  return sendResponse(res, 200, 'Get Strategy', strategies);
};
