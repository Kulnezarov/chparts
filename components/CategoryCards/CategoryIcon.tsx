import {
  Battery,
  Car,
  Circle,
  Cpu,
  Disc3,
  Droplets,
  Filter,
  Gauge,
  Layers,
  Lightbulb,
  Sofa,
  Thermometer,
  Wind,
  Zap,
  type LucideIcon,
} from "lucide-react";
import type { CategoryVisualTone } from "@/lib/catalogCategories";

const TONE_META: Record<CategoryVisualTone, { Icon: LucideIcon; className: string }> = {
  oil: { Icon: Droplets, className: "bg-sky-500/12 text-sky-600" },
  battery: { Icon: Battery, className: "bg-emerald-500/12 text-emerald-600" },
  brake: { Icon: Disc3, className: "bg-rose-500/12 text-rose-600" },
  suspension: { Icon: Gauge, className: "bg-violet-500/12 text-violet-600" },
  glass: { Icon: Lightbulb, className: "bg-amber-500/12 text-amber-600" },
  body: { Icon: Car, className: "bg-slate-500/12 text-slate-600" },
  filter: { Icon: Filter, className: "bg-teal-500/12 text-teal-600" },
  electric: { Icon: Zap, className: "bg-yellow-500/15 text-yellow-700" },
  engine: { Icon: Gauge, className: "bg-orange-500/12 text-orange-600" },
  steering: { Icon: Circle, className: "bg-indigo-500/12 text-indigo-600" },
  wheel: { Icon: Circle, className: "bg-neutral-500/12 text-neutral-600" },
  cooling: { Icon: Thermometer, className: "bg-cyan-500/12 text-cyan-600" },
  exhaust: { Icon: Wind, className: "bg-stone-500/12 text-stone-600" },
  interior: { Icon: Sofa, className: "bg-fuchsia-500/12 text-fuchsia-600" },
  ecu: { Icon: Cpu, className: "bg-blue-500/12 text-blue-600" },
  default: { Icon: Layers, className: "bg-[var(--site-accent)]/10 text-[var(--site-accent)]" },
};

type Props = {
  tone: CategoryVisualTone;
  className?: string;
};

export default function CategoryIcon({ tone, className = "" }: Props) {
  const { Icon, className: toneClass } = TONE_META[tone] ?? TONE_META.default;
  return (
    <div
      className={`flex h-10 w-10 items-center justify-center rounded-xl transition-colors group-hover:bg-[var(--site-accent)]/15 group-hover:text-[var(--site-accent)] ${toneClass} ${className}`}
    >
      <Icon className="h-[18px] w-[18px]" aria-hidden />
    </div>
  );
}
