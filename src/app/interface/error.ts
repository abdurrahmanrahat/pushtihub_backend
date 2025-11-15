export type TErrorSource = {
  path: string | number;
  message: string;
}[];

export type TGenericErrResponse = {
  statusCode: number;
  message: string;
  errorSources: TErrorSource;
};
