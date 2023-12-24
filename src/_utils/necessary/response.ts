export const successResponse = (
  message: string,
  data?: {} | [],
  extra?: {},
): SuccessResponse => {
  const response = {
    error: false,
    authorized: true,
    message: message,
  };

  if (data != null) {
    response["data"] = data;
  }

  if (extra != null) {
    response["meta"] = extra;
  }

  return response;
};

export const errorResponse = (
  message: string,
  authorized = true,
): ErrorResponse => {
  return {
    error: true,
    authorized: authorized,
    message: message,
  };
};
