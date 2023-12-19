export const successResponse = (
  message: string,
  data: {} | [],
  extra?: any
) => {
  return {
    error: false,
    authorized: true,
    message: message,
    data: data,
    ...extra,
  };
};

export const errorResponse = (message: string, authorized = true) => {
  return {
    error: true,
    authorized: authorized,
    message: message,
  };
};
