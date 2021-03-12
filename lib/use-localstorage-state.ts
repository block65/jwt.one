import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

// eslint-disable-next-line @typescript-eslint/ban-types
function isFunctionLike(obj: unknown): obj is Function {
  return obj instanceof Function;
}

export function useLocalStorageState<T>(
  key: string,
  initialValue?: T | (() => T),
): [T, Dispatch<SetStateAction<T>>] {
  const namespace = `app:${key}`;
  const resolvedInitialValue = useMemo(() => {
    return isFunctionLike(initialValue) ? initialValue() : initialValue;
  }, [initialValue]);

  const [storedValue, setStoredValue] = useState(() => {
    if (typeof window === 'undefined') {
      return resolvedInitialValue;
    }

    try {
      const item = window.localStorage.getItem(namespace);
      // eslint-disable-next-line consistent-return
      return item ? JSON.parse(item) : resolvedInitialValue;
    } catch (err) {
      console.warn({ err }, err.message);
      // eslint-disable-next-line consistent-return
      return initialValue;
    }
  });

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    if (storedValue === resolvedInitialValue) {
      window.localStorage.removeItem(namespace);
    } else {
      window.localStorage.setItem(namespace, JSON.stringify(storedValue));
    }
  }, [namespace, resolvedInitialValue, storedValue]);

  const setValue = useCallback((value: T | ((arg: T) => T)): void => {
    try {
      setStoredValue(value);
    } catch (err) {
      console.warn({ err }, err.message);
    }
  }, []);

  return [storedValue, setValue];
}
