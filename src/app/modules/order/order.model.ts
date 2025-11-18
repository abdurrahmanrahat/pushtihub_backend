import { Schema, model } from 'mongoose';
import { ORDER_STATUS } from './order.constants';
import { TOrder } from './order.interface';

const selectedVariantSchema = new Schema(
  {
    type: {
      type: String,
      enum: ['size', 'color', 'weight'],
      required: true,
    },
    item: {
      value: { type: String, required: true },
      price: { type: Number, required: false }, // optional (secondary variants)
      sellingPrice: { type: Number, required: false }, // optional
      stock: { type: Number, required: false }, // optional
    },
  },
  { _id: false },
);

const orderItemSchema = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    selectedVariants: {
      type: [selectedVariantSchema],
      required: true,
    },

    unitSellingPrice: { type: Number },
    unitPrice: { type: Number },
    lineTotal: { type: Number, required: true },
  },
  { _id: false },
);

const paymentDetailsSchema = new Schema(
  {
    method: { type: String, required: true }, // "bkash" | "nagad"
    phone: { type: String, required: true },
    transactionId: { type: String, required: true },
  },
  { _id: false },
);

const customerInfoSchema = new Schema(
  {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    fullAddress: { type: String, required: true },
    country: { type: String, required: true },
    orderNotes: { type: String },
  },
  { _id: false },
);

const orderSchema = new Schema<TOrder>(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
    },

    customerInfo: {
      type: customerInfoSchema,
      required: true,
    },

    shippingOption: {
      type: String,
      enum: ['dhaka', 'outside'],
      required: true,
    },

    shippingCost: {
      type: Number,
      required: true,
    },

    orderItems: {
      type: [orderItemSchema],
      required: true,
    },

    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },

    total: {
      type: Number,
      required: true,
      min: 0,
    },

    paymentDetails: {
      type: paymentDetailsSchema,
      required: true,
    },

    status: {
      type: String,
      enum: Object.values(ORDER_STATUS),
      default: ORDER_STATUS.pending,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export const Order = model<TOrder>('Order', orderSchema);
