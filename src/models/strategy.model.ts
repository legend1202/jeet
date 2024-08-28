import { Document, model, Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export type TEngagement = {
  model_username: string;
  model_option: string;
};
const EngagementSchema = new Schema<TEngagement>({
  model_username: { type: String, required: true },
  model_option: { type: String, required: true },
});

export interface Strategy extends Document {
  id: string;
  name: string;
  tweet_status: string;
  tweet_max_day: string;
  tweet_initial_day: string;
  tweet_days2max: string;
  tweet_growth: string;
  tweet_fluctuation: string;
  tweet_date: string;
  follow_status: string;
  follow_max_day: string;
  follow_initial_day: string;
  follow_days2max: string;
  follow_growth: string;
  follow_fluctuation: string;
  follow_limit: string;
  follow_date: string;
  likes_status: string;
  likes_max_day: string;
  likes_initial_day: string;
  likes_days2max: string;
  likes_growth: string;
  likes_fluctuation: string;
  likes_date: string;
  bookmark_status: string;
  bookmark_max_day: string;
  bookmark_initial_day: string;
  bookmark_days2max: string;
  bookmark_growth: string;
  bookmark_fluctuation: string;
  bookmark_date: string;
  quote_status: string;
  quote_max_day: string;
  quote_initial_day: string;
  quote_days2max: string;
  quote_growth: string;
  quote_fluctuation: string;
  quote_date: string;
  comment_status: string;
  comment_max_day: string;
  comment_initial_day: string;
  comment_days2max: string;
  comment_growth: string;
  comment_fluctuation: string;
  comment_date: string;
  engagements: TEngagement[]; // Add TEngagement array
  bio: string;
  createdAt: Date;
  updateAt: Date;
}

const StrategySchema = new Schema<Strategy>(
  {
    id: {
      type: String,
      default: uuidv4,
      required: true,
      unique: true,
    },
    name: { type: String },
    tweet_status: { type: String },
    tweet_max_day: { type: String },
    tweet_initial_day: { type: String },
    tweet_days2max: { type: String },
    tweet_growth: { type: String },
    tweet_fluctuation: { type: String },
    tweet_date: { type: String },
    follow_status: { type: String },
    follow_max_day: { type: String },
    follow_initial_day: { type: String },
    follow_days2max: { type: String },
    follow_growth: { type: String },
    follow_fluctuation: { type: String },
    follow_limit: { type: String },
    follow_date: { type: String },
    likes_status: { type: String },
    likes_max_day: { type: String },
    likes_initial_day: { type: String },
    likes_days2max: { type: String },
    likes_growth: { type: String },
    likes_fluctuation: { type: String },
    likes_date: { type: String },
    bookmark_status: { type: String },
    bookmark_max_day: { type: String },
    bookmark_initial_day: { type: String },
    bookmark_days2max: { type: String },
    bookmark_growth: { type: String },
    bookmark_fluctuation: { type: String },
    bookmark_date: { type: String },
    quote_status: { type: String },
    quote_max_day: { type: String },
    quote_initial_day: { type: String },
    quote_days2max: { type: String },
    quote_growth: { type: String },
    quote_fluctuation: { type: String },
    quote_date: { type: String },
    comment_status: { type: String },
    comment_max_day: { type: String },
    comment_initial_day: { type: String },
    comment_days2max: { type: String },
    comment_growth: { type: String },
    comment_fluctuation: { type: String },
    comment_date: { type: String },
    engagements: { type: [EngagementSchema] }, // Add the engagements field
    bio: { type: String },
  },
  {
    timestamps: true,
  }
);

export const StrategyModel = model<Strategy>('Strategy', StrategySchema);
