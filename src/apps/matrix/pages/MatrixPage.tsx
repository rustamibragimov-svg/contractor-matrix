import { useMemo, useState } from "react";
import {
  Contractor,
  ContractorCategory,
  getContractStatus,
  getTariffStatus,
  QUARTERS,
  Quarter,
} from "@/apps/matrix/data/contractors";
import { useContractors } from "@/apps/matrix/store/contractors-store";
import { KpiCard } from "@/apps/matrix/components/dashboard/KpiCard";
import { ContractorCard } from "@/apps/matrix/components/dashboard/ContractorCard";
import { ContractorEditDialog } from "@/apps/matrix/components/dashboard/ContractorEditDialog";
import { AlertsPanel } from "@/apps/matrix/components/dashboard/AlertsPanel";
import { StatusBadge } from "@/apps/matrix/components/dashboard/StatusBadge";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import {
  Truck, Building2, FileCheck2, AlertTriangle, Search, LayoutGrid, Table as TableIcon,
  Package, Globe2, Boxes, Plus, RotateCcw,
} from "lucide-react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/shared/components/ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/shared/components/ui/tabs";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/shared/components/ui/alert-dialog";
import { toast } from "sonner";

const CATEGORIES: ContractorCategory[] = [
  "Последняя миля",
  "Сортировка / Обработка",
  "Таможня",
  "Магистраль / Лайнхол",
  "Складская обработка",
];

const emptyContractor = (): Contractor => ({
  id: `c-${Date.now()}`,
  name: "",
  legalEntity: "",
  dmEntity: "",
  costStructure: "",
  contractDate: "",
  contractValidUntil: "",
  tariffAgreementDate: "",
  tariffValidUntil: "",
  comment: "",
  services: "",
  category: "Последняя миля",
  countries: [],
});

