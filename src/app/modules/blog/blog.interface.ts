import { Types } from 'mongoose';

export type TBlog = {
  title: string;
  slug: string;
  image: string;
  description: string;
  tags: string[];
  authorDetails: Types.ObjectId;
  isDeleted?: boolean;
};
