import { FilterQuery, Query } from 'mongoose';
import { TPromiseResponseCategory } from '../modules/category/category.interface';
import { collectCategorySlugs } from '../utils/collectCategorySlugs';
import { SORT_OPTION_MAP } from '../utils/sortOptionMap';

class QueryBuilder<T> {
  public modelQuery: Query<T[], T>;
  public query: Record<string, unknown>;

  constructor(modelQuery: Query<T[], T>, query: Record<string, unknown>) {
    this.modelQuery = modelQuery;
    this.query = query;
  }

  search(searchableFields: string[]) {
    if (this?.query?.searchTerm) {
      this.modelQuery = this.modelQuery.find({
        $or: searchableFields.map(
          (field) =>
            ({
              [field]: { $regex: this?.query?.searchTerm, $options: 'i' },
            }) as FilterQuery<T>,
        ),
      });
    }

    return this;
  }

  filter(allCategories?: TPromiseResponseCategory[]) {
    const queryObj = { ...this.query };

    // Filtering
    const excludeFields = [
      'searchTerm',
      'sort',
      'limit',
      'page',
      'fields',
      'minPrice',
      'maxPrice',
      'category',
      'tags',
    ];
    excludeFields.forEach((field) => delete queryObj[field]);

    // Price range filtering
    const priceFilter: Record<string, number> = {};

    if (this?.query?.minPrice) {
      priceFilter.$gte = Number(this.query.minPrice);
    }
    if (this?.query?.maxPrice) {
      priceFilter.$lte = Number(this.query.maxPrice);
    }

    if (Object.keys(priceFilter).length > 0) {
      queryObj.sellingPrice = priceFilter;
    }

    //? TODO: Category filtering
    if (this?.query?.category && allCategories) {
      const selectedCategories = (this?.query?.category as string)
        .split(',')
        .map((slug) => slug.trim());

      // Collect all related slugs from each category
      const allSlugs = selectedCategories.flatMap((slug) =>
        collectCategorySlugs(slug, allCategories),
      );

      // Remove duplicates (to keep query clean)
      const uniqueSlugsInObj = new Set(allSlugs); // return unique in obj
      const uniqueSlugs = [...uniqueSlugsInObj];

      // Add to query
      queryObj.category = { $in: uniqueSlugs };
    }

    // Tags filtering
    if (this?.query?.tags) {
      const tagsArray = (this.query.tags as string).split(',');

      queryObj.tags = { $in: tagsArray };
    }

    this.modelQuery = this.modelQuery.find(queryObj as FilterQuery<T>);
    return this;
  }

  sort() {
    const sortKey = this?.query?.sort as string;
    const resolvedSort = SORT_OPTION_MAP[sortKey];

    if (resolvedSort) {
      this.modelQuery = this.modelQuery.sort(resolvedSort);
    }

    return this;
  }

  paginate() {
    const page = Number(this?.query?.page) || 1;
    const limit = Number(this?.query?.limit) || 10;
    const skip = (page - 1) * limit;

    this.modelQuery = this.modelQuery.skip(skip).limit(limit);

    return this;
  }

  fields() {
    const fields =
      (this?.query?.fields as string)?.split(',')?.join(' ') || '-__v';
    this.modelQuery = this.modelQuery.select(fields);

    return this;
  }
}

export default QueryBuilder;
