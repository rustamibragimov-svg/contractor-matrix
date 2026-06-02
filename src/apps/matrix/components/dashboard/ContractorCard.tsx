import { Contractor, getContractStatus, getTariffStatus } from "@/apps/matrix/data/contractors";
import { Card } from "@/shared/components/ui/card";
import { StatusBadge } from "./StatusBadge";
import { Building2, FileText, Calendar, MessageSquare, Globe, Layers, Pencil } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

export function ContractorCard({ c, onOpen }: { c: Contractor; onOpen: () => void }) {
  const cs = getContractStatus(c);
  const ts = getTariffStatus(c);
  return (
    <Card className="group relative flex h-full flex-col overflow-hidden border bg-gradient-card p-5 transition-all hover:-translate-y-0.5 hover:shadow-elevated">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-accent opacity-0 transition-opacity group-hover:opacity-100" />

      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Building2 className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-display text-base font-semibold leading-tight text-balance">{c.name}</h3>
            <p className="mt-0.5 text-xs text-muted-foreground">{c.category}</p>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        <StatusBadge status={cs} />
        <StatusBadge status={ts} />
      </div>

      <div className="mt-4 space-y-2.5 text-sm">
        <Row icon={FileText} label="Юр. лицо" value={c.legalEntity} />
        <Row icon={Layers} label="Структура" value={c.costStructure} />
        <Row icon={Calendar} label="Договор до" value={c.contractValidUntil} />
        {c.countries && c.countries.length > 0 && (
          <Row icon={Globe} label="Страны" value={c.countries.join(", ")} />
        )}
      </div>

      {c.comment && c.comment !== "Отсутствует" && (
        <div className="mt-4 flex gap-2 rounded-lg border border-warning/30 bg-warning/10 p-3 text-xs">
          <MessageSquare className="h-3.5 w-3.5 shrink-0 text-warning-foreground" />
          <p className="leading-snug text-foreground/80 line-clamp-3">{c.comment}</p>
        </div>
      )}

      <div className="mt-auto pt-4">
        <Button variant="outline" size="sm" className="w-full" onClick={onOpen}>
          <Pencil className="mr-2 h-3.5 w-3.5" /> Открыть и редактировать
        </Button>
      </div>
    </Card>
  );
}

function Row({ icon: Icon, label, value }: { icon: typeof Building2; label: string; value: string }) {
  return (
    <div className="flex gap-2.5">
      <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
      <div className="min-w-0 flex-1">
        <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className="text-sm font-medium leading-snug line-clamp-2">{value}</p>
      </div>
    </div>
  );
}
