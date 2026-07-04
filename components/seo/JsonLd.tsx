export default function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  // Экранируем "<" чтобы значения из API не могли разорвать тег <script> (JSON-LD XSS).
  const safeJson = JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJson }}
    />
  );
}
