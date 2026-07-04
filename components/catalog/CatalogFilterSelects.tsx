"use client";

export type FilterSelectOption = { id: number; name: string };

export type FilterSelectGroup = {
  label: string;
  options: FilterSelectOption[];
};

type Labels = {
  category: string;
  brand: string;
  model: string;
  noCategory: string;
  noBrand: string;
  all: string;
  selectBrandFirst?: string;
};

type Props = {
  labels: Labels;
  categories: FilterSelectOption[];
  categoryGroups?: FilterSelectGroup[];
  brands: FilterSelectOption[];
  modelOptions: string[];
  categoryId: number | null;
  brandId: number | null;
  model: string;
  onCategoryChange: (id: number | null) => void;
  onBrandChange: (id: number | null) => void;
  onModelChange: (value: string | null) => void;
  layout?: "vertical" | "horizontal";
};

export default function CatalogFilterSelects({
  labels,
  categories,
  categoryGroups,
  brands,
  modelOptions,
  categoryId,
  brandId,
  model,
  onCategoryChange,
  onBrandChange,
  onModelChange,
  layout = "vertical",
}: Props) {
  const brandSelected = brandId != null && !Number.isNaN(brandId);
  const modelDisabled = !brandSelected;
  const horizontal = layout === "horizontal";

  const wrapClass = horizontal
    ? "grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-3"
    : "space-y-3";

  const fieldClass = "block min-w-0";

  return (
    <div className={wrapClass}>
      <label className={fieldClass}>
        <span className="filter-section-label">{labels.brand}</span>
        <select
          value={brandSelected ? String(brandId) : ""}
          onChange={(e) => onBrandChange(e.target.value ? Number(e.target.value) : null)}
          className="input-catalog mt-1.5 h-11 w-full text-[15px]"
        >
          <option value="">{labels.noBrand}</option>
          {brands.map((b) => (
            <option key={b.id} value={String(b.id)}>
              {b.name}
            </option>
          ))}
        </select>
      </label>

      <label className={fieldClass}>
        <span className="filter-section-label">{labels.model}</span>
        <select
          value={model}
          disabled={modelDisabled}
          onChange={(e) => onModelChange(e.target.value || null)}
          className="input-catalog mt-1.5 h-11 w-full text-[15px] disabled:cursor-not-allowed disabled:bg-[#f5f5f7] disabled:text-[color:var(--text-silver)]"
        >
          <option value="">
            {modelDisabled
              ? labels.selectBrandFirst ?? labels.noBrand
              : modelOptions.length === 0
                ? labels.all
                : labels.all}
          </option>
          {brandSelected &&
            modelOptions.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
        </select>
      </label>

      <label className={fieldClass}>
        <span className="filter-section-label">{labels.category}</span>
        <select
          value={categoryId != null && !Number.isNaN(categoryId) ? String(categoryId) : ""}
          onChange={(e) => onCategoryChange(e.target.value ? Number(e.target.value) : null)}
          className="input-catalog mt-1.5 h-11 w-full text-[15px]"
        >
          <option value="">{labels.noCategory}</option>
          {categoryGroups && categoryGroups.length > 0
            ? categoryGroups.map((group) => (
                <optgroup key={group.label} label={group.label}>
                  {group.options.map((c) => (
                    <option key={c.id} value={String(c.id)}>
                      {c.name}
                    </option>
                  ))}
                </optgroup>
              ))
            : categories.map((c) => (
                <option key={c.id} value={String(c.id)}>
                  {c.name}
                </option>
              ))}
        </select>
      </label>
    </div>
  );
}
