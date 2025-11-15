import bcrypt from 'bcryptjs';
import { Schema, model } from 'mongoose';
import config from '../../config';
import { USER_ROLE } from './user.constant';
import { TUser, UserStaticModel } from './user.interface';

const userSchema = new Schema<TUser, UserStaticModel>(
  {
    name: { type: String, required: [true, 'Name is required'] },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
    },
    password: { type: String, required: [true, 'Password is required'] },
    role: {
      type: String,
      enum: Object.keys(USER_ROLE),
      default: USER_ROLE.user,
    },
    photoUrl: { type: String, required: false },
    phone: { type: String, required: false },
    fullAddress: { type: String, required: false },
    country: { type: String, required: false },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);

// check user exists or not
userSchema.statics.isUserExistsByEmail = async function (email: string) {
  const existingUser = await User.findOne({ email });
  return existingUser;
};

// check for password matched
userSchema.statics.isPasswordMatched = async function (
  plainTextPassword,
  hashedPassword,
) {
  const isPasswordValid = await bcrypt.compare(
    plainTextPassword,
    hashedPassword,
  );

  return isPasswordValid;
};

// pre save middleware
userSchema.pre('save', async function (next) {
  // hashing password and saved into db
  this.password = await bcrypt.hash(
    this.password,
    Number(config.bcrypt_salt_rounds),
  );

  next();
});

// post save middleware
userSchema.post('save', function (doc, next) {
  doc.password = '';
  next();
});

// model
export const User = model<TUser, UserStaticModel>('User', userSchema);
