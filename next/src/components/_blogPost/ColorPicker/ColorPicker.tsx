import styles from './ColorPicker.module.scss';
import type { ColorPickerTypes } from './ColorPicker.types';
import Markdown from '@/components/ui/markdown';

const ColorPicker = ({ name, list }: ColorPickerTypes) => {
  return (
    <section className={styles['ColorPicker']}>
      <Markdown.h2>{name}</Markdown.h2>
      <div className={styles.list}>
        {list.map(({ name, color: { hex } }, index) => (
          <div
            key={index}
            className={styles.item}
          >
            <div className={styles.circleWrapper}>
              <p
                className={styles.circle}
                style={{ borderColor: hex }}
              />
            </div>
            <p className={styles.colorName}>{name}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ColorPicker;
