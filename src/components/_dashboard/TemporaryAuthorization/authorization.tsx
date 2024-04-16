'use client';
import styles from './authorization.module.scss';
import { useState } from 'react';
import AuthorizationForm from './authorization_Form';

const Authorization = () => {
  const [isRegister, setRegister] = useState(false);

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
