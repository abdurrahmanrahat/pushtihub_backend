import { Schema, model } from 'mongoose';
import {
  TPrimaryVariant,
  TPrimaryVariantItem,
  TProduct,
  TSecondaryVariants,
} from './product.interface';

/* ---------------------------------------------------------
   PRIMARY VARIANT ITEM SCHEMA
--------------------------------------------------------- */
const primaryVariantItemSchema = new Schema<TPrimaryVariantItem>(
  {
    value: { type: String, required: true, trim: true },
    price: { type: Number, required: true },
    sellingPrice: { type: Number, required: true },
    stock: { type: Number, required: true },
  },
  { _id: false },
);

/* ---------------------------------------------------------
   PRIMARY VARIANT SCHEMA
--------------------------------------------------------- */
const primaryVariantSchema = new Schema<TPrimaryVariant>(
  {
    type: {
      type: String,
      enum: ['size', 'color', 'weight'],
      required: true,
    },

    items: {
      type: [primaryVariantItemSchema],
      required: true,
      validate: {
        validator: (items: TPrimaryVariantItem[]) => items.length > 0,
        message: 'Primary variant must contain at least one option.',
      },
    },
  },
  { _id: false },
);

/* ---------------------------------------------------------
   SECONDARY VARIANTS SCHEMA (OPTIONAL)
--------------------------------------------------------- */
const secondaryVariantSchema = new Schema<TSecondaryVariants>(
  {
    size: { type: [String], required: false },
    color: { type: [String], required: false },
    weight: { type: [String], required: false },
  },
  { _id: false },
);

/* ---------------------------------------------------------
   PRODUCT SCHEMA
--------------------------------------------------------- */
const productSchema = new Schema<TProduct>(
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
      required: true,
    },

    category: {
      type: String,
      required: [true, 'Product category is required'],
      trim: true,
    },

    tags: {
      type: [String],
      required: true,
    },

    /* -----------------------------------
       FINAL VARIANT MODEL (PRIMARY + SECONDARY)
    ----------------------------------- */
    variants: {
      primary: {
        type: primaryVariantSchema,
        required: true,
      },

      secondary: {
        type: secondaryVariantSchema,
        required: false, // IMPORTANT: no default
      },
    },

    /* -----------------------------------
       Analytics fields
    ----------------------------------- */
    totalReviews: { type: Number, default: 0 },
    averageRatings: { type: Number, default: 0 },
    salesCount: { type: Number, default: 0 },

    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const Product = model<TProduct>('Product', productSchema);
