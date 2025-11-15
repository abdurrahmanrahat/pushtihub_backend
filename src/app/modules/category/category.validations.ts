import mongoose from 'mongoose';
import { z } from 'zod';

const createCategoryValidationSchema = z.object({
  body: z.object({
    name: z
      .string({
        required_error: 'Category name is required',
        invalid_type_error: 'Category name must be a string',
      })
      .trim()
      .min(1, 'Category name is required'),
    slug: z
      .string({
        required_error: 'Category slug is required',
        invalid_type_error: 'Category slug must be a string',
      })
      .min(1, 'Category slug is required'),
    image: z
      .string({
        required_error: 'Category image is required',
        invalid_type_error: 'Category image must be a string',
      })
      .min(1, 'Category image is required')
      .optional(),
    subCategoryOf: z
      .string()
      .refine(
        (val) => !val || mongoose.Types.ObjectId.isValid(val),
        'Invalid category reference ID',
      )
      .optional(),
  }),
});

const updateCategoryValidationSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    slug: z.string().optional(),
    image: z.string().optional(),
    subCategoryOf: z
      .string()
      .refine(
        (val) => !val || mongoose.Types.ObjectId.isValid(val),
        'Invalid category reference ID',
      )
      .optional(),
  }),
});

export const CategoryValidations = {
  createCategoryValidationSchema,
  updateCategoryValidationSchema,
};
