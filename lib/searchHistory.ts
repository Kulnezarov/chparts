export const getRecentSearches = (): string[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem("chparts-recent-searches");
    if (!raw) return [];
    const data = JSON.parse(raw);
    if (!Array.isArray(data)) return [];
    return data.filter((s): s is string => typeof s === "string").slice(0, 5);
  } catch {
    return [];
  }
};

export const addRecentSearch = (query: string) => {
  const q = query.trim();
  if (typeof window === "undefined" || !q || q.length < 2) return;
  try {
    const searches = getRecentSearches();
    const filtered = searches.filter((s) => s.toLowerCase() !== q.toLowerCase());
    const next = [q, ...filtered].slice(0, 5); // Keep last 5 queries
    localStorage.setItem("chparts-recent-searches", JSON.stringify(next));
  } catch {}
};

export const clearRecentSearches = () => {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem("chparts-recent-searches");
  } catch {}
};
