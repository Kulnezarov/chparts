"use client";

import { useState } from "react";
import { ChevronDown, SlidersHorizontal } from "lucide-react";
import type { PublicCategory, PublicEngineFamily, PublicVehicleBrand, PublicVehicleModel } from "@/lib/publicApi";
import CatalogMobileCategorySheet from "./CatalogMobileCategorySheet";
import CatalogMobileFitmentSheet from "./CatalogMobileFitmentSheet";

type PickerKey = "brand" | "model" | "category";

type Labels = {
  brand: string;
  model: string;
  category: string;
  noBrand: string;
  noCategory: string;
  all: string;
  allCategories: string;
  allBrands: string;
  allModels: string;
  allModelsForBrand: string;
  backToBrands: string;
  selectBrandFirst?: string;
  searchBrand: string;
  searchModel: string;
  searchFitment: string;
  searchCategory: string;
  vehicleFitment: string;
  codeIndex: string;
  chooseBrand: string;
  modelsForBrand: string;
  brandResult: string;
  modelResult: string;
  codeResult: string;
  wholeSection: string;
  categorySubcategories: string;
  emptyResults: string;
};

type Props = {
  labels: Labels;
  vehicleBrands: PublicVehicleBrand[];
  vehicleModels: PublicVehicleModel[];
  engineFamilies: PublicEngineFamily[];
  categories: PublicCategory[];
  vehicleBrandId: number | null;
  vehicleModelId: number | null;
  engineFamilyId: number | null;
  categoryId: number | null;
  onVehicleBrandChange: (id: number | null) => void;
  onVehicleModelChange: (id: number | null) => void;
  onEngineFamilyChange: (id: number | null) => void;
  onCategoryChange: (id: number | null) => void;
  onOpenAllFilters?: () => void;
  showModel?: boolean;
  /** Одна низкая строка фильтров (каталог на телефоне) */
  compact?: boolean;
};

function truncate(text: string, max = 14) {
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1)}…`;
}

export default function CatalogMobileFilterBar({
  labels,
  vehicleBrands,
  vehicleModels,
  engineFamilies,
  categories,
  vehicleBrandId,
  vehicleModelId,
  engineFamilyId,
  categoryId,
  onVehicleBrandChange,
  onVehicleModelChange,
  onEngineFamilyChange,
  onCategoryChange,
  onOpenAllFilters,
  showModel = true,
  compact = false,
}: Props) {
  const [picker, setPicker] = useState<PickerKey | null>(null);

  const brandLabel =
    vehicleBrandId != null
      ? vehicleBrands.find((o) => o.id === vehicleBrandId)?.name ?? labels.brand
      : labels.allBrands;

  const selectedVehicleModel = vehicleModelId != null ? vehicleModels.find((o) => o.id === vehicleModelId) : null;
  const selectedEngineFamily = engineFamilyId != null ? engineFamilies.find((o) => o.id === engineFamilyId) : null;
  const modelLabel = selectedVehicleModel?.name ?? selectedEngineFamily?.code ?? labels.allModels;

  const categoryLabel =
    categoryId != null
      ? categories.find((o) => o.id === categoryId)?.name ?? labels.category
      : labels.noCategory;

  const brandSelected = vehicleBrandId != null;
  const modelSelected = vehicleModelId != null || engineFamilyId != null;

  const pills: { key: PickerKey; short: string; value: string; active: boolean; disabled?: boolean }[] = [
    {
      key: "brand",
      short: labels.brand,
      value: truncate(brandLabel, compact ? 10 : 18),
      active: brandSelected,
    },
    {
      key: "model",
      short: labels.model,
      value: truncate(modelLabel, compact ? 8 : 16),
      active: modelSelected,
      disabled: !showModel,
    },
    {
      key: "category",
      short: labels.category,
      value: truncate(categoryLabel, compact ? 8 : 18),
      active: categoryId != null,
    },
  ];

  return (
    <>
      <div className={`lg:hidden ${compact ? "min-w-0 flex-1" : ""}`}>
        {!compact && (
          <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--text-silver)]">
            {labels.vehicleFitment}
          </p>
        )}
        <div
          className={`flex gap-1.5 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
            compact ? "min-w-0 flex-1" : "gap-2 pb-0.5"
          }`}
        >
          {pills.map((pill) => (
            <button
              key={pill.key}
              type="button"
              disabled={pill.disabled}
              aria-label={`${pill.short}: ${pill.value}`}
              onClick={() => {
                if (pill.disabled) return;
                setPicker(pill.key);
              }}
              className={`catalog-filter-pill${pill.active ? " catalog-filter-pill--active" : ""}${pill.disabled ? " opacity-50 cursor-not-allowed" : ""}${compact ? " catalog-filter-pill--compact" : ""}`}
            >
              <span className={`catalog-filter-pill-label${compact ? " sr-only" : ""}`}>{pill.short}</span>
              <span className="catalog-filter-pill-value">{pill.value}</span>
              <ChevronDown className="h-4 w-4 shrink-0 opacity-60" aria-hidden />
            </button>
          ))}
          {onOpenAllFilters && (
            <button type="button" onClick={onOpenAllFilters} className="catalog-filter-pill catalog-filter-pill--icon shrink-0">
              <SlidersHorizontal className="h-4 w-4" aria-hidden />
            </button>
          )}
        </div>
      </div>

      <CatalogMobileFitmentSheet
        open={picker === "brand" || picker === "model"}
        labels={{
          title: labels.vehicleFitment,
          brandTab: labels.brand,
          codeTab: labels.codeIndex,
          searchPlaceholder: labels.searchFitment,
          allBrands: labels.allBrands,
          allModels: labels.allModels,
          allModelsForBrand: labels.allModelsForBrand,
          backToBrands: labels.backToBrands,
          chooseBrand: labels.chooseBrand,
          modelsForBrand: labels.modelsForBrand,
          brandResult: labels.brandResult,
          modelResult: labels.modelResult,
          codeResult: labels.codeResult,
          emptyResults: labels.emptyResults,
        }}
        vehicleBrands={vehicleBrands}
        vehicleModels={vehicleModels}
        engineFamilies={engineFamilies}
        selectedVehicleBrandId={vehicleBrandId}
        selectedVehicleModelId={vehicleModelId}
        selectedEngineFamilyId={engineFamilyId}
        onSelectBrand={onVehicleBrandChange}
        onSelectModel={onVehicleModelChange}
        onSelectEngineFamily={onEngineFamilyChange}
        onClose={() => setPicker(null)}
      />

      <CatalogMobileCategorySheet
        open={picker === "category"}
        labels={{
          title: labels.category,
          allCategories: labels.allCategories,
          searchCategory: labels.searchCategory,
          wholeSection: labels.wholeSection,
          subcategories: labels.categorySubcategories,
          emptyResults: labels.emptyResults,
        }}
        categories={categories}
        selectedId={categoryId}
        onSelect={onCategoryChange}
        onClose={() => setPicker(null)}
      />
    </>
  );
}
