export class ResponseUtil {
    static success(message: string, response?: unknown) {
      return {
        status: 'success',
        message,
        response
      };
    }
  
    static error(message: string, code?: string, details?: unknown) {
      return {
        status: 'error',
        message,
        error: {
          code,
          details
        }
      };
    }
  }