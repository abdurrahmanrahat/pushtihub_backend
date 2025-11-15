import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { TCategory, TPromiseResponseCategory } from './category.interface';
import { Category } from './category.model';

const createCategoryIntoDB = async (categoryData: TCategory) => {
  if (categoryData.subCategoryOf) {
    const parent = await Category.findById(categoryData.subCategoryOf);

    if (!parent) {
      throw new AppError(httpStatus.NOT_FOUND, 'Parent category not found');
    }
  }

  const result = await Category.create(categoryData);
  return result;
};

const getAllCategoriesFromDB = async (): Promise<
  TPromiseResponseCategory[]
> => {
  // fetch only all parent categories
  const parentCategories = await Category.find({
    subCategoryOf: { $exists: false },
  })
    .select('_id name slug image')
    .lean();

  // for each parent, fetch all sub categories
  const result: TPromiseResponseCategory[] = await Promise.all(
    parentCategories.map(async (category) => {
      const subCategories = await Category.find({ subCategoryOf: category._id })
        .select('_id name slug')
        .lean();

      return {
        _id: category._id.toString(),
        name: category.name,
        slug: category.slug,
        image: category.image ?? '',
        subCategories: subCategories.map((sub) => ({
          _id: sub._id.toString(),
          name: sub.name,
          slug: sub.slug,
        })),
      };
    }),
  );

  return result;
};

const updateCategoryIntoDB = async (
  categoryId: string,
  payload: Partial<TCategory>,
) => {
  const isCategoryExists = Category.findById(categoryId);

  if (!isCategoryExists) {
    throw new AppError(404, `Category with the id ${categoryId} is not found!`);
  }

  if (!payload || Object.keys(payload).length === 0) {
    throw new AppError(
      Number(httpStatus[400]),
      'Update payload cannot be empty!',
    );
  }

  const result = await Category.findByIdAndUpdate(
    categoryId,
    payload,
    { new: true }, // returns the updated document
  );

  return result;
};

const deleteCategoryFromDB = async (categoryId: string) => {
  // find the category to know if it's a parent or subcategory
  const category = await Category.findById(categoryId)
    .select('_id subCategoryOf')
    .lean();

  if (!category) {
    throw new AppError(httpStatus.NOT_FOUND, 'Category not found!');
  }

  // if it's a parent (no subCategoryOf field)
  if (!category?.subCategoryOf) {
    // delete parent and its subcategories
    await Category.deleteMany({
      $or: [{ _id: categoryId }, { subCategoryOf: categoryId }],
    });

    return { deletedType: 'parent-category', deletedId: categoryId };
  }

  // if it's a subcategory
  await Category.findByIdAndDelete(categoryId);
  return { deletedType: 'subcategory', deletedId: categoryId };
};

export const CategoryServices = {
  createCategoryIntoDB,
  getAllCategoriesFromDB,
  updateCategoryIntoDB,
  deleteCategoryFromDB,
};
