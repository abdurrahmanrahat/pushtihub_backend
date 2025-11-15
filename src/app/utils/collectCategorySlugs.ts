import { TPromiseResponseCategory } from '../modules/category/category.interface';

export const collectCategorySlugs = (
  slug: string,
  allCategories: TPromiseResponseCategory[],
): string[] => {
  const queryableSlugs: string[] = [];

  // Find the main category first
  const matchedCategory = allCategories.find((cat) => cat.slug === slug);

  if (matchedCategory) {
    // Add the parent category
    queryableSlugs.push(matchedCategory.slug);

    // Add all its direct subcategories
    if (matchedCategory.subCategories?.length) {
      for (const sub of matchedCategory.subCategories) {
        queryableSlugs.push(sub.slug);
      }
    }
  } else {
    // If not found as a parent, maybe it's a subcategory
    const subCategory = allCategories.find(
      (cat) => cat.subCategories?.some((sub) => sub.slug === slug),
    );

    if (subCategory) {
      queryableSlugs.push(slug); // add only the matching subcategory
    }
  }

  return queryableSlugs;
};

/**
 * Collects the selected category slug and its immediate subcategory slugs.
 * Works efficiently for single-level category structures
 * @param slug - The parent or sub-category slug to collect from
 * @param allCategories - Full category tree
 * @returns Array of slugs including parent and all descendants (unique)
 */
