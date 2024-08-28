import {
  ClientSession,
  FilterQuery,
  ProjectionType,
  QueryOptions,
  UpdateQuery,
} from 'mongoose';
import { RequestError } from '../utils/globalErrorHandler';
import { Strategy, StrategyModel } from '../models/strategy.model';

export const handleStrategyCreation = async (
  strategy: Partial<Strategy> & Document,
  session?: ClientSession
): Promise<Strategy> => {
  const newStrategy = new StrategyModel({ ...strategy });

  await newStrategy.save({ session });

  return newStrategy;
};

export const handleStrategyUpdate = async (
  strategy: Partial<Strategy> & Document,
  session?: ClientSession
): Promise<Strategy> => {
  const { id } = strategy;

  if (!id) throw new RequestError('Invalid fields. Strategy', 400);

  const updatedStrategy = await findByIdAndUpdateStrategyDocument(
    id,
    { ...strategy },
    { returnNewDocument: true }
  );

  if (updatedStrategy) {
    return updatedStrategy;
  } else {
    throw new RequestError(`${id} Strategy update failed`, 500);
  }
};

export async function findOneStrategy(
  filter?: FilterQuery<Strategy>,
  projection?: ProjectionType<Strategy>,
  options?: QueryOptions<Strategy>
): Promise<Strategy | null> {
  return await StrategyModel.findOne(filter, projection, options);
}

export const deleteDocument = async (
  strategyId: string,
  session?: ClientSession
): Promise<any> => {
  if (!strategyId) throw new RequestError('Strategy Id must not be empty', 400);

  const existingOwner = await findOneStrategy({
    id: strategyId,
  });

  if (existingOwner) {
    try {
      const deletedStrategy = await deleteStrategy(strategyId);
      return deletedStrategy;
    } catch (e: any) {
      throw new RequestError(`${e.errmsg}`, 500);
    }
  } else {
    throw new RequestError(`There is no ${strategyId} Strategy.`, 500);
  }
};

export const getStrategiesByToken = async (
  userId?: string,
  session?: ClientSession
): Promise<Strategy[] | null> => {
  if (!userId) throw new RequestError('User Id must not be empty', 400);

  const strategies = await StrategyModel.find();
  return strategies;
};

export const findByIdAndUpdateStrategyDocument = async (
  id: string,
  update: UpdateQuery<Strategy>,
  options?: QueryOptions<Strategy>
) => {
  return await StrategyModel.findOneAndUpdate({ id }, update, {
    ...options,
    returnDocument: 'after',
  });
};

export const deleteStrategy = async (
  strategyId: string,
  options?: QueryOptions<Strategy>
) => {
  return await StrategyModel.deleteOne({ id: strategyId });
};
