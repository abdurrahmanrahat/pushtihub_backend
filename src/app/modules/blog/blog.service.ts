import QueryBuilder from '../../builder/QueryBuilder';
import { blogSearchableFields } from './blog.constant';
import { TBlog } from './blog.interface';
import { Blog } from './blog.model';

const createBlogIntoDb = async (blogInfo: TBlog) => {
  const result = await Blog.create(blogInfo);
  return result;
};

const getBlogsFromDb = async (query: Record<string, unknown>) => {
  const blogQuery = new QueryBuilder(Blog.find({ isDeleted: false }), query)
    .search(blogSearchableFields)
    .filter()
    .pagination();

  const data = await blogQuery.modelQuery
    .sort({ createdAt: -1 })
    .populate('authorDetails', '-password');

  // for count document except pagination.
  const blogQueryWithoutPagination = new QueryBuilder(
    Blog.find({ isDeleted: false }),
    query,
  )
    .search(blogSearchableFields)
    .filter();

  const document = await blogQueryWithoutPagination.modelQuery;
  const totalCount = document?.length;
  return { data, totalCount };
};

const getSingleBlogFromDb = async (blogId: string) => {
  const result = await Blog.findOne({ _id: blogId, isDeleted: false }).populate(
    'authorDetails',
    '-password',
  );
  return result;
};

const updateBlogIntoDb = async (blogId: string, body: Partial<TBlog>) => {
  const result = await Blog.findOneAndUpdate({ _id: blogId }, body, {
    new: true,
  });
  return result;
};

const deleteBlogIntoDb = async (blogId: string) => {
  const result = await Blog.findByIdAndUpdate(
    blogId,
    { isDeleted: true },
    { new: true },
  );
  return result;
};

export const BlogServices = {
  createBlogIntoDb,
  getBlogsFromDb,
  getSingleBlogFromDb,
  updateBlogIntoDb,
  deleteBlogIntoDb,
};
