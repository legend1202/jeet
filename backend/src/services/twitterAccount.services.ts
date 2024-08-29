import {
  ClientSession,
  FilterQuery,
  ProjectionType,
  QueryOptions,
  UpdateQuery,
} from 'mongoose';
import { RequestError } from '../utils/globalErrorHandler';
import {
  TwitterAccount,
  TwitterAccountModel,
} from '../models/twitterAccount.model';
import { OwnerModel } from '../models/owner.model';
import { StrategyModel } from '../models/strategy.model';

export const handleTwitterAccountCreation = async (
  twitterAccount: Partial<TwitterAccount> & Document,
  session?: ClientSession
): Promise<TwitterAccount> => {
  const newTwitterAccount = new TwitterAccountModel({ ...twitterAccount });

  await newTwitterAccount.save({ session });

  return newTwitterAccount;
};

export const handleTwitterAccountUpdate = async (
  twitterAccount: Partial<TwitterAccount> & Document,
  session?: ClientSession
): Promise<TwitterAccount> => {
  const { id } = twitterAccount;

  if (!id) throw new RequestError('Invalid fields. Strategy', 400);

  const updatedTwitterAccount = await findByIdAndUpdateTwitterAccountDocument(
    id,
    { ...twitterAccount },
    { returnNewDocument: true }
  );

  if (updatedTwitterAccount) {
    return updatedTwitterAccount;
  } else {
    throw new RequestError(`${id} Strategy update failed`, 500);
  }
};

export async function findOneTwitterAccount(
  filter?: FilterQuery<TwitterAccount>,
  projection?: ProjectionType<TwitterAccount>,
  options?: QueryOptions<TwitterAccount>
): Promise<TwitterAccount | null> {
  return await TwitterAccountModel.findOne(filter, projection, options);
}

export const deleteDocument = async (
  twitterAccountId: string,
  session?: ClientSession
): Promise<any> => {
  if (!twitterAccountId)
    throw new RequestError('Twitter account Id must not be empty', 400);

  const existingTwitterAccount = await findOneTwitterAccount({
    id: twitterAccountId,
  });

  if (existingTwitterAccount) {
    try {
      const deletedTwitterAccount =
        await deleteTwitterAccount(twitterAccountId);
      return deletedTwitterAccount;
    } catch (e: any) {
      throw new RequestError(`${e.errmsg}`, 500);
    }
  } else {
    throw new RequestError(
      `There is no ${twitterAccountId} Twitter Account.`,
      500
    );
  }
};

export const getTwitterAccountByToken = async (
  userId?: string,
  session?: ClientSession
): Promise<TwitterAccount[] | null> => {
  if (!userId) throw new RequestError('User Id must not be empty', 400);

  const result = await TwitterAccountModel.find();

  return result;
};

export const findByIdAndUpdateTwitterAccountDocument = async (
  id: string,
  update: UpdateQuery<TwitterAccount>,
  options?: QueryOptions<TwitterAccount>
) => {
  return await TwitterAccountModel.findOneAndUpdate({ id }, update, {
    ...options,
    returnDocument: 'after',
  });
};

export const deleteTwitterAccount = async (
  twitterAccountId: string,
  options?: QueryOptions<TwitterAccount>
) => {
  return await TwitterAccountModel.deleteOne({ id: twitterAccountId });
};
