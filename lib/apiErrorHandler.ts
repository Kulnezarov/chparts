/**
 * Обработка ошибок API с деталями
 */

export class ApiErrorHandler {
  static getErrorMessage(error: unknown, defaultMessage: string): string {
    // HTTP Error
    if (error instanceof Error && "status" in error) {
      const status = Number((error as Error & { status: unknown }).status);
      if (status === 429) {
        return "Слишком много попыток. Подождите минуту и попробуйте снова.";
      }
      if (status === 400) {
        return "Проверьте данные заказа и попробуйте снова.";
      }
      if (status === 401 || status === 403) {
        return "Доступ запрещён. Попробуйте снова.";
      }
      if (status === 500) {
        return "Ошибка сервера. Попробуйте позже.";
      }
      if (status >= 400 && status < 600) {
        return `Ошибка сервера (${status}). Попробуйте позже.`;
      }
    }

    // Generic Error
    if (error instanceof Error) {
      if (error.message === "Failed to fetch") {
        return "Проверьте подключение к интернету.";
      }
      return error.message || defaultMessage;
    }

    return defaultMessage;
  }

  static isNetworkError(error: unknown): boolean {
    return error instanceof TypeError && error.message === "Failed to fetch";
  }

  static is429Error(error: unknown): boolean {
    return (
      error instanceof Error &&
      "status" in error &&
      Number((error as Error & { status: unknown }).status) === 429
    );
  }
}

/**
 * Повтор запроса с очередью
 */
export class RequestRetry {
  private static queue: (() => Promise<unknown>)[] = [];
  private static isRetrying = false;
  private static retryCount = 0;
  private static maxRetries = 3;
  private static retryDelay = 1000;

  static async executeWithRetry<T>(
    fn: () => Promise<T>,
    maxRetries = 3,
    delayMs = 1000
  ): Promise<T> {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));

        // Не повторяем для ошибок валидации
        if (
          error instanceof Error &&
          "status" in error &&
          Number((error as Error & { status: unknown }).status) >= 400 &&
          Number((error as Error & { status: unknown }).status) < 500
        ) {
          throw error;
        }

        // Ждём перед повтором
        if (attempt < maxRetries - 1) {
          await new Promise((resolve) => setTimeout(resolve, delayMs * (attempt + 1)));
        }
      }
    }

    throw lastError || new Error("Request failed after retries");
  }
}
