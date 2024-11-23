export class ResponseUtil {
  static success(message: string, data?: unknown, statusCode: number = 200) {
    if (statusCode === 204) {
      // For 204 No Content, return only the message and exclude response data
      return {
        statusCode,
        status: 'success',
        message,
      };
    }
    return {
      statusCode,
      status: 'success',
      message,
      data,
    };
  }

  static error(message: string, code?: string, details?: unknown, statusCode: number = 400) {
    return {
      statusCode,
      status: 'error',
      message,
      error: {
        code,
        details,
      },
    };
  }
}
