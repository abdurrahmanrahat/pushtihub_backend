export type TPrimaryVariantItem = {
  value: string;
  price: number;
  sellingPrice: number;
  stock: number;
};

export type TPrimaryVariant = {
  type: 'size' | 'color' | 'weight'; // the controlling variant
  items: TPrimaryVariantItem[];
};

export type TSecondaryVariants = {
  size?: string[];
  color?: string[];
  weight?: string[];
};

export interface TProduct {
  name: string;
  slug: string;
  description: string;
  images: string[];

  category: string;
  tags: string[];

  variants: {
    primary: TPrimaryVariant;
    secondary: TSecondaryVariants;
  };

  totalReviews: number;
  averageRatings: number;
  salesCount: number;
  isDeleted: boolean;
}

//? create those before creating product
// category

//? Extra, will come from user if login required to purchase
// wishlist
// review
