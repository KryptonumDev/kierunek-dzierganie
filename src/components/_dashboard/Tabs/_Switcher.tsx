'use client';
import { useState } from 'react';
import styles from './Tabs.module.scss';
import type { SwitcherTypes } from './Tabs.types';

const Switcher = ({ tabs }: SwitcherTypes) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section className={styles['Switcher']}>
      <div className={styles.buttons}>
        {tabs.map(({ name }, i) => (
          <button
            key={i}
            aria-current={activeTab === i}
            onClick={() => setActiveTab(i)}
          >
            {name}
          </button>
        ))}
      </div>
      {tabs.map(({ content }, i) => (
        <div
          key={i}
          style={{ display: activeTab !== i ? 'none' : undefined }}
        >
          {content}
        </div>
      ))}
    </section>
  );
};

export default Switcher;
