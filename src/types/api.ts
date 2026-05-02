export type ApiResponse<T> = {
  success: true;
  message: string;
  data: T;
};

export type ApiErrorResponse = {
  success: false;
  errorCode: string;
  message: string;
};
