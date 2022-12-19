type SupportedEvent = "SelectedNumber";

export type ActivePageEvent = {
  name: SupportedEvent;
  payload: any;
};

document.addEventListener("mouseup", () => {
  console.log("======= load EXECUTED FROM MY EXTENSION SCRIPT");
  const selectedText = window.getSelection()?.toString();

  const numberValue = getNumberValue(
    selectedText?.replaceAll(",", ".").replaceAll(" ", "")
  );

  if (selectedText && numberValue) {
    // Send the selected text to the extension
    chrome.runtime.sendMessage<ActivePageEvent>({
      name: "SelectedNumber",
      payload: numberValue,
    });
  }
});

document.addEventListener("load", () => {
  console.log("======= load EXECUTED FROM MY EXTENSION SCRIPT");
  chrome.runtime.sendMessage("SAY HELLO FROM ACTUAL PAGE");
});

// const dom = document.createElement("h1");

// dom.textContent = "NIQUE TA MERE";

// document.body.insertAdjacentElement("afterbegin", dom);

// const canvas = document.createElement("canvas");

function getNumberValue(value: string = "") {
  try {
    const numberValue = parseFloat(value);
    return numberValue;
  } catch (error) {
    return undefined;
  }
}

export {};
