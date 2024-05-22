'use client';
import styles from './authorization.module.scss';
import { useEffect, useState } from 'react';
import AuthorizationForm from './authorization_Form';
import { useSearchParams } from 'next/navigation';
import { toast } from 'react-toastify';

const Authorization = () => {
  const [isRegister, setRegister] = useState(false);
  const params = useSearchParams();

  useEffect(() => {
    if (params.get('error_description')) {
      toast.error(params.get('error_description'));
    }
  }, [params]);

  return (
    <section className={styles['Authorization']}>
      {isRegister ? (
        <h1>
          <strong>Zarejestruj się</strong>
        </h1>
      ) : (
        <h1>
          <strong>Zaloguj się</strong>
        </h1>
      )}
      {isRegister ? (
        <p>
          Dołącz do naszej <strong>twórczej społeczności</strong> i razem z nami rozwijaj swoją kreatywność!
        </p>
      ) : (
        <p>
          Przejdź do swojego konta, aby uzyskać <strong>dostęp do kursu</strong> lub sprawdzić status zamówienia.
        </p>
      )}
      <div className={styles['grid']}>
        {/* <div className={styles['providers']}></div> */}
        <AuthorizationForm
          isRegister={isRegister}
          setRegister={setRegister}
        />
      </div>
    </section>
  );
};

export default Authorization;
