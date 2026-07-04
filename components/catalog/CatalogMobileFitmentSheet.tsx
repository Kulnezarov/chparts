"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { Check, ChevronLeft, ChevronRight, Search, X } from "lucide-react";
import type { PublicEngineFamily, PublicVehicleBrand, PublicVehicleModel } from "@/lib/publicApi";

type FitmentTab = "brand" | "code";

type Labels = {
  title: string;
  brandTab: string;
  codeTab: string;
  searchPlaceholder: string;
  allBrands: string;
  allModels: string;
  allModelsForBrand: string;
  backToBrands: string;
  chooseBrand: string;
  modelsForBrand: string;
  brandResult: string;
  modelResult: string;
  codeResult: string;
  emptyResults: string;
};

type Props = {
  open: boolean;
  labels: Labels;
  vehicleBrands: PublicVehicleBrand[];
  vehicleModels: PublicVehicleModel[];
  engineFamilies: PublicEngineFamily[];
  selectedVehicleBrandId: number | null;
  selectedVehicleModelId: number | null;
  selectedEngineFamilyId: number | null;
  onSelectBrand: (id: number | null) => void;
  onSelectModel: (id: number | null) => void;
  onSelectEngineFamily: (id: number | null) => void;
  onClose: () => void;
};

function includesNeedle(value: string | null | undefined, needle: string) {
  return String(value ?? "").toLowerCase().includes(needle);
}

function modelLabel(model: PublicVehicleModel, brandsById: Map<number, PublicVehicleBrand>) {
  const brand = model.brand?.name ?? brandsById.get(model.vehicle_brand_id)?.name ?? "";
  if (!brand) return model.name;
  const re = new RegExp(`^${brand.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s+`, "i");
  return model.name.replace(re, "").trim() || model.name;
}

function engineLabel(row: PublicEngineFamily) {
  return row.name?.trim() ? `${row.code} · ${row.name.trim()}` : row.code;
}

export default function CatalogMobileFitmentSheet({
  open,
  labels,
  vehicleBrands,
  vehicleModels,
  engineFamilies,
  selectedVehicleBrandId,
  selectedVehicleModelId,
  selectedEngineFamilyId,
  onSelectBrand,
  onSelectModel,
  onSelectEngineFamily,
  onClose,
}: Props) {
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<FitmentTab>("brand");

  const brandsById = useMemo(() => new Map(vehicleBrands.map((brand) => [brand.id, brand])), [vehicleBrands]);
  const selectedBrand = selectedVehicleBrandId != null ? brandsById.get(selectedVehicleBrandId) ?? null : null;

  const modelsForSelectedBrand = useMemo(() => {
    if (selectedVehicleBrandId == null) return [];
    return vehicleModels.filter((model) => model.vehicle_brand_id === selectedVehicleBrandId);
  }, [vehicleModels, selectedVehicleBrandId]);

  const closeSheet = useCallback(() => {
    setQuery("");
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeSheet();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, closeSheet]);

  useEffect(() => {
    if (open) setTab(selectedEngineFamilyId != null ? "code" : "brand");
  }, [open, selectedEngineFamilyId]);

  const searchResults = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return null;
    const brands = vehicleBrands.filter((brand) => includesNeedle(brand.name, needle));
    const models = vehicleModels.filter((model) => {
      const brandName = model.brand?.name ?? brandsById.get(model.vehicle_brand_id)?.name;
      return includesNeedle(model.name, needle) || includesNeedle(modelLabel(model, brandsById), needle) || includesNeedle(brandName, needle);
    });
    const engines = engineFamilies.filter((row) => {
      const vehicleText = (row.vehicle_models ?? [])
        .map((model) => `${model.brand?.name ?? ""} ${model.name}`)
        .join(" ");
      return (
        includesNeedle(row.code, needle) ||
        includesNeedle(row.name, needle) ||
        includesNeedle(row.summary, needle) ||
        includesNeedle(vehicleText, needle)
      );
    });
    return { brands, models, engines };
  }, [brandsById, engineFamilies, query, vehicleBrands, vehicleModels]);

  if (!open || typeof document === "undefined") return null;

  const selectBrand = (id: number | null) => {
    onSelectBrand(id);
    setTab("brand");
    setQuery("");
  };

  const selectModel = (id: number | null) => {
    onSelectModel(id);
    closeSheet();
  };

  const selectEngine = (id: number | null) => {
    onSelectEngineFamily(id);
    closeSheet();
  };

  const hasSearchResults = Boolean(
    searchResults &&
      (searchResults.brands.length || searchResults.models.length || searchResults.engines.length),
  );

  return createPortal(
    <div className="catalog-mobile-fitment-overlay lg:hidden" role="dialog" aria-modal="true" aria-label={labels.title}>
      <button type="button" className="catalog-mobile-fitment-backdrop" aria-label="Закрыть" onClick={closeSheet} />
      <section className="catalog-mobile-fitment-sheet">
        <header className="catalog-mobile-fitment-head">
          <div className="min-w-0 flex-1">
            <p className="filter-section-label">{labels.title}</p>
            <h2 className="truncate text-lg font-bold text-[var(--text-charcoal)]">
              {selectedBrand?.name ?? labels.allBrands}
            </h2>
          </div>
          <button type="button" onClick={closeSheet} className="catalog-mobile-fitment-close" aria-label="Закрыть">
            <X size={20} aria-hidden />
          </button>
        </header>

        <div className="catalog-mobile-fitment-search-wrap">
          <label className="catalog-mobile-fitment-search">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={labels.searchPlaceholder}
              className="catalog-mobile-fitment-search-input"
              autoFocus
            />
            <Search size={17} className="shrink-0 text-[var(--text-silver)]" aria-hidden />
          </label>
        </div>

        <div className="catalog-mobile-fitment-tabs" role="tablist" aria-label={labels.title}>
          <button
            type="button"
            className={`catalog-mobile-fitment-tab${tab === "brand" ? " catalog-mobile-fitment-tab--active" : ""}`}
            onClick={() => setTab("brand")}
          >
            {labels.brandTab}
          </button>
          <button
            type="button"
            className={`catalog-mobile-fitment-tab${tab === "code" ? " catalog-mobile-fitment-tab--active" : ""}`}
            onClick={() => setTab("code")}
          >
            {labels.codeTab}
          </button>
        </div>

        <div className="catalog-mobile-fitment-list">
          {searchResults ? (
            <>
              {searchResults.brands.length > 0 && (
                <section className="catalog-mobile-fitment-group">
                  <p className="catalog-mobile-fitment-group-title">{labels.brandResult}</p>
                  {searchResults.brands.map((brand) => (
                    <button
                      key={`brand-${brand.id}`}
                      type="button"
                      className="catalog-mobile-fitment-row"
                      onClick={() => selectBrand(brand.id)}
                    >
                      <span>{brand.name}</span>
                      <ChevronRight size={18} className="shrink-0 text-[var(--site-accent)]" aria-hidden />
                    </button>
                  ))}
                </section>
              )}

              {searchResults.models.length > 0 && (
                <section className="catalog-mobile-fitment-group">
                  <p className="catalog-mobile-fitment-group-title">{labels.modelResult}</p>
                  {searchResults.models.map((model) => {
                    const active = selectedVehicleModelId === model.id;
                    return (
                      <button
                        key={`model-${model.id}`}
                        type="button"
                        className={`catalog-mobile-fitment-row${active ? " catalog-mobile-fitment-row--active" : ""}`}
                        onClick={() => selectModel(model.id)}
                      >
                        <span className="min-w-0">
                          <span className="block truncate">{modelLabel(model, brandsById)}</span>
                          <span className="catalog-mobile-fitment-row-hint">
                            {model.brand?.name ?? brandsById.get(model.vehicle_brand_id)?.name ?? labels.brandTab}
                          </span>
                        </span>
                        {active && <Check size={18} className="shrink-0 text-[var(--site-accent)]" aria-hidden />}
                      </button>
                    );
                  })}
                </section>
              )}

              {searchResults.engines.length > 0 && (
                <section className="catalog-mobile-fitment-group">
                  <p className="catalog-mobile-fitment-group-title">{labels.codeResult}</p>
                  {searchResults.engines.map((row) => {
                    const active = selectedEngineFamilyId === row.id;
                    return (
                      <button
                        key={`engine-${row.id}`}
                        type="button"
                        className={`catalog-mobile-fitment-row${active ? " catalog-mobile-fitment-row--active" : ""}`}
                        onClick={() => selectEngine(row.id)}
                      >
                        <span className="min-w-0">
                          <span className="block truncate">{engineLabel(row)}</span>
                          {row.vehicle_models?.length ? (
                            <span className="catalog-mobile-fitment-row-hint">
                              {row.vehicle_models.slice(0, 2).map((model) => modelLabel(model, brandsById)).join(", ")}
                            </span>
                          ) : null}
                        </span>
                        {active && <Check size={18} className="shrink-0 text-[var(--site-accent)]" aria-hidden />}
                      </button>
                    );
                  })}
                </section>
              )}

              {!hasSearchResults && (
                <p className="px-4 py-10 text-center text-sm text-[var(--text-silver)]">{labels.emptyResults}</p>
              )}
            </>
          ) : tab === "brand" ? (
            selectedBrand ? (
              <>
                <button
                  type="button"
                  className="catalog-mobile-fitment-back-row"
                  onClick={() => selectBrand(null)}
                >
                  <ChevronLeft size={18} className="shrink-0" aria-hidden />
                  <span>{labels.backToBrands}</span>
                </button>
                <button
                  type="button"
                  className={`catalog-mobile-fitment-row${selectedVehicleModelId == null && selectedEngineFamilyId == null ? " catalog-mobile-fitment-row--active" : ""}`}
                  onClick={() => selectModel(null)}
                >
                  <span className="min-w-0">
                    <span className="block">{labels.allModels}</span>
                    <span className="catalog-mobile-fitment-row-hint">
                      {labels.allModelsForBrand.replace("{brand}", selectedBrand.name)}
                    </span>
                  </span>
                  {selectedVehicleModelId == null && selectedEngineFamilyId == null && (
                    <Check size={18} className="shrink-0 text-[var(--site-accent)]" aria-hidden />
                  )}
                </button>
                <p className="catalog-mobile-fitment-group-title">
                  {labels.modelsForBrand.replace("{brand}", selectedBrand.name)}
                </p>
                {modelsForSelectedBrand.map((model) => {
                  const active = selectedVehicleModelId === model.id;
                  return (
                    <button
                      key={model.id}
                      type="button"
                      className={`catalog-mobile-fitment-row${active ? " catalog-mobile-fitment-row--active" : ""}`}
                      onClick={() => selectModel(model.id)}
                    >
                      <span>{modelLabel(model, brandsById)}</span>
                      {active && <Check size={18} className="shrink-0 text-[var(--site-accent)]" aria-hidden />}
                    </button>
                  );
                })}
              </>
            ) : (
              <>
                <button
                  type="button"
                  className="catalog-mobile-fitment-row"
                  onClick={() => selectBrand(null)}
                >
                  <span>{labels.allBrands}</span>
                </button>
                {vehicleBrands.map((brand) => (
                  <button
                    key={brand.id}
                    type="button"
                    className="catalog-mobile-fitment-row"
                    onClick={() => selectBrand(brand.id)}
                  >
                    <span>{brand.name}</span>
                    <ChevronRight size={18} className="shrink-0 text-[var(--site-accent)]" aria-hidden />
                  </button>
                ))}
              </>
            )
          ) : (
            <>
              <button
                type="button"
                className={`catalog-mobile-fitment-row${selectedEngineFamilyId == null ? " catalog-mobile-fitment-row--active" : ""}`}
                onClick={() => selectEngine(null)}
              >
                <span>{labels.codeTab}: {labels.allModels}</span>
                {selectedEngineFamilyId == null && <Check size={18} className="shrink-0 text-[var(--site-accent)]" aria-hidden />}
              </button>
              {engineFamilies.map((row) => {
                const active = selectedEngineFamilyId === row.id;
                return (
                  <button
                    key={row.id}
                    type="button"
                    className={`catalog-mobile-fitment-row${active ? " catalog-mobile-fitment-row--active" : ""}`}
                    onClick={() => selectEngine(row.id)}
                  >
                    <span className="min-w-0">
                      <span className="block truncate">{engineLabel(row)}</span>
                      {row.vehicle_models?.length ? (
                        <span className="catalog-mobile-fitment-row-hint">
                          {row.vehicle_models.slice(0, 2).map((model) => modelLabel(model, brandsById)).join(", ")}
                        </span>
                      ) : null}
                    </span>
                    {active && <Check size={18} className="shrink-0 text-[var(--site-accent)]" aria-hidden />}
                  </button>
                );
              })}
            </>
          )}
        </div>
      </section>
    </div>,
    document.body,
  );
}
