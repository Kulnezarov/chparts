"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useLang } from "@/lib/useLang";
import {
  buildIdNameMap,
  fetchPublicBrands,
  fetchPublicCategories,
  fetchPublicEngineFamilies,
  fetchPublicProductsPage,
  fetchPublicVehicleBrands,
  fetchPublicVehicleModels,
  type PublicBrand,
  type PublicCategory,
  type PublicEngineFamily,
  type PublicProduct,
  type PublicProductSort,
  type PublicVehicleBrand,
  type PublicVehicleModel,
} from "@/lib/publicApi";
import { ChevronRight, Home, SlidersHorizontal, X, MessageCircle } from "lucide-react";
import { siteWhatsAppHrefWithText } from "@/lib/siteContacts";
import { useCartStore } from "@/store/cartStore";
import { cartExtrasFromProduct } from "@/lib/cartProductMeta";
import { useToastStore } from "@/store/toastStore";
import { t, tr } from "@/lib/i18n";
import CatalogBrandModelSelects from "@/components/catalog/CatalogBrandModelSelects";
import CatalogDesktopFilterPanel, {
  readCatalogFilterOpen,
  writeCatalogFilterOpen,
} from "@/components/catalog/CatalogDesktopFilterPanel";
import CatalogMobileFilterBar from "@/components/catalog/CatalogMobileFilterBar";
import CatalogMobileSearch from "@/components/catalog/CatalogMobileSearch";
import CatalogDesktopSearch from "@/components/catalog/CatalogDesktopSearch";
import CatalogProductCard from "@/components/catalog/CatalogProductCard";
import {
  ProductCardGridSkeleton,
  ProductCardSkeleton,
  SlowLoadingHint,
  TopLoadingBar,
} from "@/components/ui/Skeleton";
import { useScrollChrome } from "@/lib/ScrollChromeContext";
import {
  hasStoredCatalogFitment,
  readStoredCatalogFitment,
  syncStoredCatalogFitmentFromParams,
} from "@/lib/catalogFitmentStorage";
const PAGE_SIZE = 30;

const SORT_VALUES: PublicProductSort[] = [
  "default",
  "price_asc",
  "price_desc",
  "name_asc",
  "name_desc",
];