export const MatrixPage = () => {
  const { list: contractors, quarters, resetAll } = useContractors();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<ContractorCategory | "all">("all");
  const [view, setView] = useState<"grid" | "table">("table");
  const [selected, setSelected] = useState<Contractor | null>(null);
  const [creating, setCreating] = useState<Contractor | null>(null);
  const [statusFilter, setStatusFilter] = useState<"active" | "expiring" | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return contractors.filter((c) => {
      if (category !== "all" && c.category !== category) return false;
      if (statusFilter === "active") {
        const s = getContractStatus(c);
        if (s !== "active" && s !== "auto-renew") return false;
      }
      if (statusFilter === "expiring") {
        const s = getContractStatus(c);
        if (s !== "expiring") return false;
      }
      if (!q) return true;
      return (
        c.name.toLowerCase().includes(q) ||
        c.legalEntity.toLowerCase().includes(q) ||
        c.services.toLowerCase().includes(q) ||
        c.costStructure.toLowerCase().includes(q) ||
        (c.countries || []).some((x) => x.toLowerCase().includes(q))
      );
    });
  }, [query, category, statusFilter, contractors]);

  const stats = useMemo(() => {
    const total = contractors.length;
    let active = 0, expiring = 0, autoRenew = 0;
    contractors.forEach((c) => {
      const s = getContractStatus(c);
      if (s === "active") active++;
      if (s === "expiring") expiring++;
      if (s === "auto-renew") autoRenew++;
    });
    const countries = new Set<string>();
    contractors.forEach((c) => c.countries?.forEach((x) => countries.add(x)));
    return { total, active, expiring, autoRenew, countries: countries.size };
  }, [contractors]);

  const open = (id: string) => setSelected(contractors.find((c) => c.id === id) || null);

  const handleReset = () => {
    resetAll();
    toast.success("Данные сброшены к исходным");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <header className="relative overflow-hidden bg-gradient-hero text-primary-foreground">
        <div className="absolute inset-0 bg-stripes opacity-30" />
        <div className="absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-accent/30 blur-3xl" />
        <div className="container relative mx-auto px-4 py-10 sm:py-14">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-accent shadow-glow">
              <Truck className="h-7 w-7 text-accent-foreground animate-truck" />
            </div>
            <div className="flex-1 min-w-[260px]">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-glow">DailyMail · 3PL</p>
              <h1 className="font-display text-3xl font-bold sm:text-4xl text-balance">
                Матрица контрагентов
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-primary-foreground/75">
                Единая панель управления всеми логистическими партнёрами: договоры, тарифы, услуги и финансовые показатели по кварталам.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button
                onClick={() => setCreating(emptyContractor())}
                className="bg-gradient-accent text-accent-foreground hover:opacity-90 shadow-glow"
              >
                <Plus className="mr-2 h-4 w-4" /> Добавить контрагента
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="border-primary-foreground/20 bg-primary-foreground/5 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">
                    <RotateCcw className="mr-2 h-4 w-4" /> Сброс
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Сбросить все изменения?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Все правки, добавленные контрагенты и данные по кварталам будут удалены. Восстановятся данные из исходной матрицы.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Отмена</AlertDialogCancel>
                    <AlertDialogAction onClick={handleReset} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                      Сбросить
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* KPI */}
        <section className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
          <KpiCard
            label="Всего контрагентов"
            value={stats.total}
            icon={Building2}
            tone="accent"
            active={statusFilter === null && category === "all" && query === ""}
            onClick={() => { setStatusFilter(null); setCategory("all"); setQuery(""); }}
          />
          <KpiCard
            label="Активные договоры"
            value={stats.active + stats.autoRenew}
            icon={FileCheck2}
            tone="success"
            hint={`${stats.autoRenew} с автопролонгацией`}
            active={statusFilter === "active"}
            onClick={() => setStatusFilter(statusFilter === "active" ? null : "active")}
          />
          <KpiCard
            label="Требуют внимания"
            value={stats.expiring}
            icon={AlertTriangle}
            tone="destructive"
            hint="Истекают / истекли"
            active={statusFilter === "expiring"}
            onClick={() => setStatusFilter(statusFilter === "expiring" ? null : "expiring")}
          />
          <KpiCard label="География" value={stats.countries} icon={Globe2} hint="стран присутствия" />
          <KpiCard label="Категорий услуг" value={CATEGORIES.length} icon={Boxes} hint="тип услуг 3PL" />
        </section>

        {/* Filters */}
        <section className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Поиск по названию, юр. лицу, услуге, стране…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              maxLength={200}
              className="h-11 pl-9"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={category === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => { setCategory("all"); setStatusFilter(null); }}
              className={category === "all" ? "bg-primary" : ""}
            >
              Все
            </Button>
            {CATEGORIES.map((cat) => (
              <Button
                key={cat}
                variant={category === cat ? "default" : "outline"}
                size="sm"
                onClick={() => { setCategory(cat); setStatusFilter(null); }}
                className={category === cat ? "bg-primary" : ""}
              >
                {cat}
              </Button>
            ))}
          </div>
          <div className="flex rounded-lg border bg-card p-0.5">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setView("grid")}
              className={view === "grid" ? "bg-secondary" : ""}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setView("table")}
              className={view === "table" ? "bg-secondary" : ""}
            >
              <TableIcon className="h-4 w-4" />
            </Button>
          </div>
        </section>

        {/* Main grid: contractors + side panel */}
        <section className="grid gap-6 xl:grid-cols-[1fr_360px]">
          <div>
            <div className="mb-3 flex items-center justify-between gap-3 flex-wrap">
              <h2 className="font-display text-xl font-semibold">
                Контрагенты <span className="text-muted-foreground font-normal">· {filtered.length}</span>
              </h2>
              {statusFilter && (
                <button
                  onClick={() => setStatusFilter(null)}
                  className="flex items-center gap-1.5 rounded-full border bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground hover:bg-destructive/10 transition-colors"
                >
                  {statusFilter === "active" ? "✅ Активные договоры" : "⚠️ Требуют внимания"}
                  <span className="ml-1 text-muted-foreground">✕</span>
                </button>
              )}
            </div>

            {view === "grid" ? (
              <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-3">
                {filtered.map((c) => (
                  <ContractorCard key={c.id} c={c} onOpen={() => setSelected(c)} />
                ))}
                {filtered.length === 0 && (
                  <Card className="col-span-full p-10 text-center text-muted-foreground">
                    Контрагенты не найдены
                  </Card>
                )}
              </div>
            ) : (
              <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Контрагент</TableHead>
                        <TableHead>Категория</TableHead>
                        <TableHead>Юр. лицо</TableHead>
                        <TableHead>Договор до</TableHead>
                        <TableHead>Тариф до</TableHead>
                        <TableHead>Статус</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filtered.map((c) => (
                        <TableRow
                          key={c.id}
                          className="cursor-pointer"
                          onClick={() => setSelected(c)}
                        >
                          <TableCell className="font-medium">{c.name}</TableCell>
                          <TableCell className="text-muted-foreground">{c.category}</TableCell>
                          <TableCell className="text-sm text-muted-foreground max-w-xs truncate">{c.legalEntity}</TableCell>
                          <TableCell className="text-sm">{c.contractValidUntil}</TableCell>
                          <TableCell className="text-sm whitespace-pre-line">{c.tariffValidUntil}</TableCell>
                          <TableCell><StatusBadge status={getContractStatus(c)} /></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </Card>
            )}
          </div>

          <aside className="space-y-6">
            <AlertsPanel onSelect={open} />

            <Card className="overflow-hidden border bg-gradient-card">
              <div className="flex items-center gap-3 border-b bg-secondary/60 px-5 py-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Package className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-display text-base font-semibold">Сводка по кварталам</h3>
                  <p className="text-xs text-muted-foreground">Объёмы и затраты на услуги</p>
                </div>
              </div>
              <Tabs defaultValue="volume" className="px-5 pb-5 pt-3">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="volume">Объёмы</TabsTrigger>
                  <TabsTrigger value="cost">Затраты, $</TabsTrigger>
                </TabsList>
                <TabsContent value="volume" className="mt-3">
                  <QuarterSummary kind="volume" />
                </TabsContent>
                <TabsContent value="cost" className="mt-3">
                  <QuarterSummary kind="cost" />
                </TabsContent>
              </Tabs>
              <p className="px-5 pb-5 text-xs text-muted-foreground">
                Откройте карточку контрагента, чтобы заполнить данные по периодам.
              </p>
            </Card>
          </aside>
        </section>

        <footer className="pt-6 pb-2 text-center text-xs text-muted-foreground">
          Источник: «Матрица контрагентов 3PL» · DailyMail Operations · Изменения сохраняются локально в браузере
        </footer>
      </main>

      <ContractorEditDialog
        contractor={selected}
        open={!!selected}
        onOpenChange={(v) => !v && setSelected(null)}
      />
      <ContractorEditDialog
        contractor={creating}
        isNew
        open={!!creating}
        onOpenChange={(v) => !v && setCreating(null)}
      />
    </div>
  );
};

