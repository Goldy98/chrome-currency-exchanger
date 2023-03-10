import { App as VueApp, createApp } from "vue";
import App from "./App.vue";
import CancelIcon from "./assets/cancel-icon.svg";
import logo from "./assets/logo.png";
import AppCss from "./assets/styles/base.css?inline";
import { WindowSelection } from "./constants/types";

export const CURRENCY_EXCHANGER_TAG_NAME = "currency-exchanger";

export const CURRENCY_EXCHANGER_WIDTH = 322;

// Style for outer component (launch button, cancel button, conversion form)
export function loadComponentStyleIntoDom() {
  const styleTag = document.createElement("style");

  styleTag.innerHTML = `
  #launchCurrencyConverterButton {
    position: absolute;
    background: white;
    z-index: 999999999999;
    width: 40px;
    height: 40px;
    border-radius: 100%;
    border: solid 0px transparent;
    box-shadow: 4px 4px 4px 0px rgba(0, 0, 0, 0.2);
    justify-content: center;
    align-items: center;
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
  ${CURRENCY_EXCHANGER_TAG_NAME} {
    position: absolute;
    width: ${CURRENCY_EXCHANGER_WIDTH}px;
    background-color: white;
    z-index: 999999999;
    border-radius: 12px;
    box-shadow: 0px 6px 30px 0px rgb(0 0 0 / 20%);
  }
`;

  document.head.appendChild(styleTag);
}

export type ButtonType =
  | "launchCurrencyConverterButton"
  | "closeCurrencyConverterButton";

const buttonTypeIconMappingObj: Record<ButtonType, string> = {
  launchCurrencyConverterButton: chrome.runtime.getURL(logo),
  closeCurrencyConverterButton: chrome.runtime.getURL(CancelIcon),
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

function loadStyleIntoShadowRoot(shadowRoot: ShadowRoot) {
  const styleTag = document.createElement("style");

  styleTag.innerHTML = AppCss;

  shadowRoot.appendChild(styleTag);
}

export function appendConverterPopUpForm(
  xPosition: string,
  yPosition: string,
  selection: WindowSelection
): {
  converterForm: HTMLElement;
  app: VueApp;
} {
  const converterForm = document.createElement(CURRENCY_EXCHANGER_TAG_NAME);

  document.body.appendChild(converterForm);

  converterForm.style.top = yPosition;
  converterForm.style.left = xPosition;

  const shadowRoot = converterForm.attachShadow({ mode: "open" });

  const app = createApp(App, {
    isEmbedded: true,
    selection,
  });

  app.mount(shadowRoot as any); // Sorry for the any assertion

  loadStyleIntoShadowRoot(shadowRoot);

  return { converterForm, app };
}
