import { USER_ROLE } from '../user/user.constant';

export type TLoginUser = {
  email: string;
  password: string;
};

export type TDecodedUser = {
  name: string;
  email: string;
  role: keyof typeof USER_ROLE;
  iat: number;
  exp: number;
};
