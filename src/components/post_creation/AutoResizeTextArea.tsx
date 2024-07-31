import React, { useRef, useEffect } from 'react';

interface AutoResizeTextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> { }

const AutoResizeTextArea: React.FC<AutoResizeTextAreaProps> = (props) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const autoResize = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  useEffect(() => {
    autoResize();
  }, []);

  return (
    <textarea
      ref={textareaRef}
      {...props}
      className={`overflow-hidden resize-none flex-none w-full focus:outline-none ${props.className}`}
      rows={1}
      onInput={autoResize}
    />
  );
};

export default AutoResizeTextArea;