import { model, Schema } from 'mongoose';
import { TBlog } from './blog.interface';

const BlogSchema = new Schema<TBlog>(
  {
    title: {
      type: String,
      required: [true, 'Blog title is required'],
      minlength: 1,
    },
    image: { type: String, required: [true, 'Blog image is required'] },
    description: {
      type: String,
      required: [true, 'Blog description is required'],
      minlength: 1,
    },
    tags: {
      type: [String],
      required: [true, 'Blog tag is required'],
      validate: [
        (val: string[]) => val.length > 0,
        'At least one tag is required',
      ],
    },
    authorDetails: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Author details are required'],
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export const Blog = model<TBlog>('Blog', BlogSchema);
