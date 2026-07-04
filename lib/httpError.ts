/** Ошибка HTTP с кодом ответа (для UX: 429, 5xx и т.д.) */
export class HttpError extends Error {
  readonly status: number;
  readonly detail?: string;

  constructor(message: string, status: number, detail?: string) {
    super(message);
    this.name = "HttpError";
    this.status = status;
    this.detail = detail;
  }
}

export function isHttpError(e: unknown): e is HttpError {
  return e instanceof HttpError;
}
