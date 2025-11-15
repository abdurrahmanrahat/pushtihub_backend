import { z } from 'zod';

const createProductReviewValidationSchema = z.object({
  body: z.object({
    user: z.string({ required_error: 'User is required' }),
    product: z.string({ required_error: 'Product is required' }),
    productSlug: z.string({ required_error: 'product slug is required' }),
    images: z
      .array(
        z.string({
          required_error: 'Each image URL must be a string',
          invalid_type_error: 'Invalid image URL type',
        }),
      )
      .optional(),
    rating: z
      .number({ required_error: 'Rating is required' })
      .min(1, 'Rating must be at least 1')
      .max(5, 'Rating must be at most 5'),
    review: z.string().min(1, 'Review is required'),
  }),
});

// const updateProductReviewValidationSchema = z.object({
//   body: z.object({
//     rating: z.number().min(1).max(5).optional(),
//     review: z.string().optional(),
//   }),
// });

export const ProductReviewValidations = {
  createProductReviewValidationSchema,
};
