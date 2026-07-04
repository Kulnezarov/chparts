export type Brand = "changan" | "wuling" | "dongfeng" | "faw";
export type CategorySlug =
  | "brakes" | "engine" | "suspension" | "body"
  | "oils" | "tires" | "electrics" | "filters"
  | "batteries" | "exhaust" | "interior" | "cooling";

export interface Product {
  id: string;
  article: string;
  brand: Brand;
  category: CategorySlug;
  name: { ru: string; kz: string; uz: string };
  price: number;
  oldPrice?: number;
  img: string;
  inStock: boolean;
}

export const brands: { slug: Brand; name: string; logo: string }[] = [
  { slug: "changan", name: "Changan", logo: "/brands/changan.svg" },
  { slug: "wuling", name: "Wuling", logo: "/brands/wuling.svg" },
  { slug: "dongfeng", name: "Dongfeng", logo: "/brands/dongfeng.svg" },
  { slug: "faw", name: "FAW", logo: "/brands/faw.svg" },
];

/** Запрос в каталог (`q=`) по выбранной карточке — должен отдавать релевантные позиции с бэка. */
export type CategorySearchQ = { ru: string; kz: string; uz: string };

export const categories: {
  slug: CategorySlug;
  ru: string;
  kz: string;
  uz: string;
  img: string;
  searchQ: CategorySearchQ;
}[] = [
  { slug: "brakes",     ru: "Тормозная система",  kz: "Тежегіш жүйесі",          uz: "Tormoz tizimi",           img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=70",   searchQ: { ru: "тормоз",        kz: "тежегіш",   uz: "tormoz" } },
  { slug: "engine",     ru: "Двигатель",           kz: "Қозғалтқыш",              uz: "Dvigatel",                 img: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&q=70",   searchQ: { ru: "двигатель",     kz: "қозғалтқыш", uz: "dvigatel" } },
  { slug: "suspension", ru: "Подвеска и рулевое",  kz: "Тіреу және рульдік",      uz: "Osma va rul",              img: "https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=400&q=70",   searchQ: { ru: "подвеска",      kz: "тіреу",     uz: "osma" } },
  { slug: "body",       ru: "Кузов и оптика",      kz: "Кузов және оптика",       uz: "Kuzov va optika",          img: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&q=70",   searchQ: { ru: "кузов",         kz: "кузов",     uz: "kuzov" } },
  { slug: "oils",       ru: "Масла и жидкости",    kz: "Майлар мен сұйықтықтар",  uz: "Moylar va suyuqliklar",    img: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&q=70",   searchQ: { ru: "масло",         kz: "май",       uz: "moy" } },
  { slug: "tires",      ru: "Шины и диски",        kz: "Шиналар мен дөңгелектер", uz: "Shinalar va disklar",      img: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=400&q=70",   searchQ: { ru: "шина",          kz: "шина",      uz: "shina" } },
  { slug: "electrics",  ru: "Электрика",           kz: "Электрика",               uz: "Elektrika",                img: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&q=70",   searchQ: { ru: "электрика",     kz: "электрика", uz: "elektrika" } },
  { slug: "filters",    ru: "Фильтры",             kz: "Сүзгілер",                uz: "Filtrlar",                 img: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&q=70",   searchQ: { ru: "фильтр",        kz: "сүзгі",     uz: "filtr" } },
  { slug: "batteries",  ru: "Аккумуляторы",        kz: "Аккумуляторлар",          uz: "Akkumulyatorlar",          img: "https://images.unsplash.com/photo-1609592806596-4d8e5a9e8e8e?w=400&q=70",   searchQ: { ru: "аккумулятор",   kz: "аккумулятор", uz: "akkumulyator" } },
  { slug: "exhaust",    ru: "Выхлопная система",   kz: "Шығарғыш жүйесі",         uz: "Chiqindi tizimi",          img: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400&q=70",   searchQ: { ru: "выхлоп",        kz: "шығарғыш", uz: "chiqindi" } },
  { slug: "interior",   ru: "Салон и аксессуары",  kz: "Салон және аксессуарлар", uz: "Salon va aksessuarlar",    img: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=400&q=70",   searchQ: { ru: "салон",         kz: "салон",     uz: "salon" } },
  { slug: "cooling",    ru: "Охлаждение",          kz: "Салқындату",              uz: "Sovutish",                 img: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=400&q=70",   searchQ: { ru: "радиатор",      kz: "радиатор",  uz: "radiator" } },
];

export const products: Product[] = [
  { id: "1",  article: "CA-BR-001", brand: "changan",  category: "brakes",     name: { ru: "Тормозные колодки передние CS35",    kz: "CS35 алдыңғы тежегіш колодкалары",   uz: "Front brake pads CS35" },          price: 8500,  oldPrice: 10000, img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80", inStock: true },
  { id: "2",  article: "CA-EN-002", brand: "changan",  category: "engine",     name: { ru: "Ремень ГРМ Changan CS55",            kz: "Changan CS55 ГРМ белдігі",           uz: "Timing belt Changan CS55" },        price: 12000, oldPrice: 14500, img: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=600&q=80", inStock: true },
  { id: "3",  article: "CA-SU-003", brand: "changan",  category: "suspension", name: { ru: "Амортизатор передний Changan Eado",  kz: "Changan Eado алдыңғы амортизаторы",  uz: "Front shock absorber Changan Eado" }, price: 22000, img: "https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=600&q=80", inStock: true },
  { id: "4",  article: "CA-FI-004", brand: "changan",  category: "filters",    name: { ru: "Масляный фильтр Changan CS35 Plus",  kz: "Changan CS35 Plus май сүзгісі",      uz: "Oil filter Changan CS35 Plus" },    price: 1800,  img: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=600&q=80", inStock: true },
  { id: "5",  article: "CA-EL-005", brand: "changan",  category: "electrics",  name: { ru: "Генератор Changan CS75",             kz: "Changan CS75 генераторы",            uz: "Alternator Changan CS75" },         price: 45000, oldPrice: 52000, img: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&q=80", inStock: false },
  { id: "6",  article: "WL-BR-001", brand: "wuling",   category: "brakes",     name: { ru: "Тормозной диск Wuling Hongguang",    kz: "Wuling Hongguang тежегіш дискісі",   uz: "Brake disc Wuling Hongguang" },     price: 9200,  img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80", inStock: true },
  { id: "7",  article: "WL-EN-002", brand: "wuling",   category: "engine",     name: { ru: "Свечи зажигания Wuling Almaz",       kz: "Wuling Almaz тұтандыру шамдары",     uz: "Spark plugs Wuling Almaz" },        price: 3600,  oldPrice: 4200,  img: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=600&q=80", inStock: true },
  { id: "8",  article: "WL-OI-003", brand: "wuling",   category: "oils",       name: { ru: "Моторное масло 5W-30 Wuling 4л",     kz: "Wuling моторлы май 5W-30 4л",        uz: "Engine oil 5W-30 Wuling 4L" },      price: 7800,  img: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&q=80", inStock: true },
  { id: "9",  article: "WL-TI-004", brand: "wuling",   category: "tires",      name: { ru: "Диск колесный R15 Wuling",           kz: "Wuling R15 дөңгелек дискісі",        uz: "Wheel rim R15 Wuling" },            price: 18500, oldPrice: 21000, img: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=600&q=80", inStock: true },
  { id: "10", article: "DF-SU-001", brand: "dongfeng", category: "suspension", name: { ru: "Рычаг подвески Dongfeng AX7",        kz: "Dongfeng AX7 тіреу тетігі",          uz: "Control arm Dongfeng AX7" },        price: 16000, img: "https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=600&q=80", inStock: true },
  { id: "11", article: "DF-BO-002", brand: "dongfeng", category: "body",       name: { ru: "Бампер передний Dongfeng S30",       kz: "Dongfeng S30 алдыңғы бамперы",       uz: "Front bumper Dongfeng S30" },       price: 34000, oldPrice: 40000, img: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&q=80", inStock: true },
  { id: "12", article: "DF-CO-003", brand: "dongfeng", category: "cooling",    name: { ru: "Радиатор охлаждения Dongfeng H30",   kz: "Dongfeng H30 салқындату радиаторы",  uz: "Cooling radiator Dongfeng H30" },   price: 28000, img: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=600&q=80", inStock: false },
  { id: "13", article: "DF-BA-004", brand: "dongfeng", category: "batteries",  name: { ru: "Аккумулятор 60Ah Dongfeng",          kz: "Dongfeng 60Ah аккумуляторы",         uz: "Battery 60Ah Dongfeng" },           price: 32000, oldPrice: 36000, img: "https://images.unsplash.com/photo-1609592806596-4d8e5a9e8e8e?w=600&q=80", inStock: true },
  { id: "14", article: "FW-EN-001", brand: "faw",      category: "engine",     name: { ru: "Помпа водяная FAW Besturn B50",      kz: "FAW Besturn B50 су сорғысы",         uz: "Water pump FAW Besturn B50" },      price: 11500, img: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=600&q=80", inStock: true },
  { id: "15", article: "FW-EX-002", brand: "faw",      category: "exhaust",    name: { ru: "Глушитель FAW Vita",                 kz: "FAW Vita үнсіздендіргіші",           uz: "Muffler FAW Vita" },                price: 19000, oldPrice: 23000, img: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=600&q=80", inStock: true },
  { id: "16", article: "FW-IN-003", brand: "faw",      category: "interior",   name: { ru: "Коврики салона FAW Besturn X40",     kz: "FAW Besturn X40 салон кілемдері",    uz: "Floor mats FAW Besturn X40" },      price: 6500,  img: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=600&q=80", inStock: true },
];
