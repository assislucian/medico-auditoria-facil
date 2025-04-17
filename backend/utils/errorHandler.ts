
/**
 * Error handling utilities for backend services
 * Provides standard error classes and handling functions
 */
import { logger } from './logger';

/**
 * Base application error class
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Not found error (404)
 */
export class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 404);
  }
}

/**
 * Bad request error (400)
 */
export class BadRequestError extends AppError {
  constructor(message = 'Bad request') {
    super(message, 400);
  }
}

/**
 * Unauthorized error (401)
 */
export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(message, 401);
  }
}

/**
 * Forbidden error (403)
 */
export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden') {
    super(message, 403);
  }
}

/**
 * Central error handler function for standardized error handling
 * @param error The error to handle
 */
export function handleError(error: Error | AppError): void {
  if (error instanceof AppError && error.isOperational) {
    // Operational, trusted error - log appropriately
    logger.warn(error.message, { statusCode: (error as AppError).statusCode });
  } else {
    // Programming or unknown error - log with full details
    logger.error('Unexpected error', { error: error.message, stack: error.stack });
  }
}
