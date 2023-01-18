import { createApp } from "vue";
import App from "./App.vue";
import logo from "./assets/logo.png";
import cancelIcon from "./assets/cancel.png";
import AppStyle from "./assets/styles/base.css?inline";

export function loadComponentStyleIntoDom() {
  const styleTag = document.createElement("style");

  styleTag.innerHTML = `
  ${AppStyle}
  #launchCurrencyConverterButton {
    position: absolute;
    background: white;
    z-index: 999999999999;
    width: 40px;
    height: 40px;
    border-radius: 100%;
    border: solid 0px transparent;
    box-shadow: 4px 4px 4px 0px rgba(0, 0, 0, 0.2);
  }
  #closeCurrencyConverterButton {
    position: absolute;
    background: transparent;
    z-index: 999999999999;
    width: 40px;
    height: 40px;
    border: none;
  }
  #launchCurrencyConverterButton > img, #closeCurrencyConverterButton > img {
    width: 30px;
    height: 30px;
  } 
  #closeCurrencyConverterButton:hover, #launchCurrencyConverterButton:hover {
    cursor: pointer;
  }
  #currencyConverterForm {
    position: absolute;
    width: 340px;
    background-color: white;
    z-index: 999999999;
    border-radius: 12px;
    box-shadow: 0px 6px 30px 0px rgb(0 0 0 / 20%);
  }
`;

  styleTag.type = "text/css";

  document.head.appendChild(styleTag);
}

export type ButtonType =
  | "launchCurrencyConverterButton"
  | "closeCurrencyConverterButton";

const buttonTypeIconMappingObj: Record<ButtonType, string> = {
  launchCurrencyConverterButton: chrome.runtime.getURL(logo),
  closeCurrencyConverterButton: chrome.runtime.getURL(cancelIcon),
};

export function buildIconButton(id: ButtonType) {
  const button = document.createElement("button");

  button.id = id;

  button.style.top = "0px";
  button.style.bottom = "0px";
  button.style.display = "none";

  const url = buttonTypeIconMappingObj[id];

  button.innerHTML = `<img src='${url}'>`;

  return button;
}

export function appendConverterPopUpForm(
  xPosition: string,
  yPosition: string,
  selectedNumber: number
) {
  const converterForm = document.createElement("div");

  converterForm.id = "currencyConverterForm";
  converterForm.classList.add("currencyFormApp");

  converterForm.style.top = yPosition;
  converterForm.style.left = xPosition;

  document.body.appendChild(converterForm);

  const app = createApp(App, {
    isEmbedded: true,
    preSetAmount: selectedNumber,
  });

  app.mount(converterForm);

  return { converterForm, app };
}
