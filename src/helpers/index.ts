import { NOT_FOUND_ITEM_INDEX } from "@/constants";

export function containElement(searchArr: any[], rowId: string, idKey = "id") {
  return (
    searchArr.findIndex((el) => el[idKey] === rowId) !== NOT_FOUND_ITEM_INDEX
  );
}
