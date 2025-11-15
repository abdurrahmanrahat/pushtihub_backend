import { model, Schema } from 'mongoose';
import { TCategory } from './category.interface';

const categorySchema: Schema<TCategory> = new Schema<TCategory>(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Category slug is required'],
      unique: true,
    },
    image: {
      type: String,
      required: false,
    },
    subCategoryOf: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
    },
  },
  {
    timestamps: true,
  },
);

export const Category = model<TCategory>('Category', categorySchema);
