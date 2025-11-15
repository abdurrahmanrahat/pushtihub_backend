import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { ProductReviewServices } from './product-review.service';

const createReview = catchAsync(async (req: Request, res: Response) => {
  const result = await ProductReviewServices.createReviewIntoDB(
    req.params.productId,
    req.body,
  );

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Review gives successfully',
    data: result,
  });
});

const getAllReviewsByProduct = catchAsync(
  async (req: Request, res: Response) => {
    const result = await ProductReviewServices.getReviewsByProductFromDB(
      req.params.productId,
      req.query,
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'All reviews retrieved successfully',
      data: result,
    });
  },
);
const getAllReviewsStatsByProduct = catchAsync(
  async (req: Request, res: Response) => {
    const distribution =
      await ProductReviewServices.getReviewsStatsByProductFromDB(
        req.params.productId,
      );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Reviews stats retrieve successfully',
      data: distribution,
    });
  },
);

const getAllReviews = catchAsync(async (req: Request, res: Response) => {
  const result = await ProductReviewServices.getAllReviewsFromDB(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All reviews retrieved successfully',
    data: result,
  });
});

const getSingleReview = catchAsync(async (req: Request, res: Response) => {
  const result = await ProductReviewServices.getReviewByIdFromDB(
    req.params.productId,
    req.params.reviewId,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Review retrieves successfully',
    data: result,
  });
});

// const updateReview = catchAsync(async (req: Request, res: Response) => {
//   const result = await ProductReviewServices.updateReviewIntoDB(
//     req.params.productId,
//     req.params.reviewId,
//     req.body,
//   );

//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: 'Review updated successfully',
//     data: result,
//   });
// });

const deleteReview = catchAsync(async (req: Request, res: Response) => {
  const result = await ProductReviewServices.deleteReviewFromDB(
    req.params.productId,
    req.params.reviewId,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Review deleted successfully',
    data: result,
  });
});

const approvedReview = catchAsync(async (req: Request, res: Response) => {
  const result = await ProductReviewServices.approveReviewIntoDB(
    req.params.productId,
    req.params.reviewId,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Review approved successfully',
    data: result,
  });
});

export const ProductReviewControllers = {
  createReview,
  getAllReviewsByProduct,
  getAllReviewsStatsByProduct,
  getAllReviews,
  getSingleReview,
  deleteReview,
  approvedReview,
};
