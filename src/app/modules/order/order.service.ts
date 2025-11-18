/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { Product } from '../product/product.model';
import { orderSearchableFields } from './order.constants';
import { TOrder } from './order.interface';
import { Order } from './order.model';

// -------------------------------------------
// CREATE ORDER
// -------------------------------------------
const createOrderIntoDB = async (payload: TOrder) => {
  const session = await Order.startSession();

  try {
    session.startTransaction();

    // -------------------------------
    // Generate Order Number (Monthly)
    // -------------------------------
    const now = new Date();
    const yearMonth = `${now.getFullYear()}${(now.getMonth() + 1)
      .toString()
      .padStart(2, '0')}`;

    const lastOrder = await Order.findOne({
      isDeleted: false,
      orderNumber: new RegExp(`ORD-${yearMonth}-`),
    })
      .sort({ createdAt: -1 })
      .session(session);

    let sequence = 1;

    if (lastOrder?.orderNumber) {
      const lastSeq = parseInt(lastOrder.orderNumber.slice(-6), 10);
      sequence = lastSeq + 1;
    }

    const orderNumber = `ORD-${yearMonth}-${String(sequence).padStart(6, '0')}`;

    // -----------------------------------
    // STOCK MANAGEMENT PER ORDER ITEM
    // -----------------------------------
    for (const item of payload.orderItems) {
      const updated = await Product.updateOne(
        {
          _id: item.product,
          stock: { $gte: item.quantity },
        },
        {
          $inc: {
            stock: -item.quantity,
            salesCount: item.quantity,
          },
        },
        { session },
      );

      if (updated.modifiedCount === 0) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          `Insufficient stock for product ${item.product}`,
        );
      }
    }

    // -----------------------------------
    // CREATE ORDER
    // -----------------------------------
    const createdOrder = await Order.create([{ ...payload, orderNumber }], {
      session,
    });

    await session.commitTransaction();
    session.endSession();

    return createdOrder[0];
  } catch (err: any) {
    await session.abortTransaction();
    session.endSession();
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      err.message || 'Failed to create order',
    );
  }
};

// -------------------------------------------
// GET ALL ORDERS
// -------------------------------------------
const getOrdersFromDB = async (query: Record<string, unknown>) => {
  const baseQuery = Order.find({ isDeleted: false });

  const queryBuilder = new QueryBuilder(baseQuery, query)
    .search(orderSearchableFields)
    .filter()
    .paginate()
    .sort();

  const orders = await queryBuilder.modelQuery
    .populate('orderItems.product')
    .sort({ createdAt: -1 });

  const totalCount = (
    await new QueryBuilder(Order.find({ isDeleted: false }), query)
      .search(orderSearchableFields)
      .filter().modelQuery
  ).length;

  return { data: orders, totalCount };
};

// -------------------------------------------
// GET SINGLE ORDER
// -------------------------------------------
const getSingleOrderFromDB = async (orderId: string) => {
  const order = await Order.findOne({
    _id: orderId,
    isDeleted: false,
  }).populate('orderItems.product');

  if (!order) {
    throw new AppError(httpStatus.NOT_FOUND, 'Order not found');
  }

  return order;
};

// -------------------------------------------
// UPDATE ORDER (Status, Info)
// If status changed to "cancelled" stock must restore
// -------------------------------------------
const updateOrderIntoDB = async (orderId: string, payload: Partial<TOrder>) => {
  const session = await Order.startSession();

  try {
    session.startTransaction();

    const existingOrder = await Order.findOne({
      _id: orderId,
      isDeleted: false,
    }).session(session);

    if (!existingOrder) {
      throw new AppError(httpStatus.NOT_FOUND, 'Order not found');
    }

    const isCancelling =
      payload.status &&
      payload.status === 'cancelled' &&
      existingOrder.status !== 'cancelled';

    // -----------------------------------
    // Restore stock on cancellation
    // -----------------------------------
    if (isCancelling) {
      for (const item of existingOrder.orderItems) {
        await Product.updateOne(
          { _id: item.product },
          {
            $inc: {
              stock: item.quantity,
              salesCount: -item.quantity,
            },
          },
          { session },
        );
      }
    }

    const updatedOrder = await Order.findByIdAndUpdate(orderId, payload, {
      new: true,
      session,
    });

    await session.commitTransaction();
    session.endSession();

    return updatedOrder;
  } catch (err: any) {
    await session.abortTransaction();
    session.endSession();
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      err.message || 'Failed to update order',
    );
  }
};

// -------------------------------------------
// DELETE ORDER (Soft Delete + Stock Restore)
// -------------------------------------------
const deleteOrderIntoDB = async (orderId: string) => {
  const session = await Order.startSession();

  try {
    session.startTransaction();

    const order = await Order.findOne({
      _id: orderId,
      isDeleted: false,
    }).session(session);

    if (!order) {
      throw new AppError(
        httpStatus.NOT_FOUND,
        'Order not found or already deleted',
      );
    }

    // Restore stock
    for (const item of order.orderItems) {
      await Product.updateOne(
        { _id: item.product },
        {
          $inc: {
            stock: item.quantity,
            salesCount: -item.quantity,
          },
        },
        { session },
      );
    }

    order.isDeleted = true;
    await order.save({ session });

    await session.commitTransaction();
    session.endSession();

    return order;
  } catch (err: any) {
    await session.abortTransaction();
    session.endSession();
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      err.message || 'Failed to delete order',
    );
  }
};

export const OrderServices = {
  createOrderIntoDB,
  getOrdersFromDB,
  getSingleOrderFromDB,
  updateOrderIntoDB,
  deleteOrderIntoDB,
};
