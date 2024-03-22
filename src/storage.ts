import browser from "webextension-polyfill";

export function setValuesFromStorage(
  globalVars: Array<{
    element: HTMLElement;
    elementVar: string;
    key: string;
    default: any;
  }>
) {
  browser.storage.sync.get().then((storage) => {
    globalVars.forEach((globalVar) => {
      globalVar.element[globalVar.elementVar] =
        storage[globalVar.key] ?? globalVar.default;
    });
  });
}

export function setValuesToStorage(
  element: HTMLElement,
  elementVar: string,
  key: string
) {
  element?.addEventListener("change", () => {
    setValueToStorage(key, element[elementVar]);
  });
}

export function setValueToStorage(key: string, value: any) {
  browser.storage.sync.set({ [key]: value });
}

export async function getValueFromStorage(key: string) {
  const storage = await browser.storage.sync.get(key);
  return storage[key] ?? false;
}

export function storageChangeListener(handleChanges: Function) {
  browser.storage.sync.onChanged.addListener((changes) => {
    handleChanges(changes);
  });
}
