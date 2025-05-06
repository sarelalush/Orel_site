import { logger } from './logger';

export class AppError extends Error {
  constructor(
    public message: string,
    public code: string,
    public status: number = 500,
    public data?: any
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const errorCodes = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  CONFLICT: 'CONFLICT',
  SERVER_ERROR: 'SERVER_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR',
  DATABASE_ERROR: 'DATABASE_ERROR'
} as const;

export const handleError = (error: unknown): AppError => {
  // Log the error
  logger.error('Error occurred:', error);

  // If it's already an AppError, return it
  if (error instanceof AppError) {
    return error;
  }

  // Handle known error types
  if (error instanceof Error) {
    // Network errors
    if (error.name === 'NetworkError' || error.message === 'Failed to fetch') {
      return new AppError(
        'שגיאת תקשורת. אנא בדוק את החיבור לאינטרנט ונסה שוב.',
        errorCodes.NETWORK_ERROR,
        503
      );
    }

    // Database errors
    if (error.message.includes('database') || error.message.includes('supabase')) {
      return new AppError(
        'שגיאה בגישה למסד הנתונים. אנא נסה שוב מאוחר יותר.',
        errorCodes.DATABASE_ERROR,
        500
      );
    }

    // Validation errors
    if (error.message.includes('validation')) {
      return new AppError(
        'שגיאת ולידציה. אנא בדוק את הנתונים שהוזנו.',
        errorCodes.VALIDATION_ERROR,
        400
      );
    }

    // Authentication errors
    if (error.message.includes('auth') || error.message.includes('token')) {
      return new AppError(
        'שגיאת הרשאה. אנא התחבר מחדש.',
        errorCodes.UNAUTHORIZED,
        401
      );
    }
  }

  // Default error
  return new AppError(
    'שגיאה לא צפויה. אנא נסה שוב מאוחר יותר.',
    errorCodes.SERVER_ERROR,
    500
  );
};

export const withErrorHandling = async <T>(
  operation: () => Promise<T>,
  context: string
): Promise<T> => {
  try {
    return await operation();
  } catch (error) {
    const appError = handleError(error);
    logger.error(`Error in ${context}:`, { error: appError });
    throw appError;
  }
};