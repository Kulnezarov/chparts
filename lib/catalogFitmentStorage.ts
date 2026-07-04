const STORAGE_KEY = "chparts_catalog_fitment_v1";

export type StoredCatalogFitment = {
  vehicle_brand: string | null;
  vehicle_model: string | null;
  engine_family: string | null;
};

function canUseStorage(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function readStoredCatalogFitment(): StoredCatalogFitment | null {
  if (!canUseStorage()) return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<StoredCatalogFitment>;
    if (!parsed || typeof parsed !== "object") return null;
    return {
      vehicle_brand: typeof parsed.vehicle_brand === "string" ? parsed.vehicle_brand : null,
      vehicle_model: typeof parsed.vehicle_model === "string" ? parsed.vehicle_model : null,
      engine_family: typeof parsed.engine_family === "string" ? parsed.engine_family : null,
    };
  } catch {
    return null;
  }
}

export function writeStoredCatalogFitment(data: StoredCatalogFitment): void {
  if (!canUseStorage()) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    /* quota / private mode */
  }
}

export function clearStoredCatalogFitment(): void {
  if (!canUseStorage()) return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

export function syncStoredCatalogFitmentFromParams(params: URLSearchParams): void {
  const vehicle_brand = params.get("vehicle_brand");
  const vehicle_model = params.get("vehicle_model");
  const engine_family = params.get("engine_family");

  if (!vehicle_brand && !vehicle_model && !engine_family) {
    clearStoredCatalogFitment();
    return;
  }

  writeStoredCatalogFitment({
    vehicle_brand,
    vehicle_model,
    engine_family,
  });
}

export function hasStoredCatalogFitment(data: StoredCatalogFitment | null): boolean {
  if (!data) return false;
  return Boolean(data.vehicle_brand || data.vehicle_model || data.engine_family);
}
