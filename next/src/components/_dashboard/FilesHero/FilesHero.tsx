'use client';
import { useRouter } from 'next/navigation';
import styles from './FilesHero.module.scss';
import type { FilesHeroTypes } from './FilesHero.types';
import Switch from '@/components/ui/Switch';
import { createClient } from '@/utils/supabase-client';

const FilesHero = ({ id, left_handed }: FilesHeroTypes) => {
  const router = useRouter();
  const supabase = createClient();

  const setLeftHanded = async (leftHanded: boolean) => {
    await supabase
      .from('profiles')
      .update({
        left_handed: leftHanded,
      })
      .eq('id', id);

    router.refresh();
  };
  return (
    <section className={styles['FilesHero']}>
      <h1>
        Tutaj znajdziesz <strong>pliki do pobrania</strong>
      </h1>
      <p>
        Wszystko w <strong>jednym miejscu</strong>. Tylko dla Ciebie
      </p>
      <div className={styles['switch']}>
        <Switch
          inputProps={{
            onClick: (v) => setLeftHanded(v.currentTarget.checked),
            defaultChecked: left_handed,
          }}
        >
          Jestem osobą leworęczną
        </Switch>
        <p>Ustawienie to dostosowuje w jaki sposób wyświetlają Ci się kursy i pliki do lekcji</p>
      </div>
    </section>
  );
};

export default FilesHero;
