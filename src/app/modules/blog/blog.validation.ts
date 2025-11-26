import { z } from 'zod';

const createBlogValidationSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Blog title is required'),
    image: z.string().min(1, { message: 'Blog image is required' }),
    description: z.string().min(1, 'Blog description is required'),
    tags: z.array(z.string()).min(1, 'At least one tag is required'),
    authorDetails: z.string(),
  }),
});

const updateBlogValidationSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Blog title is required').optional(),
    image: z.string().min(1, { message: 'Blog image is required' }).optional(),
    description: z.string().min(1, 'Blog description is required').optional(),
    tags: z.array(z.string()).min(1, 'At least one tag is required').optional(),
  }),
});

export const BlogValidations = {
  createBlogValidationSchema,
  updateBlogValidationSchema,
};
