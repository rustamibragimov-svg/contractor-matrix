import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/shared/components/ui/dialog";
import { Contractor, ContractorCategory, getContractStatus, getTariffStatus, QUARTERS } from "@/apps/matrix/data/contractors";
import { StatusBadge } from "./StatusBadge";
import { Separator } from "@/shared/components/ui/separator";
import { Building2, Save, Trash2, Plus } from "lucide-react";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { Label } from "@/shared/components/ui/label";
import { Button } from "@/shared/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/shared/components/ui/select";
import { useContractors, QuarterData } from "@/apps/matrix/store/contractors-store";
import { toast } from "sonner";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/shared/components/ui/alert-dialog";

const CATEGORIES: ContractorCategory[] = [
  "Последняя миля",
  "Сортировка / Обработка",
  "Таможня",
  "Магистраль / Лайнхол",
  "Складская обработка",
];

interface Props {
  contractor: Contractor | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  isNew?: boolean;
}

const MAX = {
  short: 200,
  long: 2000,
  num: 30,
};

export function ContractorEditDialog({ contractor, open, onOpenChange, isNew }: Props) {
  const { updateContractor, addContractor, removeContractor, updateQuarter, quarters } = useContractors();
  const [draft, setDraft] = useState<Contractor | null>(contractor);
  const [qDraft, setQDraft] = useState<QuarterData[string]>({});

  useEffect(() => {
    setDraft(contractor);
    setQDraft(contractor ? quarters[contractor.id] || {} : {});
  }, [contractor, quarters, open]);

  if (!draft) return null;

  const set = <K extends keyof Contractor>(key: K, value: Contractor[K]) =>
    setDraft((d) => (d ? { ...d, [key]: value } : d));

  const handleSave = () => {
    if (!draft.name.trim()) {
      toast.error("Укажите название подрядчика");
      return;
    }
    if (draft.name.length > MAX.short) {
      toast.error("Название слишком длинное");
      return;
    }
    if (draft.comment && draft.comment.length > MAX.long) {
      toast.error("Комментарий слишком длинный");
      return;
    }

    if (isNew) {
      addContractor(draft);
    } else {
      updateContractor(draft.id, draft);
    }
    // Save quarter data
    QUARTERS.forEach((q) => {
      const v = qDraft[q];
      if (v) updateQuarter(draft.id, q, v);
    });
    toast.success(isNew ? "Подрядчик добавлен" : "Изменения сохранены");
    onOpenChange(false);
  };

  const handleDelete = () => {
    removeContractor(draft.id);
    toast.success("Подрядчик удалён");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[92vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-accent text-accent-foreground shadow-glow">
              <Building2 className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <DialogTitle className="font-display text-2xl text-balance">
                {isNew ? "Новый подрядчик" : draft.name}
              </DialogTitle>
              {!isNew && (
                <div className="mt-3 flex flex-wrap gap-2">
                  <StatusBadge status={getContractStatus(draft)} />
                  <StatusBadge status={getTariffStatus(draft)} />
                </div>
              )}
            </div>
          </div>
        </DialogHeader>

        <Separator className="my-2" />

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Название подрядчика" required>
            <Input value={draft.name} maxLength={MAX.short} onChange={(e) => set("name", e.target.value)} />
          </Field>
          <Field label="Категория">
            <Select value={draft.category} onValueChange={(v) => set("category", v as ContractorCategory)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Юридическое лицо подрядчика">
            <Input value={draft.legalEntity} maxLength={MAX.short} onChange={(e) => set("legalEntity", e.target.value)} />
          </Field>
          <Field label="Юр. лицо DailyMail">
            <Textarea rows={2} value={draft.dmEntity} maxLength={MAX.long} onChange={(e) => set("dmEntity", e.target.value)} />
          </Field>
          <Field label="Структура костовой матрицы" full>
            <Textarea rows={2} value={draft.costStructure} maxLength={MAX.long} onChange={(e) => set("costStructure", e.target.value)} />
          </Field>
          <Field label="Оказываемые услуги" full>
            <Textarea rows={2} value={draft.services} maxLength={MAX.long} onChange={(e) => set("services", e.target.value)} />
          </Field>
          <Field label="Дата заключения договора">
            <Input value={draft.contractDate} maxLength={MAX.short} onChange={(e) => set("contractDate", e.target.value)} placeholder="дд.мм.гггг" />
          </Field>
          <Field label="Дата действия договора">
            <Input value={draft.contractValidUntil} maxLength={MAX.short} onChange={(e) => set("contractValidUntil", e.target.value)} placeholder="дд.мм.гггг или Автопролонгация" />
          </Field>
          <Field label="Дата заключения ДС с тарифами">
            <Textarea rows={2} value={draft.tariffAgreementDate} maxLength={MAX.long} onChange={(e) => set("tariffAgreementDate", e.target.value)} />
          </Field>
          <Field label="Дата действия тарифа">
            <Textarea rows={2} value={draft.tariffValidUntil} maxLength={MAX.long} onChange={(e) => set("tariffValidUntil", e.target.value)} />
          </Field>
          <Field label="Страны (через запятую)" full>
            <Input
              value={(draft.countries || []).join(", ")}
              maxLength={MAX.short}
              onChange={(e) =>
                set(
                  "countries",
                  e.target.value
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean)
                )
              }
            />
          </Field>
          <Field label="Комментарий" full>
            <Textarea rows={3} value={draft.comment} maxLength={MAX.long} onChange={(e) => set("comment", e.target.value)} />
          </Field>
        </div>

        <Separator className="my-2" />

        <div>
          <h4 className="mb-3 font-display text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Объёмы и затраты по кварталам
          </h4>
          <div className="overflow-hidden rounded-xl border">
            <table className="w-full text-sm">
              <thead className="bg-secondary">
                <tr>
                  <th className="px-3 py-2 text-left font-semibold">Квартал</th>
                  <th className="px-3 py-2 text-left font-semibold">Объём услуг</th>
                  <th className="px-3 py-2 text-left font-semibold">Затраты, $</th>
                </tr>
              </thead>
              <tbody>
                {QUARTERS.map((q) => {
                  const v = qDraft[q] || { volume: "", cost: "" };
                  return (
                    <tr key={q} className="border-t">
                      <td className="px-3 py-2 font-medium whitespace-nowrap">{q}</td>
                      <td className="px-2 py-1.5">
                        <Input
                          value={v.volume}
                          maxLength={MAX.num}
                          placeholder="—"
                          onChange={(e) =>
                            setQDraft((p) => ({ ...p, [q]: { ...p[q], volume: e.target.value, cost: p[q]?.cost ?? "" } }))
                          }
                          className="h-8"
                        />
                      </td>
                      <td className="px-2 py-1.5">
                        <Input
                          value={v.cost}
                          maxLength={MAX.num}
                          placeholder="—"
                          onChange={(e) =>
                            setQDraft((p) => ({ ...p, [q]: { ...p[q], cost: e.target.value, volume: p[q]?.volume ?? "" } }))
                          }
                          className="h-8"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <DialogFooter className="mt-4 gap-2 sm:justify-between">
          {!isNew ? (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="text-destructive hover:text-destructive">
                  <Trash2 className="mr-2 h-4 w-4" /> Удалить
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Удалить подрядчика?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Это действие нельзя отменить. «{draft.name}» будет удалён вместе со всеми данными по кварталам.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Отмена</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    Удалить
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          ) : <span />}
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>Отмена</Button>
            <Button onClick={handleSave} className="bg-gradient-accent text-accent-foreground hover:opacity-90">
              {isNew ? <><Plus className="mr-2 h-4 w-4" /> Добавить</> : <><Save className="mr-2 h-4 w-4" /> Сохранить</>}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, children, required, full }: { label: string; children: React.ReactNode; required?: boolean; full?: boolean }) {
  return (
    <div className={`space-y-1.5 ${full ? "sm:col-span-2" : ""}`}>
      <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}{required && <span className="text-destructive ml-1">*</span>}
      </Label>
      {children}
    </div>
  );
}
