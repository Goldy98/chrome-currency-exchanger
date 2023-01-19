import { NOT_FOUND_ITEM_INDEX, SUPPORTED_CURRENCY_SYMBOLS } from "@/constants";
import { WindowSelection } from "@/constants/types";

export function containElement(searchArr: any[], rowId: string, idKey = "id") {
  return (
    searchArr.findIndex((el) => el[idKey] === rowId) !== NOT_FOUND_ITEM_INDEX
  );
}

export function getNumberValue(value: string = "") {
  try {
    const numberValue = parseFloat(value);
    return numberValue;
  } catch (error) {
    return undefined;
  }
}

function cleanUndefOrNull<T>(obj: T): T {
  const res = {} as any;
  for (const [key, val] of (Object as any).entries(obj)) {
    if (val !== undefined && val !== null) res[key] = val;
  }
  return res;
}

export function getWindowSelectionIfNumber(): WindowSelection | undefined {
  const selectedText = window.getSelection()?.toString();

  const sanitizedText = selectedText?.replaceAll(",", ".").replaceAll(" ", "");

  let currencyCodeFromFoundSymbol: string | undefined;
  let amount: number | undefined;

  Object.keys(SUPPORTED_CURRENCY_SYMBOLS).forEach((symbol) => {
    if (sanitizedText?.startsWith(symbol) || sanitizedText?.endsWith(symbol)) {
      currencyCodeFromFoundSymbol = (SUPPORTED_CURRENCY_SYMBOLS as any)[symbol];
      const splittedSanitizedText = sanitizedText.split(symbol);

      const numberValue = splittedSanitizedText.find((el) =>
        getNumberValue(el)
      );
      if (numberValue !== undefined) amount = +numberValue;
    }
  });

  if (selectedText && amount)
    return cleanUndefOrNull({
      amount,
      currencyCode: currencyCodeFromFoundSymbol,
    });

  return undefined;
}
