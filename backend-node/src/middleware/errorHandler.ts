import type { ErrorRequestHandler } from "express";

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  console.error("Unhandled API error:", error);

  if (res.headersSent) {
    return;
  }

  const statusCode =
    typeof error?.status === "number" && error.status >= 400 && error.status < 600
      ? error.status
      : 500;

  res.status(statusCode).json({
    error: statusCode === 500 ? "Internal server error" : error.message,
  });
};
