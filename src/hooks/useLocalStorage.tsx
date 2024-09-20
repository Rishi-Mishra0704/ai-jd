interface UseLocalStorageState<T> {
  setValue: (key: string, value: T) => void;
  getValue: (key: string) => T | null;
  clearValue: (key: string) => void;
  clearAll: VoidFunction;
}

const useLocalStorage = <T,>(): UseLocalStorageState<T> => {
  const setValue = (key: string, value: T) => {
    localStorage.setItem(key, JSON.stringify(value));
  };

  const getValue = (key: string): T | null => {
    const value = localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : null;
  };

  const clearValue = (key: string) => {
    localStorage.removeItem(key);
  };

  const clearAll = () => {
    localStorage.clear();
  };

  return {
    getValue,
    setValue,
    clearValue,
    clearAll,
  };
};

export default useLocalStorage;
