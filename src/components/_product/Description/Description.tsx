'use client';
import { useState } from 'react';
import styles from './Description.module.scss';
import type { Props } from './Description.types';

const Description = ({ children }: Props) => {
  const [selectedTab, setSelectedTab] = useState(0);

  return (
    <section className={styles['Description']}>
      <div className={styles['tabs']}>
        {children.map((_, i) => (
          <button
            key={i}
            onClick={() => setSelectedTab(i)}
            className={i === selectedTab ? styles['active'] : ''}
          >
            {i ? 'Parametry' : 'Opis'}
          </button>
        ))}
      </div>
      <div>{children[selectedTab]}</div>
    </section>
  );
};

export default Description;
