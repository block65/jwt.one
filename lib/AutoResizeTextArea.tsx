import {
  FC,
  TextareaHTMLAttributes,
  useCallback,
  useEffect,
  useRef,
  useState,
  useTransition,
} from 'react';

export const AutoResizeTextArea: FC<
  TextareaHTMLAttributes<HTMLTextAreaElement>
> = (props) => {
  const ref = useRef<HTMLTextAreaElement>(null);
  const { value } = props;

  const [windowSize, realSetWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const [, startTransition] = useTransition();

  const setWindowSize: typeof realSetWindowSize = useCallback((...args) => {
    startTransition(() => {
      realSetWindowSize(...args);
    });
  }, []);

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    window.addEventListener('resize', handleResize);

    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, [setWindowSize]);

  useEffect(() => {
    if (ref.current) {
      ref.current.style.height = 'inherit';
      ref.current.style.height = `${ref.current.scrollHeight}px`;
    }
  }, [value, windowSize]);

  return <textarea ref={ref} {...props} />;
};
