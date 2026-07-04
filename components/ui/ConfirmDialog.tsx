"use client";

import { useEffect, useId, useRef } from "react";

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  onClose: () => void;
  /** Стиль кнопки подтверждения (опасное действие). */
  confirmDanger?: boolean;
};

/**
 * Модалка подтверждения: Escape, клик по фону, фокус на «Отмена», body scroll lock.
 */
export default function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onClose,
  confirmDanger = true,
}: ConfirmDialogProps) {
  const titleId = useId();
  const descId = useId();
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => cancelRef.current?.focus(), 0);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      clearTimeout(t);
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center p-4 sm:items-center">
      <div
        className="absolute inset-0 cursor-default bg-zinc-900/50 backdrop-blur-[2px]"
        onClick={onClose}
        role="presentation"
        aria-hidden
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descId : undefined}
        className="relative w-full max-w-md rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xl shadow-slate-900/20 sm:p-6"
      >
        <h2 id={titleId} className="text-lg font-extrabold tracking-tight text-zinc-900">
          {title}
        </h2>
        {description ? (
          <p id={descId} className="mt-2 text-sm leading-relaxed text-slate-600">
            {description}
          </p>
        ) : null}
        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-3">
          <button
            ref={cancelRef}
            type="button"
            onClick={onClose}
            className="inline-flex w-full items-center justify-center rounded-xl border border-slate-200/90 bg-white px-4 py-2.5 text-sm font-semibold text-zinc-800 shadow-sm transition-colors hover:bg-slate-50 sm:w-auto"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={
              confirmDanger
                ? "inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-b from-rose-600 to-rose-700 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-rose-900/20 transition-transform hover:from-rose-500 hover:to-rose-600 active:scale-[0.99] sm:w-auto"
                : "inline-flex w-full items-center justify-center rounded-xl btn-primary px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-black/10 transition-transform active:scale-[0.99] sm:w-auto"
            }
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
