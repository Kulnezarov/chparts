# FastAPI changes for CHPARTS public storefront

This project contains only the Next.js storefront.  
Below is backend-ready code you can apply in your `SkladPro` FastAPI service.

**Telegram-бот и то же API (вариант A):** см. `docs/INTEGRATION_BOT.md` в репозитории витрины.

## 1) Migration: add `image_url` to products

```sql
ALTER TABLE products
ADD COLUMN IF NOT EXISTS image_url TEXT;
```

## 2) Pydantic schemas (public-safe)

```python
from pydantic import BaseModel


class PublicProductOut(BaseModel):
    id: int
    name: str
    sale_price: float
    quantity: int
    category_id: int | None
    image_url: str | None
    # Рекомендуется отдавать названия для витрины (JOIN в SQL), без внутренних полей
    category_name: str | None = None
    brand_id: int | None = None
    brand_name: str | None = None

    class Config:
        from_attributes = True


class PublicCategoryOut(BaseModel):
    id: int
    name: str


class PublicBrandOut(BaseModel):
    id: int
    name: str


class PublicOrderCreate(BaseModel):
    customer_name: str
    customer_phone: str
    comment: str | None = None
    items: list[dict]  # [{ "product_id": 1, "quantity": 2 }]
    # Опционально: доставка (витрина CHPARTS). Если полей нет в БД — клиент всё равно дублирует блок в `comment`.
    delivery_type: str | None = None  # "pickup" | "city" | "post"
    delivery_address: str | None = None  # адрес при доставке по городу
    delivery_city: str | None = None  # город при отправке почтой
    delivery_details: str | None = None  # отделение / индекс / примечание
    payment_type: str | None = None  # "card" | "cash" (наличные только при самовывозе; клиент дублирует в comment)
```

## 3) Public router: `/api/v1/public/products` and `/api/v1/public/orders`

```python
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.models.product import Product
from app.models.reserve import Reserve
from app.schemas.public import PublicProductOut, PublicOrderCreate
from app.services.notifications import notify_manager_new_site_order

router = APIRouter(prefix="/api/v1/public", tags=["public"])


@router.get("/products", response_model=list[PublicProductOut])
async def list_public_products(
    q: str | None = None,
    category_id: int | None = None,
    brand_id: int | None = None,
    in_stock: bool | None = None,
    limit: int = 24,
    offset: int = 0,
    sort: str | None = None,
    db: AsyncSession = Depends(get_db),
):
    # Фильтры + пагинация. Ответ лучше отдавать как:
    # { "items": [...], "total": <int> } — тогда витрина покажет все страницы, а не только 50.
    # Параметр sort (опционально): price_asc, price_desc, name_asc, name_desc
    ...


@router.get("/categories", response_model=list[PublicCategoryOut])
async def list_public_categories(db: AsyncSession = Depends(get_db)):
    # SELECT id, name FROM categories WHERE ...
    ...


@router.get("/brands", response_model=list[PublicBrandOut])
async def list_public_brands(db: AsyncSession = Depends(get_db)):
    # SELECT id, name FROM brands WHERE ...
    ...


@router.post("/orders")
async def create_public_order(
    payload: PublicOrderCreate,
    db: AsyncSession = Depends(get_db),
):
    reserve = Reserve(
        source="website",
        status="Новый заказ с сайта",
        customer_name=payload.customer_name,
        customer_phone=payload.customer_phone,
        comment=payload.comment,
        items=payload.items,
        # при наличии колонок / JSON-поля в Reserve:
        # delivery_type=payload.delivery_type,
        # delivery_address=payload.delivery_address,
        # delivery_city=payload.delivery_city,
        # delivery_details=payload.delivery_details,
        # payment_type=payload.payment_type,
    )

    db.add(reserve)
    await db.commit()
    await db.refresh(reserve)

    await notify_manager_new_site_order(reserve.id)

    return {"ok": True, "reserve_id": reserve.id}
```

## 3b) Синхронизация статусов в «Мои заказы» (витрина)

Витрина запрашивает **GET** `/api/v1/public/reserves/{reserve_id}` (тот же `reserve_id`, что возвращается при создании заказа).  
Ответ с позициями и полем `status` на строке — нужен, чтобы отобразить «выдано» / «отменено».  
Если маршрута нет → **404**, статусы в браузере остаются «в обработке».  
Путь `GET /api/v1/public/orders/{id}` — запасной; **422** часто из‑за того, что `id` резерва не совпадает с `id` сущности «order» в БД.

## 4) Security notes

- Do **not** include private fields in public schemas (`cny_cost`, `profit`, internal margins).
- Keep public endpoints without auth, but only expose safe fields.
- Configure CORS for `https://sklad.kz` and `http://chparts.kz`.
