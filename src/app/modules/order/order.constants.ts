export const ORDER_STATUS = {
  pending: 'pending',
  processing: 'processing',
  shipped: 'shipped',
  delivered: 'delivered',
  cancelled: 'cancelled',
} as const;

// for zod
export const ORDER_STATUS_VALUES = [
  'pending',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
] as const;

export const orderSearchableFields = ['orderNumber', 'fullName', 'phone'];
