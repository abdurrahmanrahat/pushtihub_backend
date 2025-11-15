import mongoose from 'mongoose';
import { TErrorSource, TGenericErrResponse } from '../interface/error';

export const handleCastError = (
  err: mongoose.Error.CastError,
): TGenericErrResponse => {
  const statusCode = 400;

  const errorSources: TErrorSource = [
    {
      path: err.path,
      message: err.message,
    },
  ];

  return {
    statusCode,
    message: 'Invalid Id',
    errorSources,
  };
};
