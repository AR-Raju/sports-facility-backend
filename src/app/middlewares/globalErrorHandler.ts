import { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import config from "../config";
import AppError from "../errors/AppError";
import handleCastError from "../errors/handleCastError";
import handleDuplicateError from "../errors/handleDuplicateError";
import handleValidationError from "../errors/handleValidationError";
import handleZodError from "../errors/handleZodError";
import { TErrorSource } from "../interface/error";

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  let statusCode = 500;
  let message = "Something went wrong!";

  let errorSources: TErrorSource = [
    {
      path: "",
      message: "Something went wrong!",
    },
  ];

  if (err instanceof ZodError) {
    const simplifiedZodError = handleZodError(err);
    statusCode = simplifiedZodError.statusCode;
    message = simplifiedZodError.message;
    errorSources = simplifiedZodError.errorSources;
  } else if (err?.name === "ValidationError") {
    const simplifiedValidationError = handleValidationError(err);
    statusCode = simplifiedValidationError.statusCode;
    message = simplifiedValidationError.message;
    errorSources = simplifiedValidationError.errorSources;
  } else if (err?.name === "CastError") {
    const simplifiedValidationError = handleCastError(err);
    statusCode = simplifiedValidationError.statusCode;
    message = simplifiedValidationError.message;
    errorSources = simplifiedValidationError.errorSources;
  } else if (err?.errorResponse?.code === 11000) {
    const simplifiedValidationError = handleDuplicateError(err?.errorResponse);
    statusCode = simplifiedValidationError.statusCode;
    message = simplifiedValidationError.message;
    errorSources = simplifiedValidationError.errorSources;
  } else if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    errorSources = [
      {
        path: "",
        message,
      },
    ];
  }

  // ultimate return
  return res.status(statusCode).json({
    success: false,
    message,
    errorSources,
    stack: config.NODE_ENV === "development" ? err?.stack : null,
  });
};

export default globalErrorHandler;
