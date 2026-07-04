/** Нормализация в цифры вида 7XXXXXXXXXX (до 11). Ввод с 8 → 7… */
export function normalizeKzRuPhoneDigits(raw: string): string {
  let d = raw.replace(/\D/g, "");
  if (d.startsWith("8")) d = "7" + d.slice(1);
  if (d.length > 0 && d[0] !== "7") d = "7" + d;
  return d.slice(0, 11);
}

/** Отображение как в Kaspi: +7 (XXX) XXX-XX-XX */
export function formatKzRuPhoneDisplay(digitsNormalized: string): string {
  const d = normalizeKzRuPhoneDigits(digitsNormalized);
  if (d.length === 0) return "+7";
  const rest = d.slice(1);
  if (rest.length === 0) return "+7";
  let s = "+7 (" + rest.slice(0, Math.min(3, rest.length));
  if (rest.length < 3) return s;
  s += ") " + rest.slice(3, Math.min(6, rest.length));
  if (rest.length <= 6) return s;
  s += "-" + rest.slice(6, Math.min(8, rest.length));
  if (rest.length <= 8) return s;
  s += "-" + rest.slice(8, 10);
  return s;
}

export function isKzRuPhoneComplete(digitsNormalized: string): boolean {
  return normalizeKzRuPhoneDigits(digitsNormalized).length === 11;
}
