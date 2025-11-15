import { model, Schema } from 'mongoose';
import { TProduct } from './product.interface';

const productSchema: Schema<TProduct> = new Schema<TProduct>(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Product slug is required'],
      unique: true,
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
    },
    images: {
      type: [String],
      required: [true, 'Product images are required'],
      default: [],
    },
    category: {
      type: String,
      required: [true, 'Product category is required'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      trim: true,
    },
    sellingPrice: {
      type: Number,
      required: [true, 'Product selling price is required'],
      trim: true,
    },
    stock: {
      type: Number,
      required: [true, 'Product stock quantity is required'],
      trim: true,
    },
    tags: {
      type: [String],
      required: [true, 'Product tags are required'],
      default: [],
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
    averageRatings: {
      type: Number,
      default: 0,
    },
    salesCount: {
      type: Number,
      default: 0,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

export const Product = model<TProduct>('Product', productSchema);
