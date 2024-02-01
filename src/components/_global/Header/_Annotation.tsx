'use client';
import { useEffect, useRef } from 'react';
import styles from './Header.module.scss';

const Annotation = ({
  CloseIcon,
  children,
  rawContent,
}: {
  CloseIcon: JSX.Element;
  children: React.ReactNode;
  rawContent: string;
}) => {
  const ref = useRef<HTMLElement>(null);
  const close = (ref: React.RefObject<HTMLElement>) => {
    if (ref.current) {
      ref.current.style.display = 'none';
    }
  };
  const handleClose = () => {
    if (ref.current) {
      close(ref);
      localStorage.setItem('annotation', JSON.stringify({
        rawContent,
        timestamp: new Date().getTime(),
      }));
    }
  };
  useEffect(() => {
    const storedAnnotation = localStorage.getItem('annotation');
    if (storedAnnotation) {
      const parsedAnnotation = JSON.parse(storedAnnotation);
      const currentTime = new Date().getTime();
      const oneWeekInMillis = 7 * 24 * 60 * 60 * 1000;
      if (parsedAnnotation.rawContent !== rawContent || (currentTime - parsedAnnotation.timestamp >= oneWeekInMillis)) {
        localStorage.removeItem('annotation');
      } else {
        close(ref);
      }
    }
  }, [rawContent]);

  return (
    <aside
      className={styles['Annotation']}
      ref={ref}
    >
      <div className='max-width'>
        {children}
        <button
          className={styles.close}
          aria-label='Ukryj informację'
          onClick={() => handleClose()}
        >
          {CloseIcon}
        </button>
      </div>
    </aside>
  );
};

export default Annotation;
