enum BaseInputType {
  TEXT = "text",
  NUMBER = "number",
  EMAIL = "email",
  PASSWORD = "password",
  DATE = "date",
}

type SupportedEvent = "SelectedNumber";

export type ActivePageEvent = {
  name: SupportedEvent;
  payload: any;
};

export default BaseInputType;
