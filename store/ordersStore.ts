import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { PublicDeliveryType, PublicPaymentType } from "@/lib/publicApi";
import type { OrderLineStatus } from "@/lib/reserveStatus";
import type { OrderWarehouseStatus } from "@/lib/orderClientHints";

export interface SavedOrderLine {
  product_id: number;
  name: string;
  quantity: number;
  price: number;
  imageUrl?: string | null;
  /** После синхронизации со складом (GET резерва) */
  status?: OrderLineStatus;
  barcode?: string | null;
  sku?: string | null;
  brandName?: string | null;
  categoryName?: string | null;
}

export interface SavedOrder {
  /** Локальный id для списка */
  localId: string;
  reserveId: number;
  createdAt: string;
  total: number;
  deliverySummary: string;
  paymentSummary: string;
  deliveryType: PublicDeliveryType;
  paymentType: PublicPaymentType;
  customerPhone?: string;
  lines: SavedOrderLine[];
  /** Статус заказа после синхронизации со складом */
  warehouseStatus?: OrderWarehouseStatus;
}

function newLocalId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `ord-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

interface OrdersStore {
  orders: SavedOrder[];
  addOrder: (input: {
    reserveId: number;
    total: number;
    deliverySummary: string;
    paymentSummary: string;
    deliveryType: PublicDeliveryType;
    paymentType: PublicPaymentType;
    customerPhone?: string;
    lines: SavedOrderLine[];
  }) => void;
  /** Обновить статусы позиций и заголовок заказа по данным склада */
  mergeLineStatuses: (
    reserveId: number,
    updates: Array<{
      product_id: number;
      status: OrderLineStatus;
      name?: string | null;
      barcode?: string | null;
      sku?: string | null;
      brandName?: string | null;
      categoryName?: string | null;
    }>,
    warehouseStatus?: OrderWarehouseStatus,
  ) => void;
  removeOrder: (localId: string) => void;
  clearAll: () => void;
}

export const useOrdersStore = create<OrdersStore>()(
  persist(
    (set) => ({
      orders: [],
      addOrder: (payload) =>
        set((state) => {
          const order: SavedOrder = {
            localId: newLocalId(),
            reserveId: payload.reserveId,
            createdAt: new Date().toISOString(),
            total: payload.total,
            deliverySummary: payload.deliverySummary,
            paymentSummary: payload.paymentSummary,
            deliveryType: payload.deliveryType,
            paymentType: payload.paymentType,
            customerPhone: payload.customerPhone,
            lines: payload.lines,
          };
          return { orders: [order, ...state.orders] };
        }),
      mergeLineStatuses: (reserveId, updates, warehouseStatus) =>
        set((state) => ({
          orders: state.orders.map((o) => {
            if (o.reserveId !== reserveId) return o;
            const lines = o.lines.map((line) => {
              const u = updates.find((x) => x.product_id === line.product_id);
              if (!u) return line;
              return {
                ...line,
                status: u.status,
                name: u.name != null && String(u.name).trim() !== "" ? String(u.name) : line.name,
                barcode: u.barcode ?? line.barcode,
                sku: u.sku ?? line.sku,
                brandName: u.brandName ?? line.brandName,
                categoryName: u.categoryName ?? line.categoryName,
              };
            });
            return {
              ...o,
              lines,
              warehouseStatus: warehouseStatus ?? o.warehouseStatus,
            };
          }),
        })),
      removeOrder: (localId) =>
        set((state) => ({
          orders: state.orders.filter((o) => o.localId !== localId),
        })),
      clearAll: () => set({ orders: [] }),
    }),
    { name: "chparts-orders" },
  ),
);
