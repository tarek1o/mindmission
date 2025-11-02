export abstract class BaseExceptionFilter {
  protected buildErrorResponse(status: number, error: string, messages: string | string[]) {
    return {
      status,
      error,
      messages: Array.isArray(messages) ? messages : [messages]
    }
  }
}