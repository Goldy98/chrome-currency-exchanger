export function applyRequiredValidation(value?: string) {
  if (value !== undefined && value.toString().trim()) {
    return true;
  }
  return "This field is required";
}

export function applyMinMaxValidationForNumber(
  value?: string,
  min?: number,
  max?: number
): string | true {
  if (value === undefined || value === "") return "Invalid value";

  const numberValue = parseFloat(value.toString().trim());

  if (min !== undefined) {
    if (numberValue < min) return `The value must be greater than ${min}`;
  }

  if (max !== undefined)
    if (numberValue > max) return `The value must be lighter ${max}`;

  return true;
}

export function applyMinMaxValidationForString(
  value: string,
  min?: number,
  max?: number
): string | true {
  if (min && value.length < min)
    return `Ce champs doit comporter au moins ${min} caractères`;

  if (max && value.length > max)
    return `Ce champs doit comporter au plus ${min} caractères`;

  return true;
}
