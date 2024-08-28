import { Document, model, Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export interface Owner extends Document {
  id: string;
  name: string;
  bio: string;
  createdAt: Date;
  updateAt: Date;
}

const OwnerSchema = new Schema<Owner>(
  {
    id: {
      type: String,
      default: uuidv4,
      required: true,
      unique: true,
    },
    name: { type: String },
    bio: { type: String },
  },
  {
    timestamps: true,
  }
);

export const OwnerModel = model<Owner>('Owner', OwnerSchema);
