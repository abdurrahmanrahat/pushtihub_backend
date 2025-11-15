/* eslint-disable no-unused-vars */
import { Model } from 'mongoose';
import { USER_ROLE } from './user.constant';

export type TUser = {
  name: string;
  email: string;
  password: string;
  role: keyof typeof USER_ROLE;
  photoUrl?: string;
  phone?: string;
  fullAddress?: string;
  country?: string;
  isDeleted?: boolean;
};

// creating custom statics method
export interface UserStaticModel extends Model<TUser> {
  //instance methods for checking if the user exist
  isUserExistsByEmail(id: string): Promise<TUser | null>;

  //instance methods for checking if passwords are matched
  isPasswordMatched(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean>;
}
