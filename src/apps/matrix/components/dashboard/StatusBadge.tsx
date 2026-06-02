import { Badge } from "@/shared/components/ui/badge";
import { ContractStatus } from "@/apps/matrix/data/contractors";
import { CheckCircle2, RefreshCw, AlertTriangle, MinusCircle, Clock } from "lucide-react";
import { cn } from "@/shared/lib/utils";

const map: Record<ContractStatus, { label: string; icon: typeof CheckCircle2; cls: string }> = {
  active: { label: "Активный", icon: CheckCircle2, cls: "bg-success/15 text-success border-success/30" },
  "auto-renew": { label: "Автопролонгация", icon: RefreshCw, cls: "bg-info/15 text-info border-info/30" },
  expiring: { label: "Истекает / истёк", icon: AlertTriangle, cls: "bg-destructive/15 text-destructive border-destructive/30" },
  "no-contract": { label: "Без договора", icon: MinusCircle, cls: "bg-muted text-muted-foreground border-border" },
  pending: { label: "На согласовании", icon: Clock, cls: "bg-warning/15 text-warning-foreground border-warning/40" },
};

export function StatusBadge({ status, className }: { status: ContractStatus; className?: string }) {
  const { label, icon: Icon, cls } = map[status];
  return (
    <Badge variant="outline" className={cn("gap-1.5 font-medium border", cls, className)}>
      <Icon className="h-3 w-3" />
      {label}
    </Badge>
  );
}
