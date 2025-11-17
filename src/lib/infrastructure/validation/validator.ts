/**
 * Validation utility using Zod schemas
 */
import { z } from 'zod';
import { AppError } from '../../types/common.types';

export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

export class Validator {
  static validate<T>(schema: z.ZodSchema<T>, data: unknown): ValidationResult<T> {
    try {
      const result = schema.parse(data);
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          success: false,
          errors: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        };
      }

      throw new AppError({
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        details: error,
        timestamp: new Date().toISOString(),
      });
    }
  }

  static validateAndThrow<T>(schema: z.ZodSchema<T>, data: unknown): T {
    const result = this.validate(schema, data);
    
    if (!result.success) {
      throw new AppError({
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        details: result.errors,
        timestamp: new Date().toISOString(),
      });
    }

    return result.data!;
  }

  static async validateAsync<T>(schema: z.ZodSchema<T>, data: unknown): Promise<ValidationResult<T>> {
    return this.validate(schema, data);
  }

  static async validateAndThrowAsync<T>(schema: z.ZodSchema<T>, data: unknown): Promise<T> {
    return this.validateAndThrow(schema, data);
  }

  // Utility method to create custom validation schemas
  static createSchema<_T>(schemaDefinition: z.ZodRawShape): z.ZodObject<z.ZodRawShape> {
    return z.object(schemaDefinition);
  }

  // Utility method for conditional validation
  static validateIf<T>(
    condition: boolean,
    schema: z.ZodSchema<T>,
    data: unknown
  ): ValidationResult<T | undefined> {
    if (!condition) {
      return { success: true, data: undefined };
    }
    return this.validate(schema, data);
  }

  // Utility method for partial validation (useful for updates)
  static validatePartial<T>(schema: z.ZodObject<any>, data: unknown): ValidationResult<Partial<T>> {
    return this.validate(schema.partial(), data) as ValidationResult<Partial<T>>;
  }

  // Utility method to validate arrays
  static validateArray<T>(schema: z.ZodSchema<T>, data: unknown[]): ValidationResult<T[]> {
    return this.validate(z.array(schema), data);
  }

  // Utility method to sanitize data (remove unknown fields)
  static sanitize<T>(schema: z.ZodSchema<T>, data: unknown): T {
    const result = this.validateAndThrow(schema, data);
    return result;
  }
}

// Helper function to format validation errors for display
export function formatValidationErrors(errors: Array<{ field: string; message: string }>): string {
  return errors.map(error => `${error.field}: ${error.message}`).join(', ');
}

// Helper function to get first validation error
export function getFirstValidationError(errors: Array<{ field: string; message: string }>): string {
  return errors.length > 0 ? errors[0].message : 'Validation failed';
}
