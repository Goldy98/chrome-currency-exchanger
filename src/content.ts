import { App } from "vue";
import { getWindowSelectionIfNumber } from "./helpers";
import {
  loadComponentStyleIntoDom,
  appendConverterPopUpForm,
  buildIconButton,
} from "./window-ui";

type SupportedEvent = "SelectedNumber";

export type ActivePageEvent = {
  name: SupportedEvent;
  payload: any;
};

loadComponentStyleIntoDom();

const convertButton = buildIconButton("launchCurrencyConverterButton");
const cancelButton = buildIconButton("closeCurrencyConverterButton");

let buttonIsDisplayed = false;
let currentConverterForm: App | null;

document.addEventListener("mouseup", (event) => {
  if (buttonIsDisplayed) return;
  const windowSelectionAsNumber = getWindowSelectionIfNumber();

  if (windowSelectionAsNumber) {
    convertButton.style.top = event.clientY - 20 + "px";
    convertButton.style.left = event.clientX + 5 + "px";
    convertButton.style.display = "block";
    buttonIsDisplayed = true;

    // Send the selected text to the extension
    chrome.runtime.sendMessage<ActivePageEvent>({
      name: "SelectedNumber",
      payload: windowSelectionAsNumber,
    });
  } else {
    convertButton.style.display = "none";
    buttonIsDisplayed = false;
  }
});

document.body.appendChild(convertButton);
document.body.appendChild(cancelButton);

cancelButton.addEventListener("click", (_) => {
  if (currentConverterForm) {
    currentConverterForm.unmount();
    currentConverterForm = null;
    cancelButton.style.display = "none";
  }
});

convertButton.addEventListener("click", (event) => {
  const windowSelectionAsNumber = getWindowSelectionIfNumber();

  if (windowSelectionAsNumber) {
    currentConverterForm = appendConverterPopUpForm(
      event.clientX + "px",
      event.clientY + "px",
      windowSelectionAsNumber
    ).app;

    cancelButton.style.top = event.clientY - 20 + "px";
    cancelButton.style.left = event.clientX + 317 + "px";
    cancelButton.style.display = "block";

    buttonIsDisplayed = true;
  }

  convertButton.style.display = "none";
  buttonIsDisplayed = false;
});

export {};