function CatalogPageContent() {
  const lang = useLang();
  const router = useRouter();
  const searchParams = useSearchParams();

  const query = searchParams.get("q") || "";
  const categoryId = searchParams.get("cat") ? Number(searchParams.get("cat")) : null;
  const brandId = searchParams.get("brand") ? Number(searchParams.get("brand")) : null;
  const model = searchParams.get("model") || "";
  const vehicleBrandId = searchParams.get("vehicle_brand") ? Number(searchParams.get("vehicle_brand")) : null;
  const vehicleModelId = searchParams.get("vehicle_model") ? Number(searchParams.get("vehicle_model")) : null;
  const engineFamilyId = searchParams.get("engine_family") ? Number(searchParams.get("engine_family")) : null;
  const sortRaw = searchParams.get("sort");
  const sort: PublicProductSort =
    sortRaw && SORT_VALUES.includes(sortRaw as PublicProductSort) ? (sortRaw as PublicProductSort) : "default";

  const addItem = useCartStore((s) => s.addItem);
  const showToast = useToastStore((s) => s.show);
  const [searchValue, setSearchValue] = useState(query);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [activeSuggestionIdx, setActiveSuggestionIdx] = useState(-1);
  const [products, setProducts] = useState<PublicProduct[]>([]);
  const [categories, setCategories] = useState<PublicCategory[]>([]);
  const [brands, setBrands] = useState<PublicBrand[]>([]);
  const [vehicleBrands, setVehicleBrands] = useState<PublicVehicleBrand[]>([]);
  const [vehicleModels, setVehicleModels] = useState<PublicVehicleModel[]>([]);
  const [engineFamilies, setEngineFamilies] = useState<PublicEngineFamily[]>([]);
  const [categoryById, setCategoryById] = useState<Map<number, string>>(new Map());
  const [brandById, setBrandById] = useState<Map<number, string>>(new Map());
  const [isLoading, setIsLoading] = useState(true);
  const [loadMorePending, setLoadMorePending] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [productsTotal, setProductsTotal] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const productsCacheRef = useRef<Map<string, { products: PublicProduct[]; hasMore: boolean; total: number }>>(new Map());
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const prevFilterKeyRef = useRef("");
  const productsRef = useRef(products);
  const hasMoreRef = useRef(hasMore);
  const totalRef = useRef(productsTotal);
  const isLoadingRef = useRef(isLoading);
  const loadMorePendingRef = useRef(loadMorePending);
  const fitmentRestoredRef = useRef(false);
  productsRef.current = products;
  hasMoreRef.current = hasMore;
  totalRef.current = productsTotal;
  isLoadingRef.current = isLoading;
  loadMorePendingRef.current = loadMorePending;
  const [searchFocused, setSearchFocused] = useState(false);
  const [filterUserOpen, setFilterUserOpen] = useState(true);

  useEffect(() => {
    setFilterUserOpen(readCatalogFilterOpen());
  }, []);

  const chromeHidden = useScrollChrome();
  const filterPanelOpen = filterUserOpen;

  useEffect(() => {
    setSearchValue(query);
  }, [query]);

  useEffect(() => {
    setActiveSuggestionIdx(-1);
  }, [suggestions]);

  const pushParams = useCallback(
    (updates: Record<string, string | null | undefined>) => {
      const p = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value === null || value === undefined || value === "") {
          p.delete(key);
        } else {
          p.set(key, value);
        }
      }
      if ("vehicle_brand" in updates || "vehicle_model" in updates || "engine_family" in updates) {
        syncStoredCatalogFitmentFromParams(p);
      }
      router.push(`/catalog${p.toString() ? `?${p.toString()}` : ""}`);
    },
    [router, searchParams],
  );

  useEffect(() => {
    if (fitmentRestoredRef.current) return;
    fitmentRestoredRef.current = true;

    const current = new URLSearchParams(searchParams.toString());
    if (current.has("vehicle_brand") || current.has("vehicle_model") || current.has("engine_family")) {
      syncStoredCatalogFitmentFromParams(current);
      return;
    }

    const stored = readStoredCatalogFitment();
    if (!hasStoredCatalogFitment(stored)) return;

    pushParams({
      vehicle_brand: stored?.vehicle_brand ?? null,
      vehicle_model: stored?.vehicle_model ?? null,
      engine_family: stored?.engine_family ?? null,
    });
  }, [pushParams, searchParams]);

  const filterKey = useMemo(() => {
    const cat = categoryId != null && !Number.isNaN(categoryId) ? String(categoryId) : "";
    const brand = brandId != null && !Number.isNaN(brandId) ? String(brandId) : "";
    const vehicleBrand = vehicleBrandId != null && !Number.isNaN(vehicleBrandId) ? String(vehicleBrandId) : "";
    const vehicleModel = vehicleModelId != null && !Number.isNaN(vehicleModelId) ? String(vehicleModelId) : "";
    const engineFamily = engineFamilyId != null && !Number.isNaN(engineFamilyId) ? String(engineFamilyId) : "";
    return [query || "", cat, brand, model || "", vehicleBrand, vehicleModel, engineFamily, sort].join("|");
  }, [query, categoryId, brandId, model, vehicleBrandId, vehicleModelId, engineFamilyId, sort]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [cats, brs, vehicleBrs, vehicleMods, engineCodes] = await Promise.all([
          fetchPublicCategories(),
          fetchPublicBrands(),
          fetchPublicVehicleBrands(),
          fetchPublicVehicleModels(),
          fetchPublicEngineFamilies(),
        ]);
        if (cancelled) return;
        setCategories(cats);
        setBrands(brs);
        setVehicleBrands(vehicleBrs);
        setVehicleModels(vehicleMods);
        setEngineFamilies(engineCodes);
        setCategoryById(buildIdNameMap(cats));
        setBrandById(buildIdNameMap(brs));
      } catch {
        /* справочники не блокируют каталог */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    if (prevFilterKeyRef.current && prevFilterKeyRef.current !== filterKey) {
      productsCacheRef.current.set(prevFilterKeyRef.current, {
        products: productsRef.current,
        hasMore: hasMoreRef.current,
        total: totalRef.current,
      });
    }
    prevFilterKeyRef.current = filterKey;

    const cached = productsCacheRef.current.get(filterKey);
    if (cached) {
      setProducts(cached.products);
      setHasMore(cached.hasMore);
      setProductsTotal(cached.total);
      setIsLoading(false);
      setError(null);
      return;
    }

    const load = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const pageData = await fetchPublicProductsPage({
          q: query || undefined,
          page: 1,
          pageSize: PAGE_SIZE,
          categoryId: categoryId != null && !Number.isNaN(categoryId) ? categoryId : null,
          brandId: brandId != null && !Number.isNaN(brandId) ? brandId : null,
          model: model || undefined,
          vehicleBrandId: vehicleBrandId != null && !Number.isNaN(vehicleBrandId) ? vehicleBrandId : null,
          vehicleModelId: vehicleModelId != null && !Number.isNaN(vehicleModelId) ? vehicleModelId : null,
          engineFamilyId: engineFamilyId != null && !Number.isNaN(engineFamilyId) ? engineFamilyId : null,
          sort: sort !== "default" ? sort : undefined,
        });
        if (cancelled) return;
        const items = pageData.items;
        const total = pageData.total ?? 0;
        const nextHasMore = total > 0 ? items.length < total : items.length >= PAGE_SIZE;
        setProducts(items);
        setHasMore(nextHasMore);
        setProductsTotal(total);
        productsCacheRef.current.set(filterKey, { products: items, hasMore: nextHasMore, total });
      } catch {
        if (!cancelled) {
          setError(lang === "ru" ? "Не удалось загрузить товары" : lang === "kz" ? "Тауарларды жүктеу мүмкін болмады" : "Failed to load products");
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [filterKey, query, categoryId, brandId, model, vehicleBrandId, vehicleModelId, engineFamilyId, sort, lang]);

  useEffect(() => {
    const q = searchValue.trim();
    if (q.length < 2) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setSuggestionsLoading(true);
        const result = await fetchPublicProductsPage({
          q,
          page: 1,
          pageSize: 8,
          categoryId: categoryId != null && !Number.isNaN(categoryId) ? categoryId : null,
          brandId: brandId != null && !Number.isNaN(brandId) ? brandId : null,
          model: model || undefined,
          vehicleBrandId: vehicleBrandId != null && !Number.isNaN(vehicleBrandId) ? vehicleBrandId : null,
          vehicleModelId: vehicleModelId != null && !Number.isNaN(vehicleModelId) ? vehicleModelId : null,
          engineFamilyId: engineFamilyId != null && !Number.isNaN(engineFamilyId) ? engineFamilyId : null,
        });
        const pool = new Set<string>();
        const lowerQ = q.toLowerCase();
        const addMatchingSuggestion = (value: string | null | undefined) => {
          const text = value?.trim();
          if (!text || !text.toLowerCase().includes(lowerQ)) return;
          pool.add(text);
        };
        for (const p of result.items) {
          addMatchingSuggestion(p.name);
          addMatchingSuggestion(p.category_name);
          addMatchingSuggestion(p.article_oem);
          addMatchingSuggestion(p.sku);
        }
        setSuggestions(Array.from(pool).slice(0, 8));
      } catch {
        setSuggestions([]);
      } finally {
        setSuggestionsLoading(false);
      }
    }, 220);

    return () => clearTimeout(timer);
  }, [searchValue, categoryId, brandId, model, vehicleBrandId, vehicleModelId, engineFamilyId]);

  const labels = {
    ru: {
      title: "Каталог",
      search: "Поиск по названию, артикулу, OEM и категории",
      placeholder: "Название, OEM, артикул, категория...",
      placeholderShort: "Поиск…",
      find: "Найти",
      loading: "Загрузка...",
      clear: "Сбросить фильтры",
      showing: "Показано",
      of: "из",
      items: "товаров",
      filters: "Фильтры",
      brand: "Марка",
      model: "Модель",
      category: "Категория",
      sort: "Сортировка",
      sortDefault: "По умолчанию",
      sortPriceAsc: "Цена ↑",
      sortPriceDesc: "Цена ↓",
      sortNameAsc: "Название А-Я",
      sortNameDesc: "Название Я-А",
      all: "Все",
      inStock: "В наличии",
      outStock: "Нет в наличии",
      noCategory: "Все категории",
      noBrand: "Все марки",
      oem: "Артикул / OEM",
      oemEmpty: "—",
      noImage: "Фото скоро появится",
      loadMore: "Загрузить еще",
      loadingMore: "Загрузка...",
      helpPick: "Помочь с подбором",
      empty: "Товары не найдены",
      suggestions: "Варианты",
      noSuggestions: "Совпадений нет",
      retry: "Повторить",
      reset: "Сбросить поиск",
      activeFilters: "Активные фильтры",
      home: "Главная",
      applyFilters: "Готово",
      vehicleFitment: "Подбор по авто",
      searchBrand: "Найти марку…",
      searchModel: "Найти модель…",
      searchFitment: "Марка, модель, код...",
      codeIndex: "Код/индекс",
      allBrands: "Все марки",
      allModels: "Все модели",
      allModelsForBrand: "Показать все модели {brand}",
      backToBrands: "Назад к маркам",
      chooseBrand: "Выберите марку",
      modelsForBrand: "Модели {brand}",
      brandResult: "Марки",
      modelResult: "Модели",
      codeResult: "Коды / индексы",
      modelHelper: "Можно выбрать короткий код двигателя/модели или полное название авто.",
      allModelsDescription: "Показать все товары выбранной марки",
      searchCategory: "Найти категорию…",
      searchShort: "Поиск",
      emptyPicker: "Ничего не найдено",
      selectBrandFirst: "Сначала выберите марку",
      categoryParentGroups: "Разделы",
      categorySubcategories: "Подкатегории",
      hideFilters: "Скрыть",
      showFilters: "Фильтры",
      wholeSection: "Весь раздел",
      allCategories: "Все категории",
      categoriesTitle: "Категории",
    },
    kz: {
      title: "Каталог",
      search: "Атауы, артикул, OEM және санат бойынша іздеу",
      placeholder: "Атауы, OEM, артикул, санат...",
      placeholderShort: "Іздеу…",
      find: "Іздеу",
      loading: "Жүктелуде...",
      clear: "Сүзгілерді тазалау",
      showing: "Көрсетілді",
      of: "ішінен",
      items: "тауар",
      filters: "Сүзгілер",
      brand: "Марка",
      model: "Модель",
      category: "Санат",
      sort: "Сұрыптау",
      sortDefault: "Әдепкі",
      sortPriceAsc: "Баға ↑",
      sortPriceDesc: "Баға ↓",
      sortNameAsc: "Атауы А-Я",
      sortNameDesc: "Атауы Я-А",
      all: "Барлығы",
      inStock: "Қолда бар",
      outStock: "Қолда жоқ",
      noCategory: "Барлық санаттар",
      noBrand: "Барлық маркалар",
      oem: "Артикул / OEM",
      oemEmpty: "—",
      noImage: "Фото жақында қосылады",
      loadMore: "Тағы жүктеу",
      loadingMore: "Жүктелуде...",
      helpPick: "Таңдауға көмектесу",
      empty: "Тауарлар табылмады",
      suggestions: "Нұсқалар",
      noSuggestions: "Сәйкестік жоқ",
      retry: "Қайталау",
      reset: "Іздеуді тазалау",
      activeFilters: "Белсенді сүзгілер",
      home: "Басты бет",
      applyFilters: "Дайын",
      vehicleFitment: "Авто бойынша",
      searchBrand: "Марканы іздеу…",
      searchModel: "Модельді іздеу…",
      searchFitment: "Марка, модель, код...",
      codeIndex: "Код/индекс",
      allBrands: "Барлық маркалар",
      allModels: "Барлық модельдер",
      allModelsForBrand: "{brand} барлық модельдерін көрсету",
      backToBrands: "Маркаларға оралу",
      chooseBrand: "Марканы таңдаңыз",
      modelsForBrand: "{brand} модельдері",
      brandResult: "Маркалар",
      modelResult: "Модельдер",
      codeResult: "Кодтар / индекстер",
      modelHelper: "Қысқа қозғалтқыш/модель кодын немесе толық авто атауын таңдауға болады.",
      allModelsDescription: "Таңдалған марканың барлық тауарларын көрсету",
      searchCategory: "Санатты іздеу…",
      searchShort: "Іздеу",
      emptyPicker: "Ештеңе табылмады",
      selectBrandFirst: "Алдымен марканы таңдаңыз",
      categoryParentGroups: "Бөлімдер",
      categorySubcategories: "Ішкі санаттар",
      hideFilters: "Жабу",
      showFilters: "Сүзгілер",
      wholeSection: "Бүкіл бөлім",
      allCategories: "Барлық санаттар",
      categoriesTitle: "Санаттар",
    },
    uz: {
      title: "Katalog",
      search: "Nomi, artikul, OEM va kategoriya bo'yicha izlash",
      placeholder: "Nomi, OEM, artikul, kategoriya...",
      placeholderShort: "Izlash…",
      find: "Izlash",
      loading: "Yuklanmoqda...",
      clear: "Filtrlarni tozalash",
      showing: "Ko'rsatildi",
      of: "dan",
      items: "mahsulot",
      filters: "Filtrlar",
      brand: "Marka",
      model: "Model",
      category: "Kategoriya",
      sort: "Saralash",
      sortDefault: "Standart",
      sortPriceAsc: "Narx ↑",
      sortPriceDesc: "Narx ↓",
      sortNameAsc: "Nomi A-Ya",
      sortNameDesc: "Nomi Ya-A",
      all: "Hammasi",
      inStock: "Bor",
      outStock: "Yo'q",
      noCategory: "Barcha kategoriyalar",
      noBrand: "Barcha markalar",
      oem: "Artikul / OEM",
      oemEmpty: "—",
      noImage: "Foto tez orada",
      loadMore: "Yana yuklash",
      loadingMore: "Yuklanmoqda...",
      helpPick: "Tanlashda yordam",
      empty: "Mahsulot topilmadi",
      suggestions: "Variantlar",
      noSuggestions: "Moslik yo'q",
      retry: "Qayta urinish",
      reset: "Izlashni tozalash",
      activeFilters: "Faol filtrlar",
      home: "Bosh sahifa",
      applyFilters: "Tayyor",
      vehicleFitment: "Avto bo'yicha",
      searchBrand: "Markani izlash…",
      searchModel: "Modelni izlash…",
      searchFitment: "Marka, model, kod...",
      codeIndex: "Kod/indeks",
      allBrands: "Barcha markalar",
      allModels: "Barcha modellar",
      allModelsForBrand: "{brand} barcha modellarini ko'rsatish",
      backToBrands: "Markalarga qaytish",
      chooseBrand: "Markani tanlang",
      modelsForBrand: "{brand} modellari",
      brandResult: "Markalar",
      modelResult: "Modellar",
      codeResult: "Kodlar / indekslar",
      modelHelper: "Qisqa dvigatel/model kodi yoki to'liq avtomobil nomini tanlash mumkin.",
      allModelsDescription: "Tanlangan markaning barcha mahsulotlarini ko'rsatish",
      searchCategory: "Kategoriyani izlash…",
      searchShort: "Izlash",
      emptyPicker: "Hech narsa topilmadi",
      selectBrandFirst: "Avval markani tanlang",
      categoryParentGroups: "Bo'limlar",
      categorySubcategories: "Ichki kategoriyalar",
      hideFilters: "Yopish",
      showFilters: "Filtrlar",
      wholeSection: "Butun bo'lim",
      allCategories: "Barcha kategoriyalar",
      categoriesTitle: "Kategoriyalar",
    },
  }[lang];

  const hasFilters =
    Boolean(query) ||
    (categoryId != null && !Number.isNaN(categoryId)) ||
    (brandId != null && !Number.isNaN(brandId)) ||
    (vehicleBrandId != null && !Number.isNaN(vehicleBrandId)) ||
    (vehicleModelId != null && !Number.isNaN(vehicleModelId)) ||
    (engineFamilyId != null && !Number.isNaN(engineFamilyId)) ||
    Boolean(model) ||
    sort !== "default";

  const activeCategoryName =
    categoryId != null && !Number.isNaN(categoryId)
      ? categories.find((c) => c.id === categoryId)?.name ?? `#${categoryId}`
      : null;

  const categoryLabel = (p: PublicProduct) => {
    if (p.category_name?.trim()) return p.category_name.trim();
    if (p.category_id != null && categoryById.has(p.category_id)) return categoryById.get(p.category_id)!;
    if (p.category_id != null) return `#${p.category_id}`;
    return labels.noCategory;
  };

  const brandLabel = (p: PublicProduct) => {
    if (p.brand?.trim()) return p.brand.trim();
    if (p.brand_name?.trim()) return p.brand_name.trim();
    if (p.brand_id != null && brandById.has(p.brand_id)) return brandById.get(p.brand_id)!;
    if (p.brand_id != null) return `#${p.brand_id}`;
    return "—";
  };

  const activeBrandName =
    brandId != null && !Number.isNaN(brandId)
      ? brands.find((b) => b.id === brandId)?.name ?? null
      : null;

  const activeVehicleBrandName =
    vehicleBrandId != null && !Number.isNaN(vehicleBrandId)
      ? vehicleBrands.find((b) => b.id === vehicleBrandId)?.name ?? null
      : null;

  const activeVehicleModelName =
    vehicleModelId != null && !Number.isNaN(vehicleModelId)
      ? vehicleModels.find((m) => m.id === vehicleModelId)?.name ?? null
      : null;

  const activeEngineFamilyName =
    engineFamilyId != null && !Number.isNaN(engineFamilyId)
      ? engineFamilies.find((e) => e.id === engineFamilyId)?.code ?? null
      : null;
  const activeVehicleName = activeVehicleModelName || activeVehicleBrandName || activeEngineFamilyName;

  const pageHeading = useMemo(() => {
    if (activeCategoryName) return activeCategoryName;
    if (activeVehicleName) {
      return lang === "ru" ? `Запчасти ${activeVehicleName}` : lang === "kz" ? `${activeVehicleName} бөлшектері` : `${activeVehicleName} parts`;
    }
    if (activeBrandName) {
      return lang === "ru" ? `Запчасти ${activeBrandName}` : lang === "kz" ? `${activeBrandName} бөлшектері` : `${activeBrandName} parts`;
    }
    return labels.title;
  }, [activeCategoryName, activeBrandName, activeVehicleName, lang, labels.title]);

  const pageLead = useMemo(() => {
    if (activeCategoryName) {
      return lang === "ru"
        ? `Автозапчасти в категории «${activeCategoryName}». Актуальные цены и наличие, доставка по Казахстану.`
        : lang === "kz"
          ? `«${activeCategoryName}» санатындағы бөлшектер. Бағалар мен қолжетімділік, Қазақстан бойынша жеткізу.`
          : `Parts in «${activeCategoryName}». Live prices and stock, delivery across Kazakhstan.`;
    }
    if (activeBrandName) {
      return lang === "ru"
        ? `Оригинал и проверенные аналоги для ${activeBrandName}. Подбор по OEM, консультация в WhatsApp.`
        : lang === "kz"
          ? `${activeBrandName} үшін түпнұсқа және сәйкес өнімдер. OEM бойынша іріктеу.`
          : `OEM and vetted alternatives for ${activeBrandName}. WhatsApp support available.`;
    }
    return null;
  }, [activeCategoryName, activeBrandName, lang]);

  const emptyWhatsAppHref = siteWhatsAppHrefWithText(
    lang === "ru"
      ? `Здравствуйте! Не нашёл на сайте: ${query || activeCategoryName || activeVehicleName || activeBrandName || "запчасть"}. Артикул: `
      : lang === "kz"
        ? `Сәлеметсіз бе! Сайтта таппадым: ${query || activeCategoryName || activeVehicleName || activeBrandName || "бөлшек"}. Артикул: `
        : `Hello! Not found on site: ${query || activeCategoryName || activeVehicleName || activeBrandName || "part"}. Part number: `,
  );

  const resolvedCategoryId = categoryId != null && !Number.isNaN(categoryId) ? categoryId : null;

  const displayedProducts = useMemo(() => {
    const list = [...products];
    switch (sort) {
      case "price_asc":
        return list.sort((a, b) => a.sale_price - b.sale_price);
      case "price_desc":
        return list.sort((a, b) => b.sale_price - a.sale_price);
      case "name_asc":
        return list.sort((a, b) => a.name.localeCompare(b.name));
      case "name_desc":
        return list.sort((a, b) => b.name.localeCompare(a.name));
      default:
        return list.sort((a, b) => Number(b.quantity > 0) - Number(a.quantity > 0));
    }
  }, [products, sort]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = searchValue.trim();
    pushParams({ q: trimmed || null });
  };

  const applySuggestion = (value: string) => {
    setSearchValue(value);
    setSuggestionsOpen(false);
    pushParams({ q: value || null });
  };

  const highlightMatch = (text: string, needle: string) => {
    const n = needle.trim();
    if (!n) return text;
    const lowerText = text.toLowerCase();
    const lowerNeedle = n.toLowerCase();
    const idx = lowerText.indexOf(lowerNeedle);
    if (idx < 0) return text;
    const before = text.slice(0, idx);
    const match = text.slice(idx, idx + n.length);
    const after = text.slice(idx + n.length);
    return (
      <>
        {before}
        <mark className="rounded bg-[color:var(--site-accent)]/10 px-0.5 text-[color:var(--text-charcoal)]">{match}</mark>
        {after}
      </>
    );
  };

  const activeFilterChips = useMemo(() => {
    const chips: { key: string; label: string; onRemove: () => void }[] = [];
    if (query) chips.push({ key: "q", label: `Q: ${query}`, onRemove: () => pushParams({ q: null }) });
    if (brandId != null && !Number.isNaN(brandId)) {
      const label = brands.find((b) => b.id === brandId)?.name ?? `#${brandId}`;
      chips.push({ key: "brand", label: `${labels.brand}: ${label}`, onRemove: () => pushParams({ brand: null, model: null }) });
    }
    if (model) chips.push({ key: "model", label: `${labels.model}: ${model}`, onRemove: () => pushParams({ model: null }) });
    if (vehicleBrandId != null && !Number.isNaN(vehicleBrandId)) {
      const label = vehicleBrands.find((b) => b.id === vehicleBrandId)?.name ?? `#${vehicleBrandId}`;
      chips.push({
        key: "vehicle_brand",
        label: `${labels.brand}: ${label}`,
        onRemove: () => pushParams({ vehicle_brand: null, vehicle_model: null }),
      });
    }
    if (vehicleModelId != null && !Number.isNaN(vehicleModelId)) {
      const label = vehicleModels.find((m) => m.id === vehicleModelId)?.name ?? `#${vehicleModelId}`;
      chips.push({
        key: "vehicle_model",
        label: `${labels.model}: ${label}`,
        onRemove: () => pushParams({ vehicle_model: null }),
      });
    }
    if (engineFamilyId != null && !Number.isNaN(engineFamilyId)) {
      const label = engineFamilies.find((e) => e.id === engineFamilyId)?.code ?? `#${engineFamilyId}`;
      chips.push({
        key: "engine_family",
        label: `${labels.codeIndex}: ${label}`,
        onRemove: () => pushParams({ engine_family: null }),
      });
    }
    if (categoryId != null && !Number.isNaN(categoryId)) {
      const label = categories.find((c) => c.id === categoryId)?.name ?? `#${categoryId}`;
      chips.push({ key: "cat", label: `${labels.category}: ${label}`, onRemove: () => pushParams({ cat: null }) });
    }
    if (sort !== "default") chips.push({ key: "sort", label: `${labels.sort}`, onRemove: () => pushParams({ sort: null }) });
    return chips;
  }, [query, brandId, model, vehicleBrandId, vehicleModelId, engineFamilyId, categoryId, sort, brands, vehicleBrands, vehicleModels, engineFamilies, categories, labels.brand, labels.model, labels.category, labels.sort, labels.codeIndex, pushParams]);

  const handleLoadMore = useCallback(async () => {
    if (loadMorePendingRef.current || !hasMoreRef.current || isLoadingRef.current) return;
    loadMorePendingRef.current = true;
    setLoadMorePending(true);
    try {
      const currentProducts = productsRef.current;
      const data = await fetchPublicProductsPage({
        q: query || undefined,
        offset: currentProducts.length,
        pageSize: PAGE_SIZE,
        categoryId: categoryId != null && !Number.isNaN(categoryId) ? categoryId : null,
        brandId: brandId != null && !Number.isNaN(brandId) ? brandId : null,
        model: model || undefined,
        vehicleBrandId: vehicleBrandId != null && !Number.isNaN(vehicleBrandId) ? vehicleBrandId : null,
        vehicleModelId: vehicleModelId != null && !Number.isNaN(vehicleModelId) ? vehicleModelId : null,
        engineFamilyId: engineFamilyId != null && !Number.isNaN(engineFamilyId) ? engineFamilyId : null,
        sort: sort !== "default" ? sort : undefined,
      });
      const total = data.total ?? totalRef.current;
      setProducts((prev) => {
        const ids = new Set(prev.map((p) => p.id));
        const merged = [...prev];
        let addedCount = 0;
        for (const item of data.items) {
          if (!ids.has(item.id)) {
            merged.push(item);
            addedCount += 1;
          }
        }
        const nextHasMore = addedCount > 0 && (total > 0 ? merged.length < total : data.items.length >= PAGE_SIZE);
        setHasMore(nextHasMore);
        setProductsTotal(total);
        productsCacheRef.current.set(filterKey, { products: merged, hasMore: nextHasMore, total });
        return merged;
      });
    } catch {
      setHasMore(false);
      setError(
        lang === "ru"
          ? "Не удалось загрузить ещё товары. Попробуйте обновить страницу."
          : lang === "kz"
            ? "Тағы тауарларды жүктеу мүмкін болмады. Бетті жаңартып көріңіз."
            : "Failed to load more products. Try refreshing the page.",
      );
    } finally {
      loadMorePendingRef.current = false;
      setLoadMorePending(false);
    }
  }, [query, categoryId, brandId, model, vehicleBrandId, vehicleModelId, engineFamilyId, sort, filterKey, lang]);

  useEffect(() => {
    const el = sentinelRef.current;
    const nearBottom = () => {
      if (typeof window === "undefined") return false;
      const doc = document.documentElement;
      return window.innerHeight + window.scrollY >= doc.scrollHeight - 700;
    };
    const handleScroll = () => {
      if (nearBottom()) {
        handleLoadMore();
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    handleScroll();

    const observer = el
      ? new IntersectionObserver(
        (entries) => {
          if (entries[0]?.isIntersecting) {
            handleLoadMore();
          }
        },
        { rootMargin: "700px" },
      )
      : null;
    if (el) observer?.observe(el);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      observer?.disconnect();
    };
  }, [filterKey, handleLoadMore, hasMore, products.length]);

  useEffect(() => {
    if (!hasMore || loadMorePending || isLoading) return;
    const timer = window.setTimeout(() => {
      const doc = document.documentElement;
      if (window.innerHeight + window.scrollY >= doc.scrollHeight - 700) {
        handleLoadMore();
      }
    }, 80);
    return () => window.clearTimeout(timer);
  }, [products.length, hasMore, loadMorePending, isLoading, handleLoadMore]);

  const mobileFilterLabels = {
    brand: labels.brand,
    model: labels.model,
    category: labels.category,
    noBrand: labels.noBrand,
    noCategory: labels.noCategory,
    all: labels.all,
    allCategories: labels.allCategories,
    allBrands: labels.allBrands,
    allModels: labels.allModels,
    allModelsForBrand: labels.allModelsForBrand,
    backToBrands: labels.backToBrands,
    searchBrand: labels.searchBrand,
    searchModel: labels.searchModel,
    searchFitment: labels.searchFitment,
    modelHelper: labels.modelHelper,
    allModelsDescription: labels.allModelsDescription,
    searchCategory: labels.searchCategory,
    vehicleFitment: labels.vehicleFitment,
    codeIndex: labels.codeIndex,
    chooseBrand: labels.chooseBrand,
    modelsForBrand: labels.modelsForBrand,
    brandResult: labels.brandResult,
    modelResult: labels.modelResult,
    codeResult: labels.codeResult,
    wholeSection: labels.wholeSection,
    categorySubcategories: labels.categorySubcategories,
    emptyResults: labels.emptyPicker,
    selectBrandFirst: labels.selectBrandFirst,
  };

  const handleCategoryChange = (id: number | null) => {
    pushParams({ cat: id != null ? String(id) : null });
  };

  const handleVehicleBrandChange = (id: number | null) => {
    pushParams({
      vehicle_brand: id != null ? String(id) : null,
      vehicle_model: null,
      engine_family: null,
      brand: null,
      model: null,
    });
  };

  const handleVehicleModelChange = (id: number | null) => {
    const nextModel = id != null ? vehicleModels.find((row) => row.id === id) : null;
    pushParams({
      vehicle_brand: nextModel?.vehicle_brand_id != null ? String(nextModel.vehicle_brand_id) : vehicleBrandId != null && id == null ? String(vehicleBrandId) : null,
      vehicle_model: id != null ? String(id) : null,
      engine_family: null,
      brand: null,
      model: null,
    });
  };

  const handleEngineFamilyChange = (id: number | null) => {
    pushParams({
      engine_family: id != null ? String(id) : null,
      vehicle_brand: null,
      vehicle_model: null,
      brand: null,
      model: null,
    });
  };

  const handleFilterToggle = () => {
    setFilterUserOpen((v) => {
      const next = !v;
      writeCatalogFilterOpen(next);
      return next;
    });
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!suggestionsOpen || suggestions.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveSuggestionIdx((prev) => (prev + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveSuggestionIdx((prev) => (prev <= 0 ? suggestions.length - 1 : prev - 1));
    } else if (e.key === "Enter" && activeSuggestionIdx >= 0) {
      e.preventDefault();
      applySuggestion(suggestions[activeSuggestionIdx]);
    } else if (e.key === "Escape") {
      setSuggestionsOpen(false);
    }
  };

  const mobileSearchCommon = {
    searchValue,
    placeholder: labels.placeholderShort,
    findLabel: labels.find,
    loadingLabel: labels.loading,
    noSuggestionsLabel: labels.noSuggestions,
    suggestions,
    suggestionsOpen,
    suggestionsLoading,
    activeSuggestionIdx,
    compactIdle: chromeHidden && !searchFocused,
    onSearchValueChange: (value: string) => {
      setSearchValue(value);
      setSuggestionsOpen(true);
    },
    onFocus: () => {
      setSearchFocused(true);
      setSuggestionsOpen(true);
    },
    onBlur: () => {
      setTimeout(() => {
        setSearchFocused(false);
        setSuggestionsOpen(false);
      }, 120);
    },
    onSubmit: handleSearch,
    onClear: () => {
      setSearchValue("");
      setSuggestionsOpen(false);
      pushParams({ q: null });
    },
    onSuggestionSelect: applySuggestion,
    onSuggestionHover: setActiveSuggestionIdx,
    onKeyDown: handleSearchKeyDown,
    highlightMatch,
  };

  const desktopSearchCommon = {
    searchValue,
    placeholder: labels.placeholder,
    hint: labels.search,
    findLabel: labels.find,
    loadingLabel: labels.loading,
    noSuggestionsLabel: labels.noSuggestions,
    suggestionsLabel: labels.suggestions,
    suggestions,
    suggestionsOpen,
    suggestionsLoading,
    activeSuggestionIdx,
    onSearchValueChange: mobileSearchCommon.onSearchValueChange,
    onFocus: mobileSearchCommon.onFocus,
    onBlur: mobileSearchCommon.onBlur,
    onSubmit: handleSearch,
    onClear: mobileSearchCommon.onClear,
    onSuggestionSelect: applySuggestion,
    onSuggestionHover: setActiveSuggestionIdx,
    onKeyDown: handleSearchKeyDown,
    highlightMatch,
  };

  return (
    <div className="page-frame min-h-screen">
      <TopLoadingBar active={isLoading || loadMorePending} />
      <div className="site-container py-3 lg:py-8">
        <div
          className={`catalog-mobile-search-fixed lg:hidden ${
            chromeHidden ? "catalog-mobile-search-fixed--docked" : ""
          }`}
        >
          <div className="site-container">
            <CatalogMobileSearch
              {...mobileSearchCommon}
              compactIdle={chromeHidden && !searchFocused}
            />
          </div>
        </div>

        <div className="catalog-mobile-chrome-spacer lg:hidden" aria-hidden />

        <div className="mb-2 lg:hidden">
          <CatalogMobileFilterBar
            labels={mobileFilterLabels}
            vehicleBrands={vehicleBrands}
            vehicleModels={vehicleModels}
            engineFamilies={engineFamilies}
            categories={categories}
            vehicleBrandId={vehicleBrandId != null && !Number.isNaN(vehicleBrandId) ? vehicleBrandId : null}
            vehicleModelId={vehicleModelId != null && !Number.isNaN(vehicleModelId) ? vehicleModelId : null}
            engineFamilyId={engineFamilyId != null && !Number.isNaN(engineFamilyId) ? engineFamilyId : null}
            categoryId={categoryId != null && !Number.isNaN(categoryId) ? categoryId : null}
            onVehicleBrandChange={handleVehicleBrandChange}
            onVehicleModelChange={handleVehicleModelChange}
            onEngineFamilyChange={handleEngineFamilyChange}
            onCategoryChange={handleCategoryChange}
            showModel
            compact
          />
        </div>

        <div className="mb-2 lg:mb-5">
          <div className="catalog-page-header">
            <div className="catalog-page-header-main min-w-0">
              <nav className="catalog-page-breadcrumb">
                <Link href="/" className="inline-flex items-center gap-1 font-medium text-[var(--text-charcoal)] transition-colors hover:text-[var(--site-accent)]">
                  <Home size={12} />
                  {labels.home}
                </Link>
                <ChevronRight size={12} className="opacity-40" />
                <Link href="/catalog" className="font-medium text-[var(--text-charcoal)] transition-colors hover:text-[var(--site-accent)]">
                  {labels.title}
                </Link>
                {activeCategoryName && (
                  <>
                    <ChevronRight size={12} className="opacity-50" />
                    <span className="line-clamp-1 max-w-[10rem] text-[color:var(--text-charcoal)] sm:max-w-none">{activeCategoryName}</span>
                  </>
                )}
                {!activeCategoryName && (activeVehicleName || activeBrandName) && (
                  <>
                    <ChevronRight size={12} className="opacity-50" />
                    <span className="line-clamp-1 text-[color:var(--text-charcoal)]">{activeVehicleName || activeBrandName}</span>
                  </>
                )}
              </nav>
              <h1 className="catalog-page-title">{pageHeading}</h1>
              {pageLead && <p className="catalog-page-lead">{pageLead}</p>}
              {hasFilters && (
                <button
                  type="button"
                  onClick={() => router.push("/catalog")}
                  className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--site-accent)] hover:text-[var(--site-accent-hover)]"
                >
                  <X size={15} />
                  {labels.clear}
                </button>
              )}
            </div>

            <div className="catalog-page-header-filters hidden shrink-0 lg:block">
              <CatalogBrandModelSelects
                labels={{
                  brand: labels.brand,
                  model: labels.model,
                  codeIndex: labels.codeIndex,
                  allBrands: labels.allBrands,
                  allModels: labels.allModels,
                  all: labels.all,
                  selectBrandFirst: labels.selectBrandFirst,
                }}
                vehicleBrands={vehicleBrands}
                vehicleModels={vehicleModels}
                engineFamilies={engineFamilies}
                vehicleBrandId={vehicleBrandId != null && !Number.isNaN(vehicleBrandId) ? vehicleBrandId : null}
                vehicleModelId={vehicleModelId != null && !Number.isNaN(vehicleModelId) ? vehicleModelId : null}
                engineFamilyId={engineFamilyId != null && !Number.isNaN(engineFamilyId) ? engineFamilyId : null}
                onVehicleBrandChange={handleVehicleBrandChange}
                onVehicleModelChange={handleVehicleModelChange}
                onEngineFamilyChange={handleEngineFamilyChange}
              />
            </div>
          </div>
        </div>

        <div
          className={`catalog-desktop-toolbar ${
            chromeHidden
              ? "lg:pointer-events-none lg:-translate-y-2 lg:opacity-0"
              : ""
          }`}
        >
          <CatalogDesktopSearch {...desktopSearchCommon} />
        </div>

        <div
          className={`catalog-layout ${
            filterPanelOpen ? "catalog-layout--with-filter" : "catalog-layout--filter-collapsed"
          }`}
        >
          <div className="hidden lg:block">
            <CatalogDesktopFilterPanel
            labels={{
              filters: labels.filters,
              hideFilters: labels.hideFilters,
              showFilters: labels.showFilters,
              searchCategory: labels.searchCategory,
              allCategories: labels.allCategories,
              wholeSection: labels.wholeSection,
              sort: labels.sort,
              sortDefault: labels.sortDefault,
              sortPriceAsc: labels.sortPriceAsc,
              sortPriceDesc: labels.sortPriceDesc,
              sortNameAsc: labels.sortNameAsc,
              sortNameDesc: labels.sortNameDesc,
              categories: labels.categoriesTitle,
              subcategories: labels.categorySubcategories,
            }}
            categories={categories}
            categoryId={resolvedCategoryId}
            sort={sort}
            open={filterPanelOpen}
            onToggleOpen={handleFilterToggle}
            onCategoryChange={handleCategoryChange}
            onSortChange={(next) => pushParams({ sort: next === "default" ? null : next })}
            />
          </div>

          <div
            className={`catalog-products-stack min-w-0${chromeHidden ? " catalog-products-stack--docked" : ""}`}
          >
            {activeFilterChips.length > 0 && (
              <div className="hidden filter-sidebar px-4 py-3 lg:block">
                <p className="filter-section-label mb-2">{labels.activeFilters}</p>
                <div className="flex flex-wrap gap-2">
                  {activeFilterChips.map((chip) => (
                    <button
                      type="button"
                      key={chip.key}
                      onClick={chip.onRemove}
                      className="filter-chip gap-1"
                    >
                      {chip.label}
                      <X size={12} />
                    </button>
                  ))}
                </div>
              </div>
            )}
            {isLoading && products.length === 0 ? (
              <>
                <SlowLoadingHint active />
                <ProductCardGridSkeleton count={10} />
              </>
            ) : error ? (
              <div className="surface-panel border border-red-200/80 bg-gradient-to-b from-red-50/50 to-white py-16 text-center">
                <p className="mb-2 font-semibold text-red-600">{error}</p>
                <p className="mb-6 text-sm text-[color:var(--text-secondary)]">{tr(t.ui.catalogErrorHint, lang)}</p>
                <div className="flex flex-wrap items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => router.refresh()}
                    className="h-10 rounded-xl btn-primary px-5 text-sm font-semibold text-white shadow-md shadow-black/10 transition-transform hover:bg-[var(--site-accent-hover)] active:scale-[0.98]"
                  >
                    {labels.retry}
                  </button>
                  <button
                    type="button"
                    onClick={() => router.push("/catalog")}
                    className="h-10 rounded-xl border border-black/[0.08] bg-white px-5 text-sm font-medium text-[color:var(--text-charcoal)] shadow-sm transition-colors hover:bg-[color:var(--surface-light)]"
                  >
                    {labels.reset}
                  </button>
                </div>
              </div>
            ) : displayedProducts.length === 0 ? (
              <div className="surface-panel py-20 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[color:var(--site-accent-soft)] text-[color:var(--site-accent)]/40">
                  <SlidersHorizontal size={32} strokeWidth={1.5} />
                </div>
                <p className="mb-2 font-semibold text-[color:var(--text-charcoal)]">{labels.empty}</p>
                <p className="mb-6 text-sm text-[color:var(--text-secondary)]">{tr(t.ui.catalogEmptyHint, lang)}</p>
                <div className="flex flex-wrap items-center justify-center gap-2">
                  <a
                    href={emptyWhatsAppHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-whatsapp inline-flex h-10 items-center gap-2 rounded-full px-5 text-sm font-semibold"
                  >
                    <MessageCircle size={16} />
                    {labels.helpPick}
                  </a>
                  <button
                    type="button"
                    onClick={() => router.push("/catalog")}
                    className="h-10 rounded-xl border border-black/[0.08] bg-white px-5 text-sm font-medium text-[color:var(--text-charcoal)] shadow-sm transition-colors hover:bg-[color:var(--surface-light)]"
                  >
                    {labels.reset}
                  </button>
                </div>
              </div>
            ) : (
              <>
                {isLoading && products.length > 0 ? <SlowLoadingHint active /> : null}
                <div
                  className={`catalog-product-grid catalog-grid-loading-wrap transition-opacity duration-200 ${
                    isLoading && products.length > 0 ? "catalog-grid-loading pointer-events-none opacity-70" : ""
                  }`}
                >
                  {displayedProducts.map((p) => (
                    <CatalogProductCard
                      key={p.id}
                      product={p}
                      brandName={brandLabel(p)}
                      categoryName={categoryLabel(p)}
                      inStockLabel={labels.inStock}
                      outStockLabel={labels.outStock}
                      onAddToCart={() => {
                        if (p.quantity <= 0) return;
                        addItem({
                          id: p.id,
                          name: p.name,
                          price: p.sale_price,
                          imageUrl: p.image_url,
                          available: p.quantity,
                          ...cartExtrasFromProduct(p),
                        });
                        showToast(tr(t.ui.addedToCart, lang), { label: tr(t.ui.viewCart, lang), href: "/cart" });
                      }}
                    />
                  ))}
                </div>

                {loadMorePending && (
                  <div className="grid w-full grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 sm:gap-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <ProductCardSkeleton key={i} />
                    ))}
                  </div>
                )}
                {hasMore && <div ref={sentinelRef} className="h-px" />}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CatalogPageContent;
