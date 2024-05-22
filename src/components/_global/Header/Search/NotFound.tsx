import styles from './Search.module.scss';

export default function NotFound() {
  return (
    <div className={styles.notFound}>
      <h1>
        Nie znaleźliśmy <strong>produktów</strong>, które szukasz
      </h1>
      <p>Spróbuj zmienić parametry filtrowania lub usunąć niektóre z nich.</p>
    </div>
  );
}
