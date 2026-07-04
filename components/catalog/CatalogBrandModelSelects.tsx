"use client";

import type { PublicEngineFamily, PublicVehicleBrand, PublicVehicleModel } from "@/lib/publicApi";

type Labels = {
  brand: string;
  model: string;
  codeIndex: string;
  allBrands: string;
  allModels: string;
  all: string;
  selectBrandFirst?: string;
};

type Props = {
  labels: Labels;
  vehicleBrands: PublicVehicleBrand[];
  vehicleModels: PublicVehicleModel[];
  engineFamilies: PublicEngineFamily[];
  vehicleBrandId: number | null;
  vehicleModelId: number | null;
  engineFamilyId: number | null;
  onVehicleBrandChange: (id: number | null) => void;
  onVehicleModelChange: (id: number | null) => void;
  onEngineFamilyChange: (id: number | null) => void;
};

function stripBrandPrefix(modelName: string, brandName?: string | null) {
  if (!brandName) return modelName;
  const escaped = brandName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return modelName.replace(new RegExp(`^${escaped}\\s+`, "i"), "").trim() || modelName;
}

export default function CatalogBrandModelSelects({
  labels,
  vehicleBrands,
  vehicleModels,
  engineFamilies,
  vehicleBrandId,
  vehicleModelId,
  engineFamilyId,
  onVehicleBrandChange,
  onVehicleModelChange,
  onEngineFamilyChange,
}: Props) {
  const brandSelected = vehicleBrandId != null && !Number.isNaN(vehicleBrandId);
  const activeBrand = brandSelected ? vehicleBrands.find((brand) => brand.id === vehicleBrandId) : null;
  const modelsForBrand = brandSelected
    ? vehicleModels.filter((row) => row.vehicle_brand_id === vehicleBrandId)
    : [];
  const modelDisabled = !brandSelected;

  return (
    <div className="catalog-brand-model-bar">
      <label className="catalog-brand-model-field">
        <span className="filter-section-label">{labels.brand}</span>
        <select
          value={brandSelected ? String(vehicleBrandId) : ""}
          onChange={(e) => onVehicleBrandChange(e.target.value ? Number(e.target.value) : null)}
          className="input-catalog catalog-brand-model-select"
        >
          <option value="">{labels.allBrands}</option>
          {vehicleBrands.map((b) => (
            <option key={b.id} value={String(b.id)}>
              {b.name}
            </option>
          ))}
        </select>
      </label>

      <label className="catalog-brand-model-field">
        <span className="filter-section-label">{labels.model}</span>
        <select
          value={vehicleModelId != null && !Number.isNaN(vehicleModelId) ? String(vehicleModelId) : ""}
          disabled={modelDisabled}
          onChange={(e) => onVehicleModelChange(e.target.value ? Number(e.target.value) : null)}
          className="input-catalog catalog-brand-model-select disabled:cursor-not-allowed disabled:bg-[#f5f5f7] disabled:text-[color:var(--text-silver)]"
        >
          <option value="">
            {modelDisabled
              ? labels.selectBrandFirst ?? labels.allBrands
              : labels.allModels}
          </option>
          {brandSelected &&
            modelsForBrand.map((m) => (
              <option key={m.id} value={String(m.id)}>
                {stripBrandPrefix(m.name, activeBrand?.name)}
              </option>
            ))}
        </select>
      </label>

      <label className="catalog-brand-model-field">
        <span className="filter-section-label">{labels.codeIndex}</span>
        <select
          value={engineFamilyId != null && !Number.isNaN(engineFamilyId) ? String(engineFamilyId) : ""}
          onChange={(e) => onEngineFamilyChange(e.target.value ? Number(e.target.value) : null)}
          className="input-catalog catalog-brand-model-select"
        >
          <option value="">{labels.all}</option>
          {engineFamilies.map((family) => (
            <option key={family.id} value={String(family.id)}>
              {family.name?.trim() ? `${family.code} · ${family.name.trim()}` : family.code}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
