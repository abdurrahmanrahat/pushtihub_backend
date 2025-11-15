export type TProduct = {
  name: string;
  slug: string;
  description: string; // html string
  images: string[]; // Gallery
  category: string;
  price: number;
  sellingPrice: number;
  stock: number;
  tags: string[];
  totalReviews?: number; // update on review action
  averageRatings?: number; // update on review action
  salesCount?: number; // update on order
  isDeleted?: boolean;
};

//? create those before creating product
// category

//? Extra, will come from user if login required to purchase
// wishlist
// review
