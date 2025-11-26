import express from 'express';
import { auth } from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { USER_ROLE } from '../user/user.constant';
import { BlogControllers } from './blog.controller';
import { BlogValidations } from './blog.validation';

const router = express.Router();

// Route to create a blog
router.post(
  '/create-blog',
  auth(USER_ROLE.admin),
  validateRequest(BlogValidations.createBlogValidationSchema),
  BlogControllers.createBlog,
);

// Route to get all blogs
router.get('/', BlogControllers.getAllBlogs);

// Route to get single blog
router.get('/:blogSlug', BlogControllers.getSingleBlog);

// Route to update a specific blog by ID
router.patch(
  '/:blogSlug',
  auth(USER_ROLE.admin),
  validateRequest(BlogValidations.updateBlogValidationSchema),
  BlogControllers.updateBlog,
);

// Route to delete a specific blog by ID
router.delete('/:blogId', auth(USER_ROLE.admin), BlogControllers.deleteBlog);

export const BlogRoutes = router;
