'use client';
import Button from '@/components/ui/Button';
import styles from './TextSection.module.scss';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function Subscribe({ userId, children }: { userId: string; children: React.ReactNode }) {
  const router = useRouter();
  const subscribe = async () => {
    await fetch('/api/affiliate/join', {
      method: 'POST',
      body: JSON.stringify({ userId: userId }),
    })
      .then(() => {
        router.refresh();
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };

  return (
    <Button
      onClick={subscribe}
      type='button'
      className={styles.cta}
    >
      {children}
    </Button>
  );
}
