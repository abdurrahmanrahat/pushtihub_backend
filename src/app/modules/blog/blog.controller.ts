import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { BlogServices } from './blog.service';

const createBlog = catchAsync(async (req: Request, res: Response) => {
  const blogInfo = req.body;

  // Call the service function to create the blog in the DB
  const result = await BlogServices.createBlogIntoDb(blogInfo);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Blog created successfully',
    data: result,
  });
});

const getAllBlogs = catchAsync(async (req: Request, res: Response) => {
  // Fetch all blogs from the database, passing any query params (e.g., pagination, search)
  const result = await BlogServices.getBlogsFromDb(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All blogs retrieved successfully',
    data: result,
  });
});

const getSingleBlog = catchAsync(async (req: Request, res: Response) => {
  const { blogId } = req.params;

  const result = await BlogServices.getSingleBlogFromDb(blogId);

  if (result) {
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Single blog retrieved successfully',
      data: result,
    });
  } else {
    sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: 'Single blog Not found!',
      data: result,
    });
  }
});

const updateBlog = catchAsync(async (req: Request, res: Response) => {
  const { blogId } = req.params; // Extract the blogId from the request params

  // Call the service to update the blog by its ID
  const result = await BlogServices.updateBlogIntoDb(blogId, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Blog updated successfully',
    data: result,
  });
});

const deleteBlog = catchAsync(async (req: Request, res: Response) => {
  const { blogId } = req.params; // Extract the blogId from the request params

  // Call the service to delete the blog by its ID
  const result = await BlogServices.deleteBlogIntoDb(blogId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Blog deleted successfully',
    data: result,
  });
});

export const BlogControllers = {
  createBlog,
  getAllBlogs,
  getSingleBlog,
  updateBlog,
  deleteBlog,
};
