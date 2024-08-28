export type IUploadUrlType = string[];

export type IImageType = File[];

export interface ITwitterAccount {
  id: string;
  username: string;
  auth_token?: string;
  twitter_blue?: number;
  owner?: string;
  sban?: string;
  gban?: string;
  trban?: string;
  twitter_name?: string;
  profile_pic?: string[];
  banner_pic?: string[];
  personality_prompt?: string;
  strategy?: string;
  added_time?: string;
  timezone?: string;
  start_date?: string;
  additional_data?: string;
  password?: string;
  totp_secret?: string;
  bio?: string;
  createdAt: Date;
  updateAt: Date;
}

export interface ITTwitterAccount {
  id?: string;
  sban?: string;
  gban?: string;
  trban?: string;
  added_time?: string;
  createdAt?: Date;
  updateAt?: Date;
  username?: string;
  auth_token?: string;
  twitter_blue?: string;
  owner?: string;
  proxy?: string;
  twitter_name?: string;
  profile_pic?: string[];
  banner_pic?: string[];
  personality_prompt?: string;
  strategy?: string;
  timezone?: string;
  start_date?: string;
  additional_data?: string;
  password?: string;
  totp_secret?: string;
  bio?: string;
}
