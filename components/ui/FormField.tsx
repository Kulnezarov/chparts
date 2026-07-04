import { ReactNode } from "react";

interface FormFieldProps {
  label: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
  hint?: string;
}

export default function FormField({
  label,
  error,
  required = false,
  children,
  hint,
}: FormFieldProps) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-zinc-900">
        {label}
        {required && <span className="ml-1 text-red-600">*</span>}
      </label>
      <div>{children}</div>
      {hint && <p className="text-xs text-slate-500">{hint}</p>}
      {error && (
        <p className="text-xs font-medium text-red-600 flex items-center gap-1">
          <span>⚠</span>
          {error}
        </p>
      )}
    </div>
  );
}
