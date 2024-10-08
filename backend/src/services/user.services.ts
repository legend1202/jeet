import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {
  Document,
  ClientSession,
  FilterQuery,
  ProjectionType,
  QueryOptions,
  UpdateQuery,
} from 'mongoose';
import { RequestError, AuthenticationError } from '../utils/globalErrorHandler';
import { User, UserModel } from '../models/user.model';
import { Roles } from '../utils/constants';

export const handleUserCreation = async (
  user: Partial<User> & Document,
  session?: ClientSession
): Promise<User> => {
  const { email, password, firstName, lastName } = user;

  if (!firstName) throw new RequestError('First Name must not be empty', 400);
  if (!lastName) throw new RequestError('Last Name must not be empty', 400);
  if (!email) throw new RequestError('Invalid fields', 400);
  if (!password) throw new RequestError('Password must not be empty', 400);

  const existingUser = await findOneUser({ email });

  if (existingUser) {
    throw new RequestError(
      `Can't register this user. this email used by someone.`,
      500
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await createNewUser(
    email,
    hashedPassword,
    firstName,
    lastName,
    session
  );

  return newUser;
};

export const handleUserLogin = async (
  user: Partial<User> & Document,
  session?: ClientSession
): Promise<any> => {
  const { email, password } = user;

  if (!email) throw new RequestError('Invalid fields', 400);
  if (!password) throw new RequestError('Password must not be empty', 400);

  const existingUser = await findOneUser({ email }, { _id: 0, __v: 0 });
  if (existingUser) {
    const passwordMatch = await bcrypt.compare(password, existingUser.password);
    if (!passwordMatch) {
      throw new AuthenticationError(`Password didn't match.`);
    }

    if (existingUser?.role && Roles.includes(existingUser?.role)) {
      const secretKey: string = process.env.JWT_SECRET_KEY || '';
      const token = jwt.sign(
        {
          userId: existingUser.id,
          firstName: existingUser.firstName,
          lastName: existingUser.lastName,
          role: existingUser.role,
          email: existingUser.email,
          avatar: existingUser.avatar,
        },
        secretKey,
        {
          expiresIn: '6d',
        }
      );
      return {
        token,
        userId: existingUser.id,
        email: existingUser.email,
        firstName: existingUser.firstName,
        lastName: existingUser.lastName,
        role: existingUser.role,
        avatar: existingUser.avatar,
      };
    } else {
      throw new AuthenticationError(`You didn't approved by admin.`);
    }
  } else {
    throw new AuthenticationError(`Authentication error.`);
  }
};

export const handleGetUsers = async (
  session?: ClientSession
): Promise<User[]> => {
  const users = await UserModel.find(
    {
      role: { $in: ['COMPANY', 'FELLESRAAD', 'CLIENT'] },
    },
    { _id: 0, __v: 0, password: 0 }
  );

  return users;
};

export const handleAssignRole = async (
  user: Partial<User> & Document,
  session?: ClientSession
): Promise<User> => {
  const { id, role } = user;

  if (!id) throw new RequestError('User Id must not be empty', 400);
  if (!role) throw new RequestError('Role must not be empty', 400);
  if (!Roles.includes(role)) {
    throw new RequestError(
      `User Role must be include one of "ADMIN", "FELLESRAAD", "COMPANY", "CLIENT".`,
      400
    );
  }

  const updatedUser = await findByIdAndUpdateUserDocument(id, {
    role: role,
  });

  if (updatedUser) {
    return updatedUser;
  } else {
    throw new RequestError(`There is not ${id} user.`, 500);
  }
};

export async function findOneUser(
  filter?: FilterQuery<User>,
  projection?: ProjectionType<User>,
  options?: QueryOptions<User>
): Promise<User | null> {
  return await UserModel.findOne(filter, projection, options);
}

export const createNewUser = async (
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  session?: ClientSession
): Promise<User> => {
  const newUser = new UserModel({
    email,
    password,
    firstName,
    lastName,
    role: 'ADMIN',
  });

  await newUser.save({ session });
  return newUser;
};

export const findByIdAndUpdateUserDocument = async (
  id: string,
  update: UpdateQuery<User>,
  options?: QueryOptions<User>
) => {
  return await UserModel.findOneAndUpdate({ id }, update, {
    ...options,
    returnDocument: 'after',
  });
};

export const handleUpdatePassword = async (
  userId: string,
  user: Partial<User> & Document,
  session?: ClientSession
): Promise<User> => {
  const { email, password } = user;

  if (!email) throw new RequestError('User Id must not be empty', 400);
  if (!password) throw new RequestError('Role must not be empty', 400);

  const hashedPassword = await bcrypt.hash(password, 10);

  // Update the user in the database
  const updatedUser = await UserModel.findOneAndUpdate(
    { id: userId }, // You can also use other unique identifiers like email
    {
      email: email,
      password: hashedPassword,
    } as UpdateQuery<Document<User>>,
    { new: true, runValidators: true }
  );

  if (updatedUser) {
    return updatedUser;
  } else {
    throw new RequestError(`There is not ${userId} user.`, 500);
  }
};
