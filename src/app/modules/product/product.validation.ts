import { z } from 'zod';

/* -----------------------------------------
   PRIMARY VARIANT ITEM
----------------------------------------- */
const primaryVariantItemSchema = z.object({
  value: z
    .string({
      required_error: 'Variant value is required',
      invalid_type_error: 'Variant value must be a string',
    })
    .trim()
    .min(1, 'Variant value cannot be empty'),

  price: z
    .number({
      required_error: 'Variant price is required',
      invalid_type_error: 'Variant price must be a number',
    })
    .min(1, 'Price must be greater than 0'),

  sellingPrice: z
    .number({
      required_error: 'Variant selling price is required',
      invalid_type_error: 'Variant selling price must be a number',
    })
    .min(1, 'Selling price must be greater than 0'),

  stock: z
    .number({
      required_error: 'Variant stock is required',
      invalid_type_error: 'Variant stock must be a number',
    })
    .min(0, 'Stock cannot be negative'),
});

/* -----------------------------------------
   PRIMARY VARIANT
----------------------------------------- */
const primaryVariantSchema = z.object({
  type: z.enum(['size', 'color', 'weight'], {
    required_error: 'Primary variant type is required',
  }),

  items: z
    .array(primaryVariantItemSchema)
    .min(1, 'At least one primary variant item is required'),
});

/* -----------------------------------------
   SECONDARY VARIANTS
----------------------------------------- */
const secondaryVariantSchema = z.object({
  size: z.array(z.string()).optional(),
  color: z.array(z.string()).optional(),
  weight: z.array(z.string()).optional(),
});

/* -----------------------------------------
   CREATE PRODUCT VALIDATION
----------------------------------------- */
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
        z
          .string({
            invalid_type_error: 'Each image URL must be a string',
          })
          .url('Invalid image URL'),
      )
      .min(1, 'At least one product image is required')
      .max(5, 'Maximum 5 product images allowed'),

    category: z
      .string({
        required_error: 'Category is required',
        invalid_type_error: 'Category must be a string',
      })
      .min(1, 'Product category is required'),

    tags: z
      .array(
        z.string({
          invalid_type_error: 'Each tag must be a string',
        }),
      )
      .min(1, 'At least one tag is required'),

    variants: z.object({
      primary: primaryVariantSchema,
      secondary: secondaryVariantSchema.optional(),
    }),
  }),
});

/* -----------------------------------------
   UPDATE PRODUCT VALIDATION
----------------------------------------- */
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
        z
          .string({
            invalid_type_error: 'Each image URL must be a string',
          })
          .url('Invalid image URL'),
      )
      .min(1, 'At least one product image is required')
      .max(5, 'Maximum 5 product images allowed')
      .optional(),

    category: z
      .string({
        invalid_type_error: 'Category must be a string',
      })
      .min(1, 'Product category cannot be empty')
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

    variants: z
      .object({
        primary: primaryVariantSchema.optional(),
        secondary: secondaryVariantSchema.optional(),
      })
      .optional(),
  }),
});

/* -----------------------------------------
   EXPORT AGGREGATE
----------------------------------------- */
export const ProductValidations = {
  createProductValidationSchema,
  updateProductValidationSchema,
};
