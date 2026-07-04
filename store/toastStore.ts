import { create } from "zustand";

export type ToastAction = { label: string; href: string };

type ToastState = {
  message: string | null;
  action: ToastAction | null;
  show: (message: string, action?: ToastAction) => void;
  hide: () => void;
};

let hideTimer: ReturnType<typeof setTimeout> | null = null;

export const useToastStore = create<ToastState>((set) => ({
  message: null,
  action: null,
  show: (message, action) => {
    if (hideTimer) clearTimeout(hideTimer);
    set({ message, action: action ?? null });
    hideTimer = setTimeout(() => {
      set({ message: null, action: null });
      hideTimer = null;
    }, 3200);
  },
  hide: () => {
    if (hideTimer) clearTimeout(hideTimer);
    hideTimer = null;
    set({ message: null, action: null });
  },
}));
