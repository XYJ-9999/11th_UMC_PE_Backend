export class ApiResponse<T> {
  constructor(
    public readonly isSuccess: boolean,
    public readonly code: string,
    public readonly message: string,
    public readonly result: T | null,
  ) {}

  static success<T>(code: string, message: string, result: T): ApiResponse<T> {
    return new ApiResponse(true, code, message, result);
  }
}
