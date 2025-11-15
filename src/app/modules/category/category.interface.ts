import { Types } from 'mongoose';

export type TCategory = {
  name: string;
  slug: string;
  image?: string;
  subCategoryOf?: Types.ObjectId;
};

export type TPromiseResponseCategory = {
  _id: string;
  name: string;
  slug: string;
  image: string;
  subCategories: TPromiseResponseSubCategory[];
};

export type TPromiseResponseSubCategory = {
  _id: string;
  name: string;
  slug: string;
};
