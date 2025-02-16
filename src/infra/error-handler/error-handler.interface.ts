export enum StatusCodes {
  OK = 200,
  CREATED = 201,
  NOCONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  PRECONDITIONFAILED = 412,
  INTERNAL_SERVER_ERROR = 500,
}

export interface ErrorHandlerProps {
  message: string;
  status: StatusCodes;
}
