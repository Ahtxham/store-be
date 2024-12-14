import { Request, Response, NextFunction } from "express";

interface CustomError extends Error {
  status?: number;
}

const notFound = (req: Request, res: Response, next: NextFunction): void => {
  const error: CustomError = new Error(
    "Opps! The route you are trying to access does not exist"
  );
  error.status = 404;
  next(error);
};

const internalServerError = (
  error: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  res.status(error.status || 500).json({
    metadata: {
      responseCode: 500,
      success: false,
      message: "Something went wrong, internal server error",
    },
    payload: {
      message: error.message,
      stack: error.stack?.toString().split(/\r\n|\n/),
    },
  });
};

export { notFound, internalServerError };
export default { notFound, internalServerError };
