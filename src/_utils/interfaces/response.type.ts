type SuccessResponse = {
  error: boolean,
  authorized: boolean,
  message: string,
  data: {} | [],
  extra?: {}
}

type ErrorResponse = {
  authorized: boolean,
  error: boolean,
  message: string
}