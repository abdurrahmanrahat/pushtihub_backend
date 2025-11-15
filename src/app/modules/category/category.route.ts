import express from 'express';
import { auth } from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { USER_ROLE } from '../user/user.constant';
import { CategoryControllers } from './category.controller';
import { CategoryValidations } from './category.validations';

const router = express.Router();

// create category
router.post(
  '/create-category',
  auth(USER_ROLE.admin),
  validateRequest(CategoryValidations.createCategoryValidationSchema),
  CategoryControllers.createCategory,
);

// get all categories
router.get('/', CategoryControllers.getAllCategories);

// update category
router.patch(
  '/:categoryId',
  auth(USER_ROLE.admin),
  validateRequest(CategoryValidations.updateCategoryValidationSchema),
  CategoryControllers.updateCategory,
);

// delete category
router.delete(
  '/:categoryId',
  auth(USER_ROLE.admin),
  CategoryControllers.deleteCategory,
);

export const CategoryRoutes = router;
