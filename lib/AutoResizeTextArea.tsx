import { FC, TextareaHTMLAttributes, useEffect, useRef } from 'react';

export const AutoResizeTextArea: FC<
  TextareaHTMLAttributes<HTMLTextAreaElement>
> = (props) => {
  const ref = useRef(null);
  const { value } = props;

  useEffect(() => {
    if (ref.current) {
      ref.current.style.height = 'inherit';
      ref.current.style.height = `${ref.current.scrollHeight}px`;
    }
  }, [value, ref.current]);

  return <textarea ref={ref} {...props} />;
};
