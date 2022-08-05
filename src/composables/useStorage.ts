const getFromStorage = <T>(key: string, storage: Storage): T | string | null => {
  const result = storage.getItem(key);
  if (result) {
    try {
      return JSON.parse(result) as T;
    } catch (e) {
      return result;
    }
  }
  return null;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const setInStorage = (key: string, value: any, storage: Storage): void => {
  const formattedValue = typeof value === 'object' ? JSON.stringify(value) : value || '';
  storage.setItem(key, formattedValue);
};

const removeFromStorage = (keys: string[], storage: Storage): void => {
  keys.forEach((key) => storage.removeItem(key));
};

const clearStorage = (storage: Storage): void => {
  storage.clear();
};

const getFromLocalStorage = <T>(key: string): T | string | null => {
  return getFromStorage(key, window.localStorage);
};

const getFromSessionStorage = <T>(key: string): T | string | null => {
  return getFromStorage(key, window.sessionStorage);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const setInLocalStorage = (key: string, value: any): void => {
  setInStorage(key, value, window.localStorage);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const setInSessionStorage = (key: string, value: any): void => {
  setInStorage(key, value, window.sessionStorage);
};

const removeFromLocalStorage = (keys: string[]): void => {
  removeFromStorage(keys, window.localStorage);
};

const removeFromSessionStorage = (keys: string[]): void => {
  removeFromStorage(keys, window.sessionStorage);
};

const clearLocalStorage = (preserve: string[] = []): void => {
  const stored: Array<{ key: string; value: unknown }> = [];
  for (const item of preserve) {
    stored.push({ key: item, value: getFromLocalStorage(item) });
  }
  clearStorage(window.localStorage);
  for (const s of stored) {
    setInLocalStorage(s.key, s.value);
  }
};

const clearSessionStorage = (): void => {
  clearStorage(window.sessionStorage);
};

export const useStorage = () => ({
  getFromLocalStorage,
  getFromSessionStorage,
  setInLocalStorage,
  setInSessionStorage,
  removeFromLocalStorage,
  removeFromSessionStorage,
  clearLocalStorage,
  clearSessionStorage
});
