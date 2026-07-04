import type { PublicCategory } from "@/lib/publicApi";

/**
 * SkladPro: id < 10_000_000 — папка-группа (предкатегория),
 * id >= 10_000_000 — листовая категория из склада.
 * Когда бэкенд начнёт отдавать parent_id / level — используем их в приоритете.
 */
export const LEAF_CATEGORY_ID_MIN = 10_000_000;

export function isParentCategory(cat: Pick<PublicCategory, "id" | "level" | "parent_id">): boolean {
  if (cat.level === "parent" || cat.level === "group") return true;
  if (cat.level === "leaf" || cat.level === "item") return false;
  if (cat.parent_id != null) return false;
  return cat.id < LEAF_CATEGORY_ID_MIN;
}

export function isLeafCategory(cat: Pick<PublicCategory, "id" | "level" | "parent_id">): boolean {
  return !isParentCategory(cat);
}

export function sortCategoriesByName(categories: PublicCategory[]): PublicCategory[] {
  return [...categories].sort((a, b) => a.name.localeCompare(b.name, "ru"));
}

export function filterParentCategories(categories: PublicCategory[]): PublicCategory[] {
  return sortCategoriesByName(categories.filter(isParentCategory));
}

export function filterLeafCategories(categories: PublicCategory[]): PublicCategory[] {
  return sortCategoriesByName(categories.filter(isLeafCategory));
}

export function getChildCategories(categories: PublicCategory[], parentId: number): PublicCategory[] {
  const byParent = categories.filter((c) => c.parent_id === parentId);
  if (byParent.length) return sortCategoriesByName(byParent);
  return [];
}

function tokenizeCategoryName(name: string): string[] {
  return name
    .toLowerCase()
    .replace(/[^a-zа-яё0-9\s]/gi, " ")
    .split(/\s+/)
    .filter((t) => t.length >= 3);
}

function leafMatchesParent(leaf: PublicCategory, parent: PublicCategory): boolean {
  const leafName = leaf.name.toLowerCase();
  const parentName = parent.name.toLowerCase();
  if (leafName === parentName) return false;
  if (leafName.includes(parentName) || parentName.includes(leafName)) return true;

  const parentTokens = tokenizeCategoryName(parent.name);
  for (const token of parentTokens) {
    const stem = token.slice(0, Math.min(token.length, 7));
    if (stem.length >= 4 && leafName.includes(stem)) return true;
  }
  return false;
}

/** Карта раздел → подкатегории (parent_id с API или эвристика по имени). */
export function buildParentChildMap(categories: PublicCategory[]): Map<number, PublicCategory[]> {
  const parents = filterParentCategories(categories);
  const map = new Map<number, PublicCategory[]>();

  if (categoriesHaveParentLinks(categories)) {
    for (const parent of parents) {
      map.set(parent.id, getChildCategories(categories, parent.id));
    }
    return map;
  }

  const leaves = filterLeafCategories(categories);
  const assigned = new Set<number>();

  for (const parent of parents) {
    const kids = leaves.filter((leaf) => !assigned.has(leaf.id) && leafMatchesParent(leaf, parent));
    for (const kid of kids) assigned.add(kid.id);
    map.set(parent.id, sortCategoriesByName(kids));
  }

  return map;
}

export function categoriesHaveParentLinks(categories: PublicCategory[]): boolean {
  return categories.some((c) => c.parent_id != null);
}

export function resolveCategoryParentId(
  categories: PublicCategory[],
  categoryId: number | null,
): number | null {
  if (categoryId == null || Number.isNaN(categoryId)) return null;
  const cat = categories.find((c) => c.id === categoryId);
  if (!cat) return null;
  if (isParentCategory(cat)) return cat.id;
  return cat.parent_id ?? null;
}

export type CategoryTreeRow = {
  parent: PublicCategory;
  children: PublicCategory[];
  parentMatches: boolean;
  childMatches: boolean;
};

/** Дерево для аккордеона: разделы + подкатегории внутри папки. */
export function buildCategoryTree(categories: PublicCategory[], query = ""): CategoryTreeRow[] {
  const parents = filterParentCategories(categories);
  const childMap = buildParentChildMap(categories);
  const needle = query.trim().toLowerCase();

  return parents
    .map((parent) => {
      const children = childMap.get(parent.id) ?? [];
      const parentMatches = !needle || parent.name.toLowerCase().includes(needle);
      const childMatches =
        !needle || children.some((c) => c.name.toLowerCase().includes(needle));
      const filteredChildren =
        needle && !parentMatches
          ? children.filter((c) => c.name.toLowerCase().includes(needle))
          : children;

      return {
        parent,
        children: filteredChildren,
        parentMatches,
        childMatches: childMatches || parentMatches,
      };
    })
    .filter((row) => {
      if (!needle) return true;
      return row.parentMatches || row.childMatches;
    });
}

export function orphanLeafCategories(categories: PublicCategory[]): PublicCategory[] {
  if (categoriesHaveParentLinks(categories)) {
    return sortCategoriesByName(
      filterLeafCategories(categories).filter((c) => c.parent_id == null),
    );
  }
  return [];
}

