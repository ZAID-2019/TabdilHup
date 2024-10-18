export class ResponseUtil {
    static success(message: string, response?: any) {
      return {
        status: 'success',
        message,
        response
      };
    }
  
    static error(message: string, code?: string, details?: any) {
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