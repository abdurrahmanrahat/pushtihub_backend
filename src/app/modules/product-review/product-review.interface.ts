import { Types } from 'mongoose';

export type TProductReview = {
  user: Types.ObjectId;
  product: Types.ObjectId;
  productSlug: string;
  images?: string[];
  rating: number;
  review: string;
  isVerified?: boolean;
  isDeleted?: boolean;
};

// make routes in product route like: /products/:productId/create-review , then comes rest in same
