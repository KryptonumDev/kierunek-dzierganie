import styles from './Search.module.scss';

export default function findSearchedName(name: string, searchValue: string) {
  const parts = name.split(new RegExp(`(${searchValue})`, 'gi'));
  return (
    <span>
      {parts.map((part, i) =>
        part.toLowerCase() === searchValue.toLowerCase() ? (
          <span
            key={i}
            className={styles.highlighted}
          >
            {part}
          </span>
        ) : (
          part
        )
      )}
    </span>
  );
}
