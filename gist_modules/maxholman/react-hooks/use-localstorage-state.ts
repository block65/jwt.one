import { Dispatch, SetStateAction, useCallback, useRef, useState } from 'react';
import type { JsonValue } from 'type-fest';

// eslint-disable-next-line @typescript-eslint/ban-types
function isFunctionLike(obj: unknown): obj is Function {
  return obj instanceof Function;
}

function resolveValue<T extends JsonValue | undefined>(
  initialValue?: T | (() => T) | undefined,
) {
  return isFunctionLike(initialValue) ? initialValue() : initialValue;
}

/**
 *
 * This allows you to use localStorage without triggering a re-render
 *
 * If you want re-renders - `useLocalStorageState`
 *
 * @param key
 * @param initialValue
 * @returns
 */
export function useLocalStorage<T extends JsonValue>(
  key: string,
  initialValue?: T | (() => T | undefined) | undefined,
): [() => T | undefined, (value: T | undefined) => void] {
  const namespace = `app:${key}`;

  const resolvedInitialValue = useRef(resolveValue(initialValue));

  const getLocalStorageValue = useCallback(() => {
    if (typeof window === 'undefined') {
      return resolvedInitialValue.current;
    }

    try {
      const item = window.localStorage.getItem(namespace);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return item ? JSON.parse(item) : resolvedInitialValue.current;
    } catch (err) {
      return resolvedInitialValue.current;
    }
  }, [namespace]);

  const setLocalStorageValue = useCallback(
    (value: T | undefined): T | undefined => {
      if (typeof window !== 'undefined') {
        if (!value || value === resolvedInitialValue.current) {
          window.localStorage.removeItem(namespace);
        } else {
          window.localStorage.setItem(namespace, JSON.stringify(value));
        }
      }

      return value;
    },
    [namespace],
  );

  return [getLocalStorageValue, setLocalStorageValue];
}

/**
 *
 *
 * This allows you to use localStorage while also triggering re-render
 *
 * If you DO NOT WANT re-renders - use `useLocalStorage`
 *
 * @param key
 * @param initialValue
 * @returns
 */
export function useLocalStorageState<T extends JsonValue>(
  key: string,
): [T | undefined, Dispatch<SetStateAction<T | undefined>>];
export function useLocalStorageState<T extends JsonValue>(
  key: string,
  initialValue: T | (() => T),
): [T, Dispatch<SetStateAction<T>>];
export function useLocalStorageState<T extends JsonValue>(
  key: string,
  initialValue?: T | (() => T),
): [T | undefined, Dispatch<SetStateAction<T | undefined>>] {
  const [localStorageValue, setLocalStorageValue] = useLocalStorage(
    key,
    initialValue,
  );

  const [state, setStateValue] = useState(localStorageValue);

  const setState = useCallback(
    (
      value: T | ((current: T | undefined) => T | undefined) | undefined,
    ): void => {
      const resolvedValue = isFunctionLike(value)
        ? value(localStorageValue())
        : value;
      setLocalStorageValue(resolvedValue);
      setStateValue(resolvedValue);
    },
    [localStorageValue, setLocalStorageValue],
  );

  return [state, setState];
}
