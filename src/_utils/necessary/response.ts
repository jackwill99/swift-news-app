export const successResponse = (
  message: string,
  data: {} | [],
  extra?: {},
): SuccessResponse => {
  const response = {
    error: false,
    authorized: true,
    message: message,
    data: data,
  };

  if (extra != null) {
    response['extra'] = extra;
  }

  return response;
};

export const errorResponse = (message: string, authorized = true): ErrorResponse => {
  return {
    error: true,
    authorized: authorized,
    message: message,
  };
};
