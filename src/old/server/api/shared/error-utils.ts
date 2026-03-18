import { TRPCError } from "@trpc/server";

export type ErrorCode =
  | "BAD_REQUEST"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "INTERNAL_SERVER_ERROR";

export type ErrorContext = {
  entity?: string;
  operation?: string;
  details?: Record<string, unknown>;
};

export const createError = (
  code: ErrorCode,
  message: string,
  context?: ErrorContext,
): TRPCError => {
  const enhancedMessage =
    context?.entity && context?.operation
      ? `${context.operation} ${context.entity}: ${message}`
      : message;

  return new TRPCError({
    code,
    message: enhancedMessage,
    cause: context?.details,
  });
};

export const createNotFoundError = (entity: string, id?: string | number) =>
  createError("NOT_FOUND", `${entity}${id ? ` with ID ${id}` : ""} not found`);

export const createUnauthorizedError = (operation?: string) =>
  createError(
    "UNAUTHORIZED",
    `Unauthorized${operation ? ` to ${operation}` : ""}`,
  );

export const createForbiddenError = (resource: string, operation?: string) =>
  createError(
    "FORBIDDEN",
    `Access denied to ${resource}${operation ? ` for ${operation}` : ""}`,
  );

export const createValidationError = (field: string, message: string) =>
  createError("BAD_REQUEST", `Validation failed for ${field}: ${message}`);

export const createConflictError = (resource: string, reason?: string) =>
  createError(
    "CONFLICT",
    `Conflict with ${resource}${reason ? `: ${reason}` : ""}`,
  );

export const createInternalError = (
  operation: string,
  details?: Record<string, unknown>,
) =>
  createError("INTERNAL_SERVER_ERROR", `Internal error during ${operation}`, {
    details,
  });

export const handleDbError = (
  error: unknown,
  operation: string,
  entity: string,
): never => {
  if (error instanceof TRPCError) {
    throw error;
  }

  const details =
    error instanceof Error
      ? { name: error.name, message: error.message, stack: error.stack }
      : { error };

  throw createInternalError(`${operation} ${entity}`, details);
};

export const assertExists = <T>(
  value: T | null | undefined,
  entity: string,
  id?: string | number,
): asserts value is T => {
  if (value == null) {
    throw createNotFoundError(entity, id);
  }
};

export const assertAuthorized = (
  condition: boolean,
  operation?: string,
): asserts condition => {
  if (!condition) {
    throw createUnauthorizedError(operation);
  }
};

export const assertAccess = (
  condition: boolean,
  resource: string,
  operation?: string,
): asserts condition => {
  if (!condition) {
    throw createForbiddenError(resource, operation);
  }
};

export const withErrorHandling = <T extends unknown[], R>(
  operation: string,
  entity: string,
  fn: (...args: T) => Promise<R>,
) => {
  return async (...args: T): Promise<R> => {
    try {
      return await fn(...args);
    } catch (error) {
      return handleDbError(error, operation, entity);
    }
  };
};

export const safeExecute = async <T>(
  operation: () => Promise<T>,
  onError: (error: unknown) => T | Promise<T>,
): Promise<T> => {
  try {
    return await operation();
  } catch (error) {
    return await onError(error);
  }
};
