import { Document, model, Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export interface TwitterAccount extends Document {
  id: string;
  username: string;
  password?: string;
  totp_secret?: string;
  additional_data?: string;
  auth_token?: string;
  proxy?: string;
  twitter_blue?: string;
  owner?: string;
  strategy?: string;
  timezone?: string;
  start_date?: string;
  personality_prompt?: string;
  twitter_name?: string;
  profile_pic?: string[];
  banner_pic?: string[];
  sban: string;
  gban: string;
  trban: string;
  added_time?: string;
  bio?: string;
  createdAt: Date;
  updateAt: Date;
}

const TwitterAccountSchema = new Schema<TwitterAccount>(
  {
    id: {
      type: String,
      default: uuidv4,
      required: true,
      unique: true,
    },
    username: { type: String },
    auth_token: { type: String },
    twitter_blue: { type: String },
    owner: { type: String },
    proxy: { type: String },
    sban: { type: String },
    gban: { type: String },
    trban: { type: String },
    twitter_name: { type: String },
    profile_pic: { type: [String] },
    banner_pic: { type: [String] },
    personality_prompt: { type: String },
    strategy: { type: String },
    added_time: { type: String },
    timezone: { type: String },
    start_date: { type: String },
    additional_data: { type: String },
    password: { type: String },
    totp_secret: { type: String },
    bio: { type: String },
  },
  {
    timestamps: true,
  }
);

export const TwitterAccountModel = model<TwitterAccount>(
  'TwitterAccount',
  TwitterAccountSchema
);
