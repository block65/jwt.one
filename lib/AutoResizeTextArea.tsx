import { FC, TextareaHTMLAttributes, useEffect, useRef, useState } from 'react';

export const AutoResizeTextArea: FC<
  TextareaHTMLAttributes<HTMLTextAreaElement>
> = (props) => {
  const ref = useRef(null);
  const { value } = props;

  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });

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
  }, []);

  useEffect(() => {
    if (ref.current) {
      ref.current.style.height = 'inherit';
      ref.current.style.height = `${ref.current.scrollHeight}px`;
    }
  }, [value, windowSize]);

  return <textarea ref={ref} {...props} />;
};
