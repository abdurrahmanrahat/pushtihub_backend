import mongoose from 'mongoose';
import { TErrorSource, TGenericErrResponse } from '../interface/error';

export const handleValidationError = (
  err: mongoose.Error.ValidationError,
): TGenericErrResponse => {
  const statusCode = 400;

  const errorSources: TErrorSource = Object.values(err.errors).map(
    (value: mongoose.Error.ValidatorError | mongoose.Error.CastError) => {
      return {
        path: value?.path,
        message: value?.message,
      };
    },
  );

  return {
    statusCode,
    message: `Validation Error: ${Object.values(err.errors)[0].message}`,
    errorSources,
  };
};
