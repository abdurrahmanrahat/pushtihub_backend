/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { Product } from '../product/product.model';
import { orderSearchableFields } from './order.constants';
import { IOrder } from './order.interface';
import { Order } from './order.model';

const createOrderIntoDB = async (payload: IOrder) => {
  const session = await Order.startSession();

  try {
    session.startTransaction();

    // order number count
    const now = new Date();
    const yearMonth = `${now.getFullYear()}${(now.getMonth() + 1)
      .toString()
      .padStart(2, '0')}`; // e.g., 202508

    // Find the latest order for this month
    const lastOrder = await Order.findOne({
      isDeleted: false,
      orderNumber: new RegExp(`ORD-${yearMonth}-`),
    })
      .sort({ createdAt: -1 })
      .session(session)
      .exec();

    let sequence = 1;

    if (lastOrder && lastOrder.orderNumber) {
      // Extract last 6 digits for the sequence
      const lastSeq = parseInt(lastOrder.orderNumber.slice(-6), 10);
      sequence = lastSeq + 1;
    }

    const orderNumber = `ORD-${yearMonth}-${sequence
      .toString()
      .padStart(6, '0')}`;

    for (const item of payload.orderItems) {
      const updateResult = await Product.updateOne(
        {
          _id: item.product,
          stock: { $gte: item.quantity }, // make sure enough stock remains
        },
        {
          $inc: {
            stock: -item.quantity, // deduct stock
            salesCount: item.quantity, // increase sales count
          },
        },
        { session },
      );

      if (updateResult.modifiedCount === 0) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          `Insufficient stock for product ${item.product}`,
        );
      }
    }

    const createdOrder = await Order.create([{ ...payload, orderNumber }], {
      session,
    });

    await session.commitTransaction();
    session.endSession();

    return createdOrder[0];
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();

    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      error.message || 'Unknown error',
    );
  }
};

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

  const countQuery = new QueryBuilder(Order.find({ isDeleted: false }), query)
    .search(orderSearchableFields) // match search fields
    .filter();

  const totalCount = (await countQuery.modelQuery).length;

  return { data: orders, totalCount };
};

const getSingleOrderFromDB = async (orderId: string) => {
  const order = await Order.findOne({
    _id: orderId,
    isDeleted: false,
  }).populate('orderItems.product');

  if (!order) {
    throw new AppError(httpStatus.NOT_FOUND, 'Order not found.');
  }

  return order;
};

const updateOrderIntoDB = async (orderId: string, payload: Partial<IOrder>) => {
  const updatedOrder = await Order.findByIdAndUpdate(orderId, payload, {
    new: true,
  });

  if (!updatedOrder) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Order not found or already deleted.',
    );
  }

  return updatedOrder;
};

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
        'Order not found or already deleted.',
      );
    }

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
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();

    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      error.message || 'Internal server error!',
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
