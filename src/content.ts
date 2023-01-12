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

document.body.appendChild(convertButton);
document.body.appendChild(cancelButton);

let buttonIsDisplayed = false;
let currentConverterForm: App | null;

document.addEventListener("mouseup", (event) => {
  if (buttonIsDisplayed || currentConverterForm) return;
  const windowSelectionAsNumber = getWindowSelectionIfNumber();

  if (windowSelectionAsNumber) {
    convertButton.style.top = event.pageY + "px";
    convertButton.style.left = event.pageX + "px";
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

document.addEventListener("selectionchange", (_) => {
  // When the user click on the page while having a texte selected
  if (!window.getSelection()?.toString() && buttonIsDisplayed) {
    convertButton.style.display = "none";
    buttonIsDisplayed = false;
    window.getSelection()?.empty();
  }
});

cancelButton.addEventListener("click", (_) => {
  if (currentConverterForm) {
    currentConverterForm.unmount();
    currentConverterForm = null;
    cancelButton.style.display = "none";
    window.getSelection()?.empty();
  }
});

convertButton.addEventListener("click", (event) => {
  const windowSelectionAsNumber = getWindowSelectionIfNumber();

  if (windowSelectionAsNumber) {
    currentConverterForm = appendConverterPopUpForm(
      event.pageX + "px",
      event.pageY + "px",
      windowSelectionAsNumber
    ).app;

    cancelButton.style.top = event.pageY - 20 + "px";
    cancelButton.style.left = event.pageX + 317 + "px";
    cancelButton.style.display = "block";

    buttonIsDisplayed = true;
  }

  convertButton.style.display = "none";
  buttonIsDisplayed = false;
});
