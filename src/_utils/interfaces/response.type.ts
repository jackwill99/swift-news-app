type SuccessResponse = {
  error: boolean,
  authorized: boolean,
  message: string,
  data?: {} | [],
  meta?: {}
}

type ErrorResponse = {
  authorized: boolean,
  error: boolean,
  message: string
}