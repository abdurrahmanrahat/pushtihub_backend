import { z } from 'zod';

export const createProductValidationSchema = z.object({
  body: z.object({
    name: z
      .string({
        required_error: 'Product name is required',
        invalid_type_error: 'Product name must be a string',
      })
      .trim()
      .min(1, 'Product name is required'),

    slug: z
      .string({
        required_error: 'Product slug is required',
        invalid_type_error: 'Product slug must be a string',
      })
      .trim()
      .min(1, 'Product slug is required'),

    description: z
      .string({
        required_error: 'Product description is required',
        invalid_type_error: 'Product description must be a string',
      })
      .min(1, 'Product description is required'),

    images: z
      .array(
        z.string({
          required_error: 'Each image URL must be a string',
          invalid_type_error: 'Invalid image URL type',
        }),
      )
      .min(1, 'At least one product image is required')
      .max(5, 'Maximum 5 product images allow!'),

    category: z
      .string({
        required_error: 'Category is required',
        invalid_type_error: 'Category must be a string',
      })
      .min(1, 'Product category is required'),

    price: z
      .number({
        required_error: 'Product price is required',
        invalid_type_error: 'Product price must be a number',
      })
      .min(0, 'Product price must be 0 or more'),

    sellingPrice: z
      .number({
        required_error: 'Product selling price is required',
        invalid_type_error: 'Product selling price must be a number',
      })
      .min(0, 'Product selling price must be 0 or more'),

    stock: z
      .number({
        required_error: 'Stock quantity is required',
        invalid_type_error: 'Stock quantity must be a number',
      })
      .min(0, 'Stock must be 0 or more'),

    tags: z
      .array(
        z.string({
          required_error: 'Each tag must be a string',
          invalid_type_error: 'Invalid tag type',
        }),
      )
      .min(1, 'At least one tag is required'),
  }),
});

export const updateProductValidationSchema = z.object({
  body: z.object({
    name: z
      .string({
        invalid_type_error: 'Product name must be a string',
      })
      .trim()
      .min(1, 'Product name cannot be empty')
      .optional(),

    slug: z
      .string({
        invalid_type_error: 'Product slug must be a string',
      })
      .trim()
      .min(1, 'Product slug cannot be empty')
      .optional(),

    description: z
      .string({
        invalid_type_error: 'Product description must be a string',
      })
      .min(1, 'Product description cannot be empty')
      .optional(),

    images: z
      .array(
        z.string({
          invalid_type_error: 'Each image URL must be a string',
        }),
      )
      .min(1, 'At least one product image is required')
      .optional(),

    category: z
      .string({
        invalid_type_error: 'Category must be a string',
      })
      .min(1, 'Product category is required')
      .optional(),

    price: z
      .number({
        invalid_type_error: 'Product price must be a number',
      })
      .min(0, 'Product price must be 0 or more')
      .optional(),

    sellingPrice: z
      .number({
        invalid_type_error: 'Product selling price must be a number',
      })
      .min(0, 'Product selling price must be 0 or more')
      .optional(),

    stock: z
      .number({
        invalid_type_error: 'Stock must be a number',
      })
      .min(0, 'Stock must be 0 or more')
      .optional(),

    tags: z
      .array(
        z.string({
          invalid_type_error: 'Each tag must be a string',
        }),
      )
      .min(1, 'At least one tag is required')
      .optional(),

    isDeleted: z
      .boolean({
        invalid_type_error: 'isDeleted must be a boolean value',
      })
      .optional(),
  }),
});

export const ProductValidations = {
  createProductValidationSchema,
  updateProductValidationSchema,
};
