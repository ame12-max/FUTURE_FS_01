import { useState, useEffect } from 'react';

export const useTypewriter = ({ words, loop = true, delay = 100, deleteSpeed = 50 }) => {
  const [text, setText] = useState('');
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentWord = words[wordIndex % words.length];
    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          setText(currentWord.substring(0, text.length + 1));
          if (text.length === currentWord.length) {
            if (loop) {
              setTimeout(() => setIsDeleting(true), 1000);
            }
          }
        } else {
          setText(currentWord.substring(0, text.length - 1));
          if (text.length === 0) {
            setIsDeleting(false);
            setWordIndex((prev) => (prev + 1) % words.length);
          }
        }
      },
      isDeleting ? deleteSpeed : delay
    );
    return () => clearTimeout(timeout);
  }, [text, isDeleting, wordIndex, words, loop, delay, deleteSpeed]);

  return [text];
};