import { getContractStatus, getTariffStatus } from "@/apps/matrix/data/contractors";
import { Card } from "@/shared/components/ui/card";
import { AlertTriangle, Clock } from "lucide-react";
import { StatusBadge } from "./StatusBadge";
import { useContractors } from "@/apps/matrix/store/contractors-store";

export function AlertsPanel({ onSelect }: { onSelect: (id: string) => void }) {
  const { list: contractors } = useContractors();
  const issues = contractors
    .map((c) => ({
      c,
      contract: getContractStatus(c),
      tariff: getTariffStatus(c),
    }))
    .filter(
      (x) =>
        x.contract === "expiring" ||
        x.tariff === "expiring" ||
        x.contract === "pending" ||
        x.tariff === "pending" ||
        (x.c.comment && x.c.comment !== "Отсутствует" && !x.c.comment.toLowerCase().includes("обновили"))
    );

  return (
    <Card className="overflow-hidden border bg-gradient-card">
      <div className="flex items-center gap-3 border-b bg-warning/10 px-5 py-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-warning text-warning-foreground">
          <AlertTriangle className="h-4 w-4" />
        </div>
        <div>
          <h3 className="font-display text-base font-semibold">Алерты по договорам и тарифам</h3>
          <p className="text-xs text-muted-foreground">Истекающие соглашения, открытые вопросы и согласования</p>
        </div>
        <span className="ml-auto rounded-full bg-warning px-2.5 py-1 text-xs font-bold text-warning-foreground">
          {issues.length}
        </span>
      </div>
      <div className="divide-y">
        {issues.length === 0 && (
          <div className="px-5 py-6 text-center text-sm text-muted-foreground">Алертов нет — всё в порядке.</div>
        )}
        {issues.map(({ c, contract, tariff }) => (
          <button
            key={c.id}
            onClick={() => onSelect(c.id)}
            className="flex w-full items-start gap-3 px-5 py-3 text-left transition-colors hover:bg-secondary/60"
          >
            <Clock className="mt-1 h-4 w-4 shrink-0 text-muted-foreground" />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-medium">{c.name}</span>
                {contract === "expiring" && <StatusBadge status={contract} />}
                {tariff === "expiring" && tariff !== contract && <StatusBadge status={tariff} />}
                {(contract === "pending" || tariff === "pending") && <StatusBadge status="pending" />}
              </div>
              {c.comment && c.comment !== "Отсутствует" && (
                <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">{c.comment}</p>
              )}
            </div>
          </button>
        ))}
      </div>
    </Card>
  );
}
