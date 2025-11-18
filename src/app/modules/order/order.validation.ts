import { z } from 'zod';
import { ORDER_STATUS_VALUES } from './order.constants';

//
// Selected Variant Schema
//
const selectedVariantSchema = z.object({
  type: z.enum(['size', 'color', 'weight']),
  item: z.object({
    value: z.string(),
    price: z.number().optional(), // optional for secondary variants
    sellingPrice: z.number().optional(),
    stock: z.number().optional(),
  }),
});

//
// Order Item Schema
//
const orderItemSchema = z.object({
  product: z.string({ required_error: 'Product ID is required' }),

  quantity: z
    .number({ required_error: 'Quantity is required' })
    .min(1, 'Quantity must be at least 1'),

  selectedVariants: z
    .array(selectedVariantSchema)
    .min(1, 'At least one variant must be selected'),

  unitSellingPrice: z.number(),
  unitPrice: z.number(),
  lineTotal: z
    .number({ required_error: 'Line total is required' })
    .min(0, 'Line total cannot be negative'),
});

//
// Payment Details Schema
//
const paymentDetailsSchema = z.object({
  method: z.enum(['bkash', 'nagad'], {
    required_error: 'Payment method is required',
  }),

  phone: z
    .string({ required_error: 'Payment phone number is required' })
    .min(6, 'Invalid phone number'),

  transactionId: z
    .string({ required_error: 'Transaction ID is required' })
    .min(3, 'Transaction ID must be valid'),
});

//
// Customer Info Schema
//
const customerInfoSchema = z.object({
  fullName: z
    .string({ required_error: 'Full name is required' })
    .min(1, 'Full name cannot be empty'),

  phone: z
    .string({ required_error: 'Phone number is required' })
    .min(6, 'Phone number must be valid'),

  fullAddress: z
    .string({ required_error: 'Full address is required' })
    .min(1, 'Full address cannot be empty'),

  country: z
    .string({ required_error: 'Country is required' })
    .min(1, 'Country cannot be empty'),

  orderNotes: z.string().optional(),
});

//
// CREATE ORDER SCHEMA
//
const createOrderValidationSchema = z.object({
  body: z.object({
    customerInfo: customerInfoSchema,

    shippingOption: z.enum(['dhaka', 'outside'], {
      required_error: 'Shipping option is required',
    }),

    shippingCost: z
      .number({ required_error: 'Shipping cost is required' })
      .min(0, 'Shipping cost cannot be negative'),

    orderItems: z
      .array(orderItemSchema)
      .min(1, 'At least one order item is required'),

    subtotal: z
      .number({ required_error: 'Subtotal is required' })
      .min(0, 'Subtotal cannot be negative'),

    total: z
      .number({ required_error: 'Total is required' })
      .min(0, 'Total cannot be negative'),

    paymentDetails: paymentDetailsSchema,
  }),
});

//
// UPDATE ORDER SCHEMA
//
const updateOrderValidationSchema = z.object({
  body: z.object({
    customerInfo: customerInfoSchema.optional(),
    shippingOption: z.enum(['dhaka', 'outside']).optional(),
    shippingCost: z.number().min(0).optional(),
    subtotal: z.number().min(0).optional(),
    total: z.number().min(0).optional(),

    paymentDetails: paymentDetailsSchema.optional(),

    status: z.enum(ORDER_STATUS_VALUES).optional(),
    isDeleted: z.boolean().optional(),
  }),
});

export const OrderValidations = {
  createOrderValidationSchema,
  updateOrderValidationSchema,
};
