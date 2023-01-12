import { NOT_FOUND_ITEM_INDEX } from "@/constants";

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

export function getWindowSelectionIfNumber() {
  const selectedText = window.getSelection()?.toString();

  const numberValue = getNumberValue(
    selectedText?.replaceAll(",", ".").replaceAll(" ", "")
  );

  if (selectedText && numberValue) return numberValue;

  return undefined;
}
