export type ContractStatus = "active" | "auto-renew" | "expiring" | "no-contract" | "pending";

export interface Contractor {
  id: string;
  name: string;
  legalEntity: string;
  dmEntity: string;
  costStructure: string;
  contractDate: string;
  contractValidUntil: string;
  tariffAgreementDate: string;
  tariffValidUntil: string;
  comment: string;
  services: string;
  category: ContractorCategory;
  countries?: string[];
}

export type ContractorCategory =
  | "Последняя миля"
  | "Сортировка / Обработка"
  | "Таможня"
  | "Магистраль / Лайнхол"
  | "Складская обработка";

export const QUARTERS = ["Q3 2025", "Q4 2025", "Q1 2026", "Q2 2026", "Q3 2026", "Q4 2026"] as const;
export type Quarter = (typeof QUARTERS)[number];

export const contractors: Contractor[] = [
  {
    id: "post-by",
    name: "Почта Беларуси (через Почту Узбекистана)",
    legalEntity: "АО «O'ZBEKISTON POCHTASI»",
    dmEntity: 'OOO "Daily Mail Zenith FZE"',
    costStructure: "Последняя миля в странах СНГ",
    contractDate: "20.02.2023",
    contractValidUntil: "Автопролонгация",
    tariffAgreementDate: "30.12.2025 — Мелкие пакеты\n30.12.2025 — Посылки",
    tariffValidUntil: "31.12.2026",
    comment: "Отсутствует",
    services: "Последняя миля",
    category: "Последняя миля",
    countries: ["Беларусь"],
  },
  {
    id: "post-kz",
    name: "Почта Казахстана (через Почту Узбекистана)",
    legalEntity: "АО «O'ZBEKISTON POCHTASI»",
    dmEntity: 'OOO "Daily Mail Zenith FZE"',
    costStructure: "Последняя миля в странах СНГ",
    contractDate: "20.02.2023",
    contractValidUntil: "Автопролонгация",
    tariffAgreementDate: "30.12.2025 — Мелкие пакеты\n30.12.2025 — Посылки",
    tariffValidUntil: "31.12.2026",
    comment: "Отсутствует",
    services: "Последняя миля",
    category: "Последняя миля",
    countries: ["Казахстан"],
  },
  {
    id: "post-kg",
    name: "Почта Киргизии (через Почту Узбекистана)",
    legalEntity: 'ОАО "КЫРГЫЗ ПОЧТАСЫ"',
    dmEntity: 'OOO "Daily Mail Zenith FZE"',
    costStructure: "Последняя миля в странах СНГ",
    contractDate: "01.10.2023",
    contractValidUntil: "Автопролонгация",
    tariffAgreementDate: "31.03.2025 — Транзит из Китая\n04.04.2024 — Транзит из Узбекистана",
    tariffValidUntil: "Автопролонгация",
    comment: "Отсутствует",
    services: "Последняя миля / Обработка транзитного груза из Узбекистана / Обработка транзитного груза из Китая",
    category: "Последняя миля",
    countries: ["Киргизия"],
  },
  {
    id: "post-ru",
    name: "Почта России (через Почту Узбекистана)",
    legalEntity: "АО «O'ZBEKISTON POCHTASI»",
    dmEntity: 'OOO "Daily Mail Zenith FZE"',
    costStructure: "Последняя миля в странах СНГ",
    contractDate: "20.02.2023",
    contractValidUntil: "Автопролонгация",
    tariffAgreementDate: "31.05.2023 — все продукты последней мили",
    tariffValidUntil: "Автопролонгация",
    comment: "Необходимо подписать ДС, в котором будут определены веса по каждому продукту.",
    services: "Последняя миля",
    category: "Последняя миля",
    countries: ["Россия"],
  },
  {
    id: "post-az",
    name: "Почта Азербайджана (через Почту Узбекистана)",
    legalEntity: "АО «O'ZBEKISTON POCHTASI»",
    dmEntity: 'OOO "Daily Mail Zenith FZE"',
    costStructure: "Последняя миля в странах СНГ",
    contractDate: "20.02.2023",
    contractValidUntil: "Автопролонгация",
    tariffAgreementDate: "30.12.2025",
    tariffValidUntil: "31.12.2026",
    comment: "Отсутствует",
    services: "Последняя миля",
    category: "Последняя миля",
    countries: ["Азербайджан"],
  },
  {
    id: "post-uz",
    name: "Почта Узбекистана",
    legalEntity: "АО «O'ZBEKISTON POCHTASI»",
    dmEntity: 'OOO "CPT POCHTA" — последняя миля в Узбекистане\nOOO "Daily Mail Zenith FZE" — лейблинг и лайнхол',
    costStructure: "Последняя миля в странах СНГ",
    contractDate: "10.11.2022",
    contractValidUntil: "Автопролонгация",
    tariffAgreementDate: "23.10.2024 — Посылки\n01.01.2026 — Мелкие пакеты",
    tariffValidUntil: "Автопролонгация — Посылки / Лейблинг\n31.12.2026 — Мелкие пакеты / Лайнхол",
    comment: "Отсутствует",
    services: "Последняя миля / Лейблинг / Авиа лайнхол в Казахстан, Кыргызстан, Азербайджан, Беларусь",
    category: "Последняя миля",
    countries: ["Узбекистан"],
  },
  {
    id: "clh",
    name: "CLH",
    legalEntity: "—",
    dmEntity: "—",
    costStructure: "Магистральная перевозка авиа УЗ — Страны СНГ / Последняя миля в странах СНГ",
    contractDate: "—",
    contractValidUntil: "—",
    tariffAgreementDate: "—",
    tariffValidUntil: "—",
    comment: "Тариф на согласовании",
    services: "Последняя миля / Лайнхол Грузия–Армения, Грузия–Азербайджан",
    category: "Магистраль / Лайнхол",
    countries: ["Грузия", "Армения", "Азербайджан"],
  },
  {
    id: "declarant",
    name: "Declarant Support",
    legalEntity: 'OOO "DECLARANT SUPPORT"',
    dmEntity: 'ООО "Daily Mail"',
    costStructure: "Таможенная очистка в УЗ (импорт B2C) / Обработка перелимитов в УЗ",
    contractDate: "01.12.2022",
    contractValidUntil: "Автопролонгация",
    tariffAgreementDate: "16.07.2025 — обновлённые тарифы\n01.09.2025 — тарифы для UZUM",
    tariffValidUntil: "Автопролонгация",
    comment: "Отсутствует",
    services: "Таможенное декларирование B2C грузов в Узбекистане",
    category: "Таможня",
    countries: ["Узбекистан"],
  },
  {
    id: "nwl",
    name: "NWL Operations",
    legalEntity: "ООО «NWL OPERATIONS»",
    dmEntity: 'ООО "Daily Mail"',
    costStructure: "Сортировка груза в УЗ",
    contractDate: "06.01.2026",
    contractValidUntil: "31.12.2026",
    tariffAgreementDate: "06.01.2026",
    tariffValidUntil: "31.12.2026",
    comment: "Обновили договор с учётом повышения тарифов на 2026 год",
    services: "Обработка курьерских отправлений в Ташкенте",
    category: "Сортировка / Обработка",
    countries: ["Узбекистан"],
  },
  {
    id: "own",
    name: "Own (внутренние мощности)",
    legalEntity: "N/A",
    dmEntity: "N/A",
    costStructure: "Таможенная очистка в УЗ (импорт B2C) / Сортировка груза в УЗ",
    contractDate: "N/A",
    contractValidUntil: "N/A",
    tariffAgreementDate: "N/A",
    tariffValidUntil: "N/A",
    comment: "Кост рассчитан совместно с финансовым отделом с учётом ФОТ и коммунальных затрат.",
    services: "Сортировка отправок в Ташкенте по продуктам Магистраль и C2M",
    category: "Сортировка / Обработка",
    countries: ["Узбекистан"],
  },
  {
    id: "swe",
    name: "SWE",
    legalEntity: "Silk Way Express Co., Ltd.",
    dmEntity: 'OOO "Daily Mail Zenith FZE"',
    costStructure: "Перевозка по Китаю / Складская обработка в Китае",
    contractDate: "19.06.2024",
    contractValidUntil: "31.12.2025",
    tariffAgreementDate: "22.12.2025",
    tariffValidUntil: "31.12.2026",
    comment:
      "Тарифы не указаны в договоре. Собираем эксель-таблицу со всеми услугами и костами SWE. Подтвердим по email и зафиксируем файл в общем диске 3PL.",
    services: "Перевозка по Китаю / Складская обработка в Китае / Таможенное оформление в Китае",
    category: "Складская обработка",
    countries: ["Китай"],
  },
  {
    id: "transatlantic",
    name: "Transatlantic",
    legalEntity: 'ООО "Транс Атлантик"',
    dmEntity: 'ООО "Daily Mail"',
    costStructure:
      "Таможенное оформление в РФ (экспорт B2C) / Доставка до аэропорта в РФ / Таможенное оформление в РФ (экспорт B2C)",
    contractDate: "27.03.2025",
    contractValidUntil: "31.12.2025",
    tariffAgreementDate: "21.04.2025",
    tariffValidUntil: "31.12.2026",
    comment: "Отсутствует",
    services: "Экспортное / импортное таможенное оформление B2C в России и сопутствующие услуги",
    category: "Таможня",
    countries: ["Россия"],
  },
  {
    id: "gtk",
    name: "ГТК (Ташкент-Аэро)",
    legalEntity: "Специализированный таможенный комплекс Ташкент-Аэро",
    dmEntity: 'ООО "Daily Mail"',
    costStructure: "Таможенная очистка в УЗ (импорт B2C)",
    contractDate: "N/A",
    contractValidUntil: "N/A",
    tariffAgreementDate: "N/A",
    tariffValidUntil: "N/A",
    comment:
      "Договор не требуется, осуществляется предоплата в СТК на специализированный счёт нашей курьерской компании. Списание происходит автоматически.",
    services: "Оплата таможенных сборов 2% от БРВ",
    category: "Таможня",
    countries: ["Узбекистан"],
  },
  {
    id: "uzum",
    name: "UZUM",
    legalEntity: 'OOO "ZENIT TEHNOLOGII"',
    dmEntity: 'ООО "Daily Mail"',
    costStructure: "Последняя миля в странах СНГ",
    contractDate: "03.10.2022",
    contractValidUntil: "Автопролонгация",
    tariffAgreementDate: "03.10.2022",
    tariffValidUntil: "Автопролонгация",
    comment: "Подписали Доп. Соглашение №2 на продление условий договора с автопролонгацией",
    services: "Последняя миля",
    category: "Последняя миля",
    countries: ["Узбекистан"],
  },
];

