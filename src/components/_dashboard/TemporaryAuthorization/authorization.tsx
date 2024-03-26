
'use client';
import styles from './authorization.module.scss';
import type { Props } from './authorization.types';
import { useState } from 'react';
import AuthorizationForm from './authorization_Form';

const Authorization = ({ registerTitle, loginTitle, registerText, loginText }: Props) => {
  const [isRegister, setRegister] = useState(false);

  return (
    <section className={styles['Authorization']}>
      {isRegister ? registerTitle : loginTitle}
      {isRegister ? registerText : loginText}
      <div className={styles['grid']}>
        {/* <div className={styles['providers']}></div> */}
        <AuthorizationForm isRegister={isRegister} setRegister={setRegister} />
      </div>
    </section>
  );
};

export default Authorization;
