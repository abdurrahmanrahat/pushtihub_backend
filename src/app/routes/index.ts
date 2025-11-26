import express from 'express';
import { AuthRoutes } from '../modules/auth/auth.route';
import { BlogRoutes } from '../modules/blog/blog.route';
import { CategoryRoutes } from '../modules/category/category.route';
import { OrderRoutes } from '../modules/order/order.route';
import { ProductRoutes } from '../modules/product/product.route';
import { UserRoutes } from '../modules/user/user.route';

const router = express.Router();

// router.use('/users', UserRoutes);

const moduleRoutes = [
  {
    path: '/users',
    route: UserRoutes,
  },
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/categories',
    route: CategoryRoutes,
  },
  {
    path: '/products',
    route: ProductRoutes,
  },
  {
    path: '/orders',
    route: OrderRoutes,
  },
  {
    path: '/blogs',
    route: BlogRoutes,
  },
];

moduleRoutes.forEach((item) => router.use(item.path, item.route));

export default router;
