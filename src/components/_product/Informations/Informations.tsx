'use client';
import { useState } from 'react';
import styles from './Informations.module.scss';
import type { Props } from './Informations.types';

const Informations = ({ tabs, children }: Props) => {
  const [selectedTab, setSelectedTab] = useState(0);
  return (
    <section className={styles['Informations']}>
      <div className={styles['tabs']}>
        {children.map(
          (item, i) =>
            item !== false && (
              <button
                key={i}
                onClick={() => setSelectedTab(i)}
                className={i === selectedTab ? styles['active'] : ''}
              >
                {tabs[i]}
              </button>
            )
        )}
      </div>
      <div>{children[selectedTab]}</div>
    </section>
  );
};

export default Informations;