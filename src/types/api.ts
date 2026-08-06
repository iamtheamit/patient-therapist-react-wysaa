/**
 * Standardized API Data & Error Response Types
 */

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp?: string;
}

export interface ApiErrorPayload {
  message: string;
  errorCode?: string;
  errors?: Record<string, string[]>;
  status: number;
}

export class CustomApiError extends Error {
  public status: number;
  public errorCode?: string;
  public errors?: Record<string, string[]>;

  constructor(payload: ApiErrorPayload) {
    super(payload.message);
    this.name = 'CustomApiError';
    this.status = payload.status;
    this.errorCode = payload.errorCode;
    this.errors = payload.errors;
  }
}