function QuarterSummary({ kind }: { kind: "volume" | "cost" }) {
  const { quarters } = useContractors();
  const totals: Record<Quarter, { sum: number; count: number }> = QUARTERS.reduce((acc, q) => {
    acc[q] = { sum: 0, count: 0 };
    return acc;
  }, {} as Record<Quarter, { sum: number; count: number }>);

  Object.values(quarters).forEach((perId) => {
    QUARTERS.forEach((q) => {
      const v = perId?.[q]?.[kind];
      if (!v) return;
      const n = Number(String(v).replace(/[^\d.-]/g, ""));
      if (!Number.isNaN(n) && n !== 0) {
        totals[q].sum += n;
        totals[q].count++;
      }
    });
  });

  return (
    <ul className="space-y-1.5">
      {QUARTERS.map((q) => {
        const t = totals[q];
        const display = t.count > 0
          ? kind === "cost"
            ? `$ ${t.sum.toLocaleString("ru-RU")}`
            : t.sum.toLocaleString("ru-RU")
          : "—";
        return (
          <li
            key={q}
            className="flex items-center justify-between rounded-lg border bg-background px-3 py-2 text-sm"
          >
            <span className="font-medium">{q}</span>
            <span className={t.count > 0 ? "font-semibold text-foreground" : "text-muted-foreground"}>{display}</span>
          </li>
        );
      })}
    </ul>
  );
}


