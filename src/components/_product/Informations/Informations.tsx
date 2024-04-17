'use client';
import { Fragment, useState } from 'react';
import styles from './Informations.module.scss';
import type { Props } from './Informations.types';

const Informations = ({ tabs, children }: Props) => {
  const [selectedTab, setSelectedTab] = useState(children.findIndex((item) => item));
  return (
    <>
      <div className={styles['tabs']}>
        {children.map(
          (item, i) =>
            item && (
              <button
                data-active={i === selectedTab}
                key={i}
                onClick={() => setSelectedTab(i)}
                className={i === selectedTab ? styles['active'] : ''}
              >
                {tabs[i]}
              </button>
            )
        )}
      </div>
      {children.map((item, i) => (
        <Fragment key={i}>{item}</Fragment>
      ))}
    </>
  );
};

export default Informations;
