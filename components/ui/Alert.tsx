import { ReactNode } from "react";
import {
  AlertTriangle,
  CheckCircle,
  Info,
  AlertCircle,
  X,
} from "lucide-react";

export type AlertType = "error" | "success" | "info" | "warning";

interface AlertProps {
  type?: AlertType;
  title?: string;
  message: string | ReactNode;
  onClose?: () => void;
  showIcon?: boolean;
  className?: string;
}

const alertConfig: Record<
  AlertType,
  {
    bgColor: string;
    borderColor: string;
    iconColor: string;
    textColor: string;
    icon: ReactNode;
  }
> = {
  error: {
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    iconColor: "text-red-600",
    textColor: "text-red-900",
    icon: <AlertTriangle className="h-5 w-5" />,
  },
  success: {
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
    iconColor: "text-emerald-600",
    textColor: "text-emerald-900",
    icon: <CheckCircle className="h-5 w-5" />,
  },
  warning: {
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-200",
    iconColor: "text-yellow-600",
    textColor: "text-yellow-900",
    icon: <AlertCircle className="h-5 w-5" />,
  },
  info: {
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    iconColor: "text-blue-600",
    textColor: "text-blue-900",
    icon: <Info className="h-5 w-5" />,
  },
};

export default function Alert({
  type = "info",
  title,
  message,
  onClose,
  showIcon = true,
  className = "",
}: AlertProps) {
  const config = alertConfig[type];

  return (
    <div
      className={`flex items-start gap-3 rounded-lg border ${config.bgColor} ${config.borderColor} p-4 ${className}`}
      role="alert"
    >
      {showIcon && <div className={`flex-shrink-0 ${config.iconColor}`}>{config.icon}</div>}
      <div className="flex-1">
        {title && <h3 className={`font-semibold ${config.textColor}`}>{title}</h3>}
        <p className={`text-sm ${config.textColor} ${title ? "mt-1" : ""}`}>{message}</p>
      </div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className={`flex-shrink-0 ${config.iconColor} hover:opacity-70 transition-opacity`}
          aria-label="Закрыть"
        >
          <X className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}
