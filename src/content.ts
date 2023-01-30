import "@webcomponents/webcomponentsjs";
import { App } from "vue";
import { ActivePageEvent } from "./constants/types";
import { getWindowSelectionIfNumber } from "./helpers";
import {
  loadComponentStyleIntoDom,
  appendConverterPopUpForm,
  buildIconButton,
} from "./window-ui";

loadComponentStyleIntoDom();

const convertButton = buildIconButton("launchCurrencyConverterButton");
const cancelButton = buildIconButton("closeCurrencyConverterButton");

document.body.appendChild(convertButton);
document.body.appendChild(cancelButton);

let buttonIsDisplayed = false;
let currentConverterForm: App | null;
let currentConverterFormElement: HTMLElement | null;

document.addEventListener("mouseup", (event) => {
  if (buttonIsDisplayed || currentConverterForm) return;
  const windowSelectionAsNumber = getWindowSelectionIfNumber();

  if (windowSelectionAsNumber) {
    convertButton.style.top = `${event.pageY}px`;
    convertButton.style.left = `${event.pageX}px`;
    convertButton.style.display = "flex";
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

document.addEventListener("selectionchange", () => {
  // When the user click on the page while having a text selected
  if (!window.getSelection()?.toString() && buttonIsDisplayed) {
    convertButton.style.display = "none";
    buttonIsDisplayed = false;
    window.getSelection()?.empty();
  }
});

cancelButton.addEventListener("click", () => {
  if (currentConverterForm) {
    currentConverterForm.unmount();
    currentConverterForm = null;
    cancelButton.style.display = "none";
    window.getSelection()?.empty();
    currentConverterFormElement?.remove();
  }
});

convertButton.addEventListener("click", (event) => {
  const windowSelectionAsNumber = getWindowSelectionIfNumber();

  if (windowSelectionAsNumber) {
    const { app, converterForm } = appendConverterPopUpForm(
      `${event.pageX}px`,
      `${event.pageY}px`,
      windowSelectionAsNumber
    );

    currentConverterForm = app;
    currentConverterFormElement = converterForm;

    // eslint-disable-next-line no-magic-numbers
    cancelButton.style.top = `${event.pageY - 15}px`;
    // eslint-disable-next-line no-magic-numbers
    cancelButton.style.left = `${event.pageX + 308}px`;
    cancelButton.style.display = "block";

    buttonIsDisplayed = true;
  }

  convertButton.style.display = "none";
  buttonIsDisplayed = false;
});
