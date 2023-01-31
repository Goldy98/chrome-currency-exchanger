import "@webcomponents/webcomponentsjs";
import { App } from "vue";
import { ActivePageEvent } from "./constants/types";
import { getWindowSelectionIfNumber } from "./helpers";
import {
  loadComponentStyleIntoDom,
  appendConverterPopUpForm,
  buildIconButton,
  CURRENCY_EXCHANGER_TAG_NAME,
  CURRENCY_EXCHANGER_WIDTH,
} from "./window-ui";

loadComponentStyleIntoDom();

// Register the tag for currency exchanger as a web component in the page context
customElements.define(CURRENCY_EXCHANGER_TAG_NAME, HTMLElement);

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

  // This variable is used to determine the offset to apply in case the form would appear too close to the
  // page right border
  const xOffset =
    window.innerWidth - convertButton.offsetLeft < CURRENCY_EXCHANGER_WIDTH
      ? CURRENCY_EXCHANGER_WIDTH
      : 0;

  if (windowSelectionAsNumber) {
    const { app, converterForm } = appendConverterPopUpForm(
      `${event.pageX - xOffset}px`,
      `${event.pageY}px`,
      windowSelectionAsNumber
    );

    currentConverterForm = app;
    currentConverterFormElement = converterForm;

    // eslint-disable-next-line no-magic-numbers
    cancelButton.style.top = `${event.pageY - 15}px`;
    // eslint-disable-next-line no-magic-numbers
    cancelButton.style.left = `${event.pageX + 300 - xOffset}px`;
    cancelButton.style.display = "block";

    buttonIsDisplayed = true;
  }

  convertButton.style.display = "none";
  buttonIsDisplayed = false;
});
