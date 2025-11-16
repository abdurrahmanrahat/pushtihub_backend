import httpStatus from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { CategoryServices } from '../category/category.service';
import { productSearchableFields } from './product.constants';
import { TProduct } from './product.interface';
import { Product } from './product.model';

/* ---------------------------------------------------
   VALIDATE PRIMARY + SECONDARY VARIANTS
--------------------------------------------------- */
const validatePrimaryVariant = (primary: TProduct['variants']['primary']) => {
  if (!primary) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Primary variant configuration is required',
    );
  }

  if (!primary.type) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Primary variant type is required',
    );
  }

  if (!primary.items || primary.items.length === 0) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Primary variant '${primary.type}' must contain at least one item`,
    );
  }

  for (const item of primary.items) {
    if (!item.value || item.value.trim() === '') {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        `Primary variant '${primary.type}' has an item with empty value`,
      );
    }
    if (item.price <= 0) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        `Invalid price for primary variant '${item.value}'`,
      );
    }
    if (item.sellingPrice <= 0) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        `Invalid sellingPrice for primary variant '${item.value}'`,
      );
    }
    if (item.stock < 0) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        `Invalid stock for primary variant '${item.value}'`,
      );
    }
  }
};

/** Validate secondary variants (optional) */
const validateSecondary = (secondary: TProduct['variants']['secondary']) => {
  if (!secondary) return; // secondary is optional

  const keys: Array<keyof typeof secondary> = ['size', 'color', 'weight'];

  for (const key of keys) {
    const arr = secondary[key];
    if (!arr) continue; // skip unselected groups

    if (!Array.isArray(arr)) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        `Secondary variant '${key}' must be an array`,
      );
    }

    // must be non-empty after admin selects it
    if (arr.length === 0) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        `Secondary variant '${key}' list cannot be empty`,
      );
    }

    for (const val of arr) {
      if (!val || val.trim() === '') {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          `Secondary variant '${key}' contains an empty value`,
        );
      }
    }
  }
};

/* ---------------------------------------------------
   SANITIZE VARIANTS BEFORE SAVING
--------------------------------------------------- */
const sanitizeVariants = (
  variants: TProduct['variants'],
): TProduct['variants'] => {
  if (!variants) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Variants are required');
  }

  validatePrimaryVariant(variants.primary);
  validateSecondary(variants.secondary);

  return variants;
};

/* ---------------------------------------------------
   CREATE PRODUCT
--------------------------------------------------- */
const createProductIntoDB = async (payload: TProduct) => {
  payload.variants = sanitizeVariants(payload.variants);

  const result = await Product.create(payload);
  return result;
};

/* ---------------------------------------------------
   GET ALL PRODUCTS
--------------------------------------------------- */
const getProductsFromDB = async (query: Record<string, unknown>) => {
  const allCategories = await CategoryServices.getAllCategoriesFromDB();

  const productQuery = new QueryBuilder(
    Product.find({ isDeleted: false }),
    query,
  )
    .search(productSearchableFields)
    .filter(allCategories)
    .paginate()
    .sort();

  const data = await productQuery.modelQuery.sort({ createdAt: -1 });

  const countQuery = new QueryBuilder(Product.find({ isDeleted: false }), query)
    .search(productSearchableFields)
    .filter(allCategories);

  const totalCount = (await countQuery.modelQuery).length;

  return { data, totalCount };
};

/* ---------------------------------------------------
   GET SINGLE PRODUCT BY SLUG
--------------------------------------------------- */
const getSingleProductFromDB = async (productSlug: string) => {
  if (!productSlug) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Missing product slug');
  }

  const result = await Product.findOne({ slug: productSlug, isDeleted: false });

  if (!result) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      `Product with slug '${productSlug}' not found`,
    );
  }

  return result;
};

/* ---------------------------------------------------
   UPDATE PRODUCT
--------------------------------------------------- */
const updateProductIntoDB = async (
  productId: string,
  payload: Partial<TProduct>,
) => {
  const existing = await Product.findById(productId);

  if (!existing) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      `Product with id ${productId} not found`,
    );
  }

  if (!payload || Object.keys(payload).length === 0) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Update payload cannot be empty',
    );
  }

  if (payload.variants) {
    payload.variants = sanitizeVariants(payload.variants);
  }

  const updated = await Product.findByIdAndUpdate(productId, payload, {
    new: true,
    runValidators: true,
  });

  return updated;
};

/* ---------------------------------------------------
   DELETE PRODUCT (Soft Delete)
--------------------------------------------------- */
const deleteProductIntoDB = async (productId: string) => {
  const existing = await Product.findById(productId).lean();

  if (!existing) {
    throw new AppError(httpStatus.NOT_FOUND, 'Product not found');
  }

  const result = await Product.findByIdAndUpdate(
    productId,
    { isDeleted: true },
    { new: true },
  );

  return result;
};

export const ProductServices = {
  createProductIntoDB,
  getProductsFromDB,
  getSingleProductFromDB,
  updateProductIntoDB,
  deleteProductIntoDB,
};
