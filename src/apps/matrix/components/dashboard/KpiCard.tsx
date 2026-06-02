import { Card } from "@/shared/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/shared/lib/utils";

interface KpiCardProps {
  label: string;
  value: string | number;
  hint?: string;
  icon: LucideIcon;
  tone?: "default" | "accent" | "success" | "warning" | "destructive";
  onClick?: () => void;
  active?: boolean;
}

const toneCls: Record<NonNullable<KpiCardProps["tone"]>, string> = {
  default: "from-card to-card text-foreground",
  accent: "from-accent/10 to-accent/5 text-foreground",
  success: "from-success/10 to-transparent",
  warning: "from-warning/15 to-transparent",
  destructive: "from-destructive/10 to-transparent",
};

const iconCls: Record<NonNullable<KpiCardProps["tone"]>, string> = {
  default: "bg-primary text-primary-foreground",
  accent: "bg-gradient-accent text-accent-foreground shadow-glow",
  success: "bg-success text-success-foreground",
  warning: "bg-warning text-warning-foreground",
  destructive: "bg-destructive text-destructive-foreground",
};

export function KpiCard({ label, value, hint, icon: Icon, tone = "default", onClick, active }: KpiCardProps) {
  return (
    <Card
      onClick={onClick}
      className={cn(
        "relative overflow-hidden border bg-gradient-to-br p-5 transition-all hover:shadow-elevated",
        toneCls[tone],
        onClick && "cursor-pointer select-none",
        active && "ring-2 ring-primary ring-offset-2",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
          <p className="font-display text-3xl font-bold leading-none">{value}</p>
          {hint && <p className="pt-1 text-xs text-muted-foreground">{hint}</p>}
          {onClick && (
            <p className="pt-0.5 text-[10px] text-muted-foreground/60">
              {active ? "сбросить фильтр" : "нажмите для фильтра"}
            </p>
          )}
        </div>
        <div className={cn("flex h-11 w-11 items-center justify-center rounded-xl", iconCls[tone])}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-stripes opacity-40" />
    </Card>
  );
}
