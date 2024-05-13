'use client';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import styles from './Mascots.module.scss';
import Img from '@/components/ui/image';
import type { MascotsRenderTypes } from './Mascots.types';

export default function MascotsRender({ text, image, icon }: MascotsRenderTypes) {
  const [activeText, setActiveText] = useState(-1);
  const [activeImg, setActiveImg] = useState(-1);
  const pathname = usePathname();
  useEffect(() => {
    setActiveText(prevIndex => (prevIndex + 1) % text.length);
    setActiveImg(prevIndex => (prevIndex + 1) % image.length);
  }, [pathname, text.length, image.length]);

  return (
    <aside className={styles['Mascots']}>
      {
        text.map((item, i) => (
          <p
            key={i}
            style={{ display: i !== activeText ? 'none' : undefined }}
          >
            {item}
            {icon}
          </p>
        ))
      }
      <div className={styles.images}>
        {image.map((item, i) => (
          <Img
            data={item}
            sizes='158px'
            key={i}
            style={{ display: i !== activeImg ? 'none' : undefined }}
          />
        ))}
      </div>
    </aside>
  );
}