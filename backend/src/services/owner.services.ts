import {
  ClientSession,
  FilterQuery,
  ProjectionType,
  QueryOptions,
  UpdateQuery,
} from 'mongoose';
import { RequestError } from '../utils/globalErrorHandler';
import { findOneUser } from './user.services';
import { Owner, OwnerModel } from '../models/owner.model';

export const handleOwnerCreation = async (
  owner: Partial<Owner> & Document,
  session?: ClientSession
): Promise<Owner> => {
  const { name, bio } = owner;
  if (!name) throw new RequestError('Invalid fields. name', 400);

  const existingOwner = await findOneOwner({
    name,
  });

  if (existingOwner) {
    throw new RequestError('This owner exist', 400);
  }

  const newOwner = await createNewOwner(name, bio, session);

  return newOwner;
};

export const handleOwnerUpdate = async (
  owner: Partial<Owner> & Document,
  session?: ClientSession
): Promise<Owner> => {
  const { id } = owner;

  if (!id) throw new RequestError('Invalid fields. Onwer', 400);
  if (!owner) throw new RequestError('Invalid fields. Onwer', 400);

  const updatedOwner = await findByIdAndUpdateOwnerDocument(
    id,
    { ...owner },
    { returnNewDocument: true }
  );

  if (updatedOwner) {
    return updatedOwner;
  } else {
    throw new RequestError(`${id} Onwer update failed`, 500);
  }
};

export async function findOneOwner(
  filter?: FilterQuery<Owner>,
  projection?: ProjectionType<Owner>,
  options?: QueryOptions<Owner>
): Promise<Owner | null> {
  return await OwnerModel.findOne(filter, projection, options);
}

export const createNewOwner = async (
  name: string,
  bio: string | undefined,
  session?: ClientSession
): Promise<Owner> => {
  const newOwner = new OwnerModel({
    name,
    bio,
  });

  await newOwner.save({ session });
  return newOwner;
};

export const deleteDocument = async (
  ownerId: string,
  session?: ClientSession
): Promise<any> => {
  if (!ownerId) throw new RequestError('Owner Id must not be empty', 400);

  const existingOwner = await findOneOwner({
    id: ownerId,
  });

  if (existingOwner) {
    try {
      const deletedOwner = await deleteOwner(ownerId);
      return deletedOwner;
    } catch (e: any) {
      throw new RequestError(`${e.errmsg}`, 500);
    }
  } else {
    throw new RequestError(`There is no ${ownerId} Owner.`, 500);
  }
};

export const getOnwersByToken = async (
  userId?: string,
  session?: ClientSession
): Promise<Owner[] | null> => {
  if (!userId) throw new RequestError('User Id must not be empty', 400);

  const existingUser = await findOneUser({
    id: userId,
  });

  if (existingUser) {
    if (existingUser.role === 'ADMIN') {
      const owners = await OwnerModel.find();
      return owners;
    } else {
      throw new RequestError(`You can't see Owner List`, 500);
    }
  } else {
    throw new RequestError(`Faild get Onwer created by ${userId} user`, 500);
  }
};

export const findByIdAndUpdateOwnerDocument = async (
  id: string,
  update: UpdateQuery<Owner>,
  options?: QueryOptions<Owner>
) => {
  return await OwnerModel.findOneAndUpdate({ id }, update, {
    ...options,
    returnDocument: 'after',
  });
};

export const deleteOwner = async (
  ownerId: string,
  options?: QueryOptions<Owner>
) => {
  return await OwnerModel.deleteOne({ id: ownerId });
};
