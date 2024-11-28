import Markdown from '@/components/ui/markdown';
import Link from 'next/link';
import styles from './MaterialsGroups.module.scss';
import type { MaterialsGroupsTypes } from './MaterialsGroups.types';

const MaterialsGroups = ({ listParagraph, heading, materialsGroupsList }: MaterialsGroupsTypes) => {
  return (
    <div className={styles['MaterialsGroups']}>
      <Markdown.h2 className={styles.heading}>{heading}</Markdown.h2>
      <ul className={styles.list}>
        {materialsGroupsList.map(({ title, materialsList, additionalInfo }, index) => (
          <li
            className={styles.group}
            key={index}
          >
            <strong className={styles.group_heading}>{title}</strong>
            <ul className={styles.group_list}>
              {materialsList.map(({ name, materialRef, additionalInfo }, i) => (
                <li
                  className={styles.item}
                  data-additional-info={!!additionalInfo}
                  key={i}
                >
                  <span>{i + 1}</span>
                  <div>
                    {materialRef ? (
                      <Link
                        href={`/produkty-do-${materialRef.basis === 'knitting' ? 'dziergania' : 'szydelkowania'}/${materialRef.slug}`}
                      >
                        {name}
                      </Link>
                    ) : (
                      <span>{name}</span>
                    )}
                    {additionalInfo && <Markdown className={styles.info}>{additionalInfo}</Markdown>}
                  </div>
                </li>
              ))}
            </ul>
            {additionalInfo && <Markdown className={styles.group_additionalInfo}>{additionalInfo}</Markdown>}
          </li>
        ))}
      </ul>
      {listParagraph && <Markdown className={styles.paragraph}>{listParagraph}</Markdown>}
    </div>
  );
};

export default MaterialsGroups;