/** Парсит дату формата "31.12.2026" -> Date | null. "Автопролонгация"/"N/A"/"—" -> null. */
export function parseDate(value: string): Date | null {
  if (!value) return null;
  const m = value.match(/(\d{2})\.(\d{2})\.(\d{4})/);
  if (!m) return null;
  return new Date(Number(m[3]), Number(m[2]) - 1, Number(m[1]));
}

export function getContractStatus(c: Contractor, today = new Date()): ContractStatus {
  if (c.contractValidUntil === "N/A" || c.contractValidUntil === "—") return "no-contract";
  if (c.contractValidUntil.toLowerCase().includes("автопролонгация")) return "auto-renew";
  const d = parseDate(c.contractValidUntil);
  if (!d) return "pending";
  const days = Math.floor((d.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  if (days < 0) return "expiring";
  if (days < 90) return "expiring";
  return "active";
}

export function getTariffStatus(c: Contractor, today = new Date()): ContractStatus {
  if (c.tariffValidUntil === "N/A" || c.tariffValidUntil === "—") return "no-contract";
  if (c.tariffValidUntil.toLowerCase().includes("автопролонгация")) return "auto-renew";
  const dates = c.tariffValidUntil.match(/\d{2}\.\d{2}\.\d{4}/g);
  if (!dates) return "pending";
  const earliest = dates.map((d) => parseDate(d)!).sort((a, b) => a.getTime() - b.getTime())[0];
  const days = Math.floor((earliest.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  if (days < 0) return "expiring";
  if (days < 90) return "expiring";
  return "active";
}
