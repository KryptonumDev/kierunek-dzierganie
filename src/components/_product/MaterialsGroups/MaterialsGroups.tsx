import Markdown from '@/components/ui/markdown';
import Link from 'next/link';
import styles from './MaterialsGroups.module.scss';
import type { MaterialsGroupsTypes } from './MaterialsGroups.types';

const MaterialsGroups = ({ listParagraph, heading, materialsGroupsList }: MaterialsGroupsTypes) => {
  return (
    <div className={styles['MaterialsGroups']}>
      <Markdown.h2 className={styles.heading}>{heading}</Markdown.h2>
      <ul className={styles.list}>
        {materialsGroupsList.map(({ title, materialsList }, index) => (
          <li
            className={styles.group}
            key={index}
          >
            <p className={styles.group_heading}>{title}</p>
            <ul className={styles.group_list}>
              {materialsList.map(({ name, materialRef }, i) => (
                <li
                  className={styles.item}
                  key={i}
                >
                  <span>{i + 1}</span>
                  {materialRef ? (
                    <Link
                      href={`/produkty-do-${materialRef.basis === 'knitting' ? 'dziergania' : 'szydelkowania'}/${materialRef.slug}`}
                    >
                      {name}
                    </Link>
                  ) : (
                    <span>{name}</span>
                  )}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
      {listParagraph && <Markdown className={styles.paragraph}>{listParagraph}</Markdown>}
    </div>
  );
};

export default MaterialsGroups;
