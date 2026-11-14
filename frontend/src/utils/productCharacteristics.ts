import type { Locale } from "../i18n/messages";
import {
  catalogMessages,
  type CatalogUiMessages,
} from "../i18n/catalogMessages";

export type ProductCharacteristicKey =
  | "fat_procent"
  | "weight"
  | "storage_conditions"
  | "shelf_life"
  | "energy_value"
  | "items_per_case";

export interface ProductCharacteristicValues {
  fat_procent: number | null;
  weight: string | null;
  storage_conditions: string | null;
  shelf_life: string | null;
  energy_value: string | null;
  items_per_case: string | null;
}

export interface ProductCharacteristicFormValues {
  fat_procent: string;
  weight: string;
  storage_conditions: string;
  shelf_life: string;
  energy_value: string;
  items_per_case: string;
}

export interface ProductCharacteristicDefinition {
  key: ProductCharacteristicKey;
  label: string;
  type: "number" | "text";
  unit?: string;
}

export interface VisibleProductCharacteristic
  extends ProductCharacteristicDefinition {
  value: number | string;
}

type CharacteristicLabelKey =
  | "characteristicFatProcent"
  | "characteristicWeight"
  | "characteristicStorageConditions"
  | "characteristicShelfValue"
  | "characteristicEnergyValue"
  | "characteristicItemPerCase";

interface CharacteristicConfiguration {
  key: ProductCharacteristicKey;
  labelKey: CharacteristicLabelKey;
  type: "number" | "text";
  unit?: string;
}

// Шесть фиксированных характеристик товара.
// Добавление произвольных характеристик не предусмотрено.
const CHARACTERISTIC_CONFIGURATIONS: readonly CharacteristicConfiguration[] = [
  {
    key: "fat_procent",
    labelKey: "characteristicFatProcent",
    type: "number",
    unit: "%",
  },
  {
    key: "weight",
    labelKey: "characteristicWeight",
    type: "text",
  },
  {
    key: "storage_conditions",
    labelKey: "characteristicStorageConditions",
    type: "text",
  },
  {
    key: "shelf_life",
    labelKey: "characteristicShelfValue",
    type: "text",
  },
  {
    key: "energy_value",
    labelKey: "characteristicEnergyValue",
    type: "text",
  },
  {
    key: "items_per_case",
    labelKey: "characteristicItemPerCase",
    type: "text",
  },
];

export const EMPTY_PRODUCT_CHARACTERISTICS: ProductCharacteristicFormValues = {
  fat_procent: "",
  weight: "",
  storage_conditions: "",
  shelf_life: "",
  energy_value: "",
  items_per_case: "",
};

// Возвращает определения характеристик с переводами для выбранного языка.
export function getProductCharacteristicDefinitions(
  locale: Locale
): ProductCharacteristicDefinition[] {
  const messages: CatalogUiMessages = catalogMessages[locale];

  return CHARACTERISTIC_CONFIGURATIONS.map((configuration) => ({
    key: configuration.key,
    label: messages[configuration.labelKey],
    type: configuration.type,
    ...(configuration.unit
      ? { unit: configuration.unit }
      : {}),
  }));
}

// Преобразует данные backend или attributes товара
// в единый тип шести характеристик.
export function readProductCharacteristics(
  source: object
): ProductCharacteristicValues {
  const record =
    typeof source === "object" && source !== null
      ? (source as Record<string, unknown>)
      : {};

  const rawFatProcent = record.fat_procent;

  let fatProcent: number | null = null;

  if (
    typeof rawFatProcent === "number" &&
    Number.isFinite(rawFatProcent)
  ) {
    fatProcent = rawFatProcent;
  } else if (
    typeof rawFatProcent === "string" &&
    rawFatProcent.trim() !== ""
  ) {
    const parsed = Number(rawFatProcent);

    if (Number.isFinite(parsed)) {
      fatProcent = parsed;
    }
  }

  const readText = (key: ProductCharacteristicKey): string | null => {
    const value = record[key];

    if (typeof value !== "string") {
      return null;
    }

    const normalized = value.trim();

    return normalized.length > 0 ? normalized : null;
  };

  return {
    fat_procent: fatProcent,
    weight: readText("weight"),
    storage_conditions: readText("storage_conditions"),
    shelf_life: readText("shelf_life"),
    energy_value: readText("energy_value"),
    items_per_case: readText("items_per_case"),
  };
}

// Преобразует характеристики товара в значения для HTML-формы.
export function characteristicsToFormValues(
  source: Partial<ProductCharacteristicValues>
): ProductCharacteristicFormValues {
  return {
    fat_procent:
      source.fat_procent === null ||
      source.fat_procent === undefined
        ? ""
        : String(source.fat_procent),

    weight: source.weight ?? "",
    storage_conditions: source.storage_conditions ?? "",
    shelf_life: source.shelf_life ?? "",
    energy_value: source.energy_value ?? "",
    items_per_case: source.items_per_case ?? "",
  };
}

// Преобразует значения формы в формат характеристик frontend.
export function characteristicsFromFormValues(
  source: ProductCharacteristicFormValues
): ProductCharacteristicValues {
  const fatText = source.fat_procent.trim();

  const fatProcent =
    fatText === "" ? null : Number(fatText);

  return {
    fat_procent:
      fatProcent !== null && Number.isFinite(fatProcent)
        ? fatProcent
        : null,

    weight: normalizeText(source.weight),
    storage_conditions: normalizeText(source.storage_conditions),
    shelf_life: normalizeText(source.shelf_life),
    energy_value: normalizeText(source.energy_value),
    items_per_case: normalizeText(source.items_per_case),
  };
}

// Возвращает только заполненные характеристики для публичной карточки товара.
export function getVisibleProductCharacteristics(
  source: object,
  locale: Locale
): VisibleProductCharacteristic[] {
  const values = readProductCharacteristics(source);
  const definitions = getProductCharacteristicDefinitions(locale);

  return definitions.flatMap((definition) => {
    const value = values[definition.key];

    if (value === null) {
      return [];
    }

    return [
      {
        ...definition,
        value,
      },
    ];
  });
}

function normalizeText(value: string): string | null {
  const normalized = value.trim();

  return normalized.length > 0 ? normalized : null;
}