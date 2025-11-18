import { Types } from 'mongoose';
import { ORDER_STATUS } from './order.constants';

export type TOrder = {
  orderNumber?: string; // generated in backend
  customerInfo: {
    fullName: string;
    phone: string;
    fullAddress: string;
    country: string;
    orderNotes?: string;
  };

  shippingOption: 'dhaka' | 'outside';
  shippingCost: number;

  orderItems: TOrderItem[];

  subtotal: number;
  total: number;

  paymentDetails: {
    method: 'bkash' | 'nagad'; // extend later if needed
    phone: string;
    transactionId: string;
  };

  status?: keyof typeof ORDER_STATUS;
  isDeleted?: boolean;
};

export type TOrderItem = {
  product: Types.ObjectId;

  quantity: number;

  selectedVariants: {
    type: 'size' | 'color' | 'weight';
    item: {
      value: string;
      price?: number; // optional
      sellingPrice?: number; // optional
      stock?: number; // optional
    };
  }[];

  unitSellingPrice: number;
  unitPrice: number;
  lineTotal: number;
};

// after creating order, then update each product stock
