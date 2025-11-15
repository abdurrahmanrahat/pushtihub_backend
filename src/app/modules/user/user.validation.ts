import { z } from 'zod';
import { USER_ROLE } from './user.constant';

const createUserValidationSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: 'Name is required',
      invalid_type_error: 'Name must be a string',
    }),
    email: z
      .string({
        required_error: 'Email is required',
        invalid_type_error: 'Email must be a string',
      })
      .email('Invalid email format'),
    password: z.string({
      required_error: 'Password is required',
      invalid_type_error: 'Password must be a string',
    }),
  }),
});

const updateUserValidationSchema = z.object({
  body: z.object({
    name: z
      .string({
        invalid_type_error: 'Name must be a string',
      })
      .optional(),
    role: z
      .enum([...Object.values(USER_ROLE)] as [string, ...string[]], {
        invalid_type_error: "Role must be either 'admin' or 'user'",
      })
      .optional(),
    photoUrl: z
      .string({
        invalid_type_error: 'photoUrl must be a string',
      })
      .optional(),
    phone: z
      .string({
        invalid_type_error: 'Phone must be a string',
      })
      .optional(),
    fullAddress: z
      .string({
        invalid_type_error: 'Full address must be a string',
      })
      .optional(),
    country: z
      .string({
        invalid_type_error: 'Country must be a string',
      })
      .optional(),
    isDeleted: z
      .boolean({
        invalid_type_error: 'isDeleted must be true or false',
      })
      .optional(),
  }),
});

export const UserValidations = {
  createUserValidationSchema,
  updateUserValidationSchema,
};