const HOME_CATEGORY_KEYWORDS = [
  "амортизатор",
  "генератор",
  "стекл",
  "аккумулятор",
  "масл",
  "тормоз",
  "кузов",
  "фильтр",
  "электр",
  "подвеск",
  "двигател",
  "оптик",
];

/** Разделы для главной: только предкатегории, с приоритетом по ключевым словам. */
export function pickHomeCategories(categories: PublicCategory[], limit = 12): PublicCategory[] {
  const parents = filterParentCategories(categories);
  if (!parents.length) return sortCategoriesByName(categories).slice(0, limit);

  const picked: PublicCategory[] = [];
  const used = new Set<number>();

  for (const kw of HOME_CATEGORY_KEYWORDS) {
    if (picked.length >= limit) break;
    const match = parents.find((c) => !used.has(c.id) && c.name.toLowerCase().includes(kw));
    if (match) {
      picked.push(match);
      used.add(match.id);
    }
  }

  for (const cat of parents) {
    if (picked.length >= limit) break;
    if (!used.has(cat.id)) {
      picked.push(cat);
      used.add(cat.id);
    }
  }

  return picked;
}

export type CategoryFilterOption = { id: number; name: string };

export type CategoryFilterGroup = {
  label: string;
  options: CategoryFilterOption[];
};

export function buildCategoryFilterGroups(
  categories: PublicCategory[],
  labels: { parentGroups: string; subcategories: string },
): CategoryFilterGroup[] {
  const parents = filterParentCategories(categories);
  const leaves = filterLeafCategories(categories);
  const groups: CategoryFilterGroup[] = [];

  if (parents.length) {
    groups.push({
      label: labels.parentGroups,
      options: parents.map((c) => ({ id: c.id, name: c.name })),
    });
  }
  if (leaves.length) {
    groups.push({
      label: labels.subcategories,
      options: leaves.map((c) => ({ id: c.id, name: c.name })),
    });
  }

  return groups;
}

/** Плоский список для мобильного пикера: сначала группы, потом подкатегории с отступом. */
export function buildCategoryFilterFlatList(categories: PublicCategory[]): CategoryFilterOption[] {
  const parents = filterParentCategories(categories);
  const leaves = filterLeafCategories(categories);
  const rows: CategoryFilterOption[] = parents.map((c) => ({ id: c.id, name: c.name }));

  for (const leaf of leaves) {
    rows.push({ id: leaf.id, name: `· ${leaf.name}` });
  }

  if (!rows.length) {
    return sortCategoriesByName(categories).map((c) => ({ id: c.id, name: c.name }));
  }

  return rows;
}

/** Краткая строка подкатегорий для карточек на главной. */
export function formatSubcategoryPreview(
  children: PublicCategory[],
  maxItems = 3,
): string | null {
  if (!children.length) return null;
  const names = children.slice(0, maxItems).map((c) => c.name.trim());
  const rest = children.length - names.length;
  if (rest > 0) return `${names.join(", ")} +${rest}`;
  return names.join(", ");
}

type IconRule = { keys: string[]; tone: string };

const ICON_RULES: IconRule[] = [
  { keys: ["масл", "жидкост"], tone: "oil" },
  { keys: ["аккумулятор", "батаре"], tone: "battery" },
  { keys: ["тормоз", "колод"], tone: "brake" },
  { keys: ["амортизатор", "пружин", "подвеск", "рычаг"], tone: "suspension" },
  { keys: ["стекл", "оптик", "фар", "зеркал"], tone: "glass" },
  { keys: ["кузов", "бампер", "двер", "капот"], tone: "body" },
  { keys: ["фильтр"], tone: "filter" },
  { keys: ["электр", "генератор", "стартер", "провод", "датчик"], tone: "electric" },
  { keys: ["двигател", "грм", "помп", "распред"], tone: "engine" },
  { keys: ["рулев", "рейк"], tone: "steering" },
  { keys: ["шин", "диск", "колес"], tone: "wheel" },
  { keys: ["радиатор", "охлажд", "термостат"], tone: "cooling" },
  { keys: ["выхлоп", "глушит"], tone: "exhaust" },
  { keys: ["салон", "коврик", "бордач"], tone: "interior" },
  { keys: ["блок", "эбу", "управлен"], tone: "ecu" },
];

export type CategoryVisualTone =
  | "oil"
  | "battery"
  | "brake"
  | "suspension"
  | "glass"
  | "body"
  | "filter"
  | "electric"
  | "engine"
  | "steering"
  | "wheel"
  | "cooling"
  | "exhaust"
  | "interior"
  | "ecu"
  | "default";

export function categoryVisualTone(name: string): CategoryVisualTone {
  const lower = name.toLowerCase();
  for (const rule of ICON_RULES) {
    if (rule.keys.some((key) => lower.includes(key))) return rule.tone as CategoryVisualTone;
  }
  return "default";
}
