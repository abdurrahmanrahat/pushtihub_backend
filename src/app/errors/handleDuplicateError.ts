/* eslint-disable @typescript-eslint/no-explicit-any */
import { TErrorSource, TGenericErrResponse } from '../interface/error';

export const handleDuplicateError = (err: any): TGenericErrResponse => {
  const statusCode = 400;

  const match = err.message.match(/"([^"]*)"/);
  const extractedMessage = match && match[1];

  const errorSources: TErrorSource = [
    {
      path: '',
      message: `${extractedMessage} is already exist`,
    },
  ];

  return {
    statusCode,
    message: 'Invalid Id',
    errorSources,
  };
};
