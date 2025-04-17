
/**
 * Error handling utilities
 */

/**
 * Custom error class for bad requests
 */
export class BadRequestError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.name = 'BadRequestError';
    this.statusCode = 400;
  }
}

/**
 * Custom error class for not found errors
 */
export class NotFoundError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
    this.statusCode = 404;
  }
}

/**
 * Custom error class for unauthorized errors
 */
export class UnauthorizedError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.name = 'UnauthorizedError';
    this.statusCode = 401;
  }
}

/**
 * Custom error class for forbidden errors
 */
export class ForbiddenError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.name = 'ForbiddenError';
    this.statusCode = 403;
  }
}

/**
 * Function to format error responses
 * @param error Error object
 * @returns Formatted error response
 */
export function formatErrorResponse(error: Error): { 
  success: false; 
  error: string; 
  status: number;
  details?: any;
} {
  let status = 500;
  let message = 'An unexpected error occurred';
  let details = undefined;

  if (error instanceof BadRequestError) {
    status = error.statusCode;
    message = error.message;
  } else if (error instanceof NotFoundError) {
    status = error.statusCode;
    message = error.message;
  } else if (error instanceof UnauthorizedError) {
    status = error.statusCode;
    message = error.message;
  } else if (error instanceof ForbiddenError) {
    status = error.statusCode;
    message = error.message;
  } else {
    // For unexpected errors, don't expose details in production
    if (process.env.NODE_ENV !== 'production') {
      details = {
        name: error.name,
        stack: error.stack
      };
    }
  }

  return {
    success: false,
    error: message,
    status,
    details
  };
}
