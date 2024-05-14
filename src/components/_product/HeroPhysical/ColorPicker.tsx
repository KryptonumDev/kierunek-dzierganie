import styles from './HeroPhysical.module.scss';
export default function ColorPicker({ hex, onClick, ...props }: { hex: string; onClick: () => void }) {
  return (
    <div
      className={styles.item}
      onClick={onClick}
      {...props}
    >
      <div className={styles.circleWrapper}>
        <p
          className={styles.circle}
          style={{ borderColor: hex }}
        />
      </div>
    </div>
  );
}
