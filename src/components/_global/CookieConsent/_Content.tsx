'use client';
import { useEffect, useState } from 'react';
import styles from './CookieConsent.module.scss';
import Button from '@/components/ui/Button';
import Switch from '@/components/ui/Switch';
import { getCookie } from '@/utils/get-cookie';
import { setCookie } from '@/utils/set-cookie';
import type { ContentProps } from './CookieConsent.types';

declare global {
  interface Window {
    dataLayer: unknown[];
  }
}

function gtag(...args: unknown[]) {
  window.dataLayer?.push(args);
}

const cookieObjectKeys = ['preferences', 'statistics', 'marketing'];

type CookiesObject = {
  preferences: 'granted' | 'denied';
  statistics: 'granted' | 'denied';
  marketing: 'granted' | 'denied';
};

const activeCookiesObject: CookiesObject = cookieObjectKeys.reduce((acc, name) => {
  acc[name as keyof CookiesObject] = 'denied';
  return acc;
}, {} as CookiesObject);

const Content = ({ CloseIcon, heading, paragraph, details }: ContentProps) => {
  const [showSettings, setShowSettings] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [activeCookies, setActiveCookies] = useState(activeCookiesObject);

  useEffect(() => {
    const cookieValue = getCookie('CookieConsent');
    if (cookieValue) {
      const cookie = JSON.parse(cookieValue) as CookiesObject;
      gtag('consent', 'default', {
        ad_personalization: cookie.marketing,
        ad_storage: cookie.marketing,
        ad_user_data: cookie.marketing,
        analytics_storage: cookie.statistics,
        functionality_storage: cookie.preferences,
        personalization_storage: cookie.preferences,
        security_storage: 'granted',
        wait_for_update: 2500,
      });
    } else {
      gtag('consent', 'default', {
        ad_personalization: 'denied',
        ad_storage: 'denied',
        ad_user_data: 'denied',
        analytics_storage: 'denied',
        functionality_storage: 'denied',
        personalization_storage: 'denied',
        security_storage: 'granted',
        wait_for_update: 2500,
      });
      setShowBanner(true);
    }
    gtag('set', 'ads_data_redaction', true);
  }, []);

  const acceptAll = () => {
    const cookies: CookiesObject = cookieObjectKeys.reduce((acc, name) => {
      acc[name as keyof CookiesObject] = 'granted';
      return acc;
    }, {} as CookiesObject);
    setCookie('CookieConsent', JSON.stringify(cookies), 365);
    gtag('consent', 'update', {
      ad_personalization: 'granted',
      ad_storage: 'granted',
      ad_user_data: 'granted',
      analytics_storage: 'granted',
      functionality_storage: 'granted',
      personalization_storage: 'granted',
      security_storage: 'granted',
      wait_for_update: 2500,
    });
    setShowBanner(false);
  };

  const rejectAll = () => {
    const cookies: CookiesObject = cookieObjectKeys.reduce((acc, name) => {
      acc[name as keyof CookiesObject] = 'denied';
      return acc;
    }, {} as CookiesObject);
    setCookie('CookieConsent', JSON.stringify(cookies), 365);
    gtag('consent', 'update', {
      ad_personalization: 'denied',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      analytics_storage: 'denied',
      functionality_storage: 'denied',
      personalization_storage: 'denied',
      security_storage: 'granted',
      wait_for_update: 2500,
    });
    setShowBanner(false);
  };

  const changeConsent = (name: keyof CookiesObject, event: React.MouseEvent<HTMLLabelElement>) => {
    const target = event.target as Element;
    if (!target.matches('input'))
      setActiveCookies((prevState) => {
        const newState: CookiesObject = { ...prevState };
        newState[name] = prevState[name] === 'granted' ? 'denied' : 'granted';
        return newState;
      });
  };

  const acceptPart = () => {
    setCookie('CookieConsent', JSON.stringify(activeCookies), 365);
    gtag('consent', 'update', {
      ad_personalization: activeCookies.marketing,
      ad_storage: activeCookies.marketing,
      ad_user_data: activeCookies.marketing,
      analytics_storage: activeCookies.statistics,
      functionality_storage: activeCookies.preferences,
      personalization_storage: activeCookies.preferences,
      security_storage: 'granted',
      wait_for_update: 2500,
    });
    setShowBanner(false);
  };

  return (
    <div
      className={styles['Content']}
      aria-hidden={!showBanner}
    >
      <button
        className={styles.RejectAll}
        onClick={rejectAll}
      >
        <span>Nie chcę ciasteczek</span>
        {CloseIcon}
      </button>
      <header>
        {heading}
        {paragraph}
      </header>
      <div
        className={styles.settings}
        style={{ display: showSettings ? undefined : 'none' }}
        data-visible={showSettings}
      >
        <div className={styles.header}>
          {details.heading}
          {details.paragraph}
        </div>
        <div className={styles.group}>
          <Switch
            inputProps={{
              checked: true,
              disabled: true,
            }}
          >
            Niezbędne
          </Switch>
          <p className={styles.description}>{details.necessary_Description}</p>
          {details.necessary?.map(({ service, cookies }, i) => (
            <div
              className={styles.groupItem}
              key={i}
            >
              <p>{service}</p>
              <div className={styles.cookies}>
                {cookies.map(({ name, description, expiry, type }, i) => (
                  <div
                    className={styles.cookiesItem}
                    key={i}
                  >
                    <p className={styles.name}>{name}</p>
                    <p className={styles.description}>{description}</p>
                    <div className={styles.info}>
                      <p>Data ważności: {expiry}</p>
                      <p>Typ: {type}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className={styles.group}>
          <Switch
            labelProps={{
              onClick: (e) => changeConsent('preferences', e),
            }}
          >
            Preferencje
          </Switch>
          <p className={styles.description}>{details.preferences_Description}</p>
          {details.preferences?.map(({ service, cookies }, i) => (
            <div
              className={styles.groupItem}
              key={i}
            >
              <p>{service}</p>
              <div className={styles.cookies}>
                {cookies.map(({ name, description, expiry, type }, i) => (
                  <div
                    className={styles.cookiesItem}
                    key={i}
                  >
                    <p className={styles.name}>{name}</p>
                    <p className={styles.description}>{description}</p>
                    <div className={styles.info}>
                      <p>Data ważności: {expiry}</p>
                      <p>Typ: {type}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className={styles.group}>
          <Switch
            labelProps={{
              onClick: (e) => changeConsent('statistics', e),
            }}
          >
            Statystyka
          </Switch>
          <p className={styles.description}>{details.statistical_Description}</p>
          {details.statistical?.map(({ service, cookies }, i) => (
            <div
              className={styles.groupItem}
              key={i}
            >
              <p>{service}</p>
              <div className={styles.cookies}>
                {cookies.map(({ name, description, expiry, type }, i) => (
                  <div
                    className={styles.cookiesItem}
                    key={i}
                  >
                    <p className={styles.name}>{name}</p>
                    <p className={styles.description}>{description}</p>
                    <div className={styles.info}>
                      <p>Data ważności: {expiry}</p>
                      <p>Typ: {type}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className={styles.group}>
          <Switch
            labelProps={{
              onClick: (e) => changeConsent('marketing', e),
            }}
          >
            Marketing
          </Switch>
          <p className={styles.description}>{details.marketing_Description}</p>
          {details.marketing?.map(({ service, cookies }, i) => (
            <div
              className={styles.groupItem}
              key={i}
            >
              <p>{service}</p>
              <div className={styles.cookies}>
                {cookies.map(({ name, description, expiry, type }, i) => (
                  <div
                    className={styles.cookiesItem}
                    key={i}
                  >
                    <p className={styles.name}>{name}</p>
                    <p className={styles.description}>{description}</p>
                    <div className={styles.info}>
                      <p>Data ważności: {expiry}</p>
                      <p>Typ: {type}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className={styles.group}>
          <p>Nieklasyfikowane</p>
          <p className={styles.description}>{details.unclassified_Description}</p>
          {details.unclassified?.map(({ service, cookies }, i) => (
            <div
              className={styles.groupItem}
              key={i}
            >
              <p>{service}</p>
              <div className={styles.cookies}>
                {cookies.map(({ name, description, expiry, type }, i) => (
                  <div
                    className={styles.cookiesItem}
                    key={i}
                  >
                    <p className={styles.name}>{name}</p>
                    <p className={styles.description}>{description}</p>
                    <div className={styles.info}>
                      <p>Data ważności: {expiry}</p>
                      <p>Typ: {type}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.controls}>
        {showSettings ? (
          <button
            className={styles.button}
            onClick={() => acceptPart()}
          >
            Zapisz
          </button>
        ) : (
          <button
            className={styles.button}
            onClick={() => setShowSettings(true)}
          >
            Ustawienia
          </button>
        )}
        <Button onClick={() => acceptAll()}>Zaakceptuj wszystkie</Button>
      </div>
    </div>
  );
};

export default Content;
