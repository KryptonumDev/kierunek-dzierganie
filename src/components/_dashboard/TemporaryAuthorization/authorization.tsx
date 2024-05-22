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
      let message = params.get('error_description');

      if (message === 'Email link is invalid or has expired') {
        message = 'Link aktywacyjny jest nieprawidłowy lub wygasł! Proszę spróbować ponownie.';
      }

      if(message === 'Invalid login credentials') {
        message = 'Nieprawidłowe dane logowania! Proszę spróbować ponownie.';
      }

      toast.error(message);
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
