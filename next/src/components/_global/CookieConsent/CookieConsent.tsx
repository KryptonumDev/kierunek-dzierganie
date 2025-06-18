'use client';
import { useEffect, useRef, useState } from 'react';
import styles from './CookieConsent.module.scss';
import Button from '@/components/ui/Button';
import Switch from '@/components/ui/Switch';
import { getCookie } from '@/utils/get-cookie';
import { setCookie } from '@/utils/set-cookie';

// eslint-disable-next-line prefer-rest-params
const gtag: Gtag.Gtag = function () { window.dataLayer?.push(arguments); };

type Consent = {
  necessary: boolean;
  marketing: boolean;
  analytics: boolean;
  preferences: boolean;
};

export default function CookieConsent() {
  const container = useRef<HTMLElement>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showBanner, setShowBanner] = useState(false);

  function setConsent(consent: Consent) {
    const consentMode = {
      functionality_storage: consent.necessary ? 'granted' : 'denied',
      security_storage: consent.necessary ? 'granted' : 'denied',
      ad_storage: consent.marketing ? 'granted' : 'denied',
      ad_user_data: consent.marketing ? 'granted' : 'denied',
      ad_personalization: consent.marketing ? 'granted' : 'denied',
      analytics_storage: consent.analytics ? 'granted' : 'denied',
      personalization_storage: consent.preferences ? 'granted' : 'denied',
    } as const;
    gtag('consent', 'update', consentMode);
    setCookie('cookie-consent', JSON.stringify(consentMode), 365);
  }

  useEffect(() => {
    if (getCookie('cookie-consent') === null) {
      gtag('consent', 'default', {
        functionality_storage: 'denied',
        security_storage: 'denied',
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
        analytics_storage: 'denied',
        personalization_storage: 'denied',
      });
      setShowBanner(true);
    } else {
      gtag('consent', 'default', JSON.parse(getCookie('cookie-consent')!));
    }
  }, []);
  const acceptAll = () => {
    setShowBanner(false);
    setConsent({
      necessary: true,
      marketing: true,
      analytics: true,
      preferences: true,
    });
  };
  const rejectAll = () => {
    setShowBanner(false);
    setConsent({
      necessary: false,
      marketing: false,
      analytics: false,
      preferences: false,
    });
  };
  const acceptPart = () => {
    setShowBanner(false);
    setConsent({
      necessary: container.current!.querySelector<HTMLInputElement>('input[id="necessary"]')!.checked,
      marketing: container.current!.querySelector<HTMLInputElement>('input[id="marketing"]')!.checked,
      analytics: container.current!.querySelector<HTMLInputElement>('input[id="analytics"]')!.checked,
      preferences: container.current!.querySelector<HTMLInputElement>('input[id="preferences"]')!.checked,
    });
  };

  return (
    <aside
      className={styles['cookie-consent']}
      aria-hidden={!showBanner}
      ref={container}
    >
      <div className={styles.content}>
        <button
          className={styles.RejectAll}
          onClick={rejectAll}
        >
          <span>Nie chcę ciasteczek</span>
          {CloseIcon}
        </button>
        <header>
          <h2>Korzystamy z <strong>ciasteczek</strong></h2>
          <p>Dzięki nim nasza strona jest dla Ciebie <strong>bardziej przyjazna</strong> i działa niezawodnie. Ciasteczka pozwalają również dopasować treści i reklamy do Twoich zainteresowań.</p>
        </header>
        <div
          className={styles.settings}
          style={{ display: showSettings ? undefined : 'none' }}
          data-visible={showSettings}
        >
          <div className={styles.header}>
            <h3>Ustawienia ciasteczek</h3>
            <p>Poniżej możesz sprawdzić, jakie dane zbieramy w ciasteczkach i po co je zbieramy. Nie na wszystkie musisz się zgodzić. Zawsze możesz zmienić swój wybór na stronie ciasteczek.</p>
          </div>
          <div className={styles.group}>
            <Switch
              inputProps={{
                checked: true,
                disabled: true,
                id: 'necessary',
              }}
            >
              Niezbędne
            </Switch>
            <p className={styles.description}>Niezbędne pliki cookie pomagają uczynić naszą stronę użyteczną, umożliwiając działanie podstawowych funkcji, takich jak nawigacja po stronie internetowej czy dostęp do bezpiecznych obszarów strony. Bez tych plików cookie niektóre podstawowe funkcje strony nie będą działać prawidłowo.</p>
          </div>
          <div className={styles.group}>
            <Switch
              inputProps={{
                id: 'marketing',
              }}
            >
              Marketingowe
            </Switch>
            <p className={styles.description}>Pliki cookie marketingowe są używane do śledzenia odwiedzających na stronach internetowych. Ich celem jest wyświetlanie reklam, które są istotne i interesujące dla indywidualnych użytkowników, a tym samym bardziej wartościowe dla wydawców i zewnętrznych reklamodawców.</p>
          </div>
          <div className={styles.group}>
            <Switch
              inputProps={{
                id: 'analytics'
              }}
            >
              Analityczne
            </Switch>
            <p className={styles.description}>Pliki cookie analityczne pomagają nam zrozumieć, w jaki sposób użytkownicy wchodzą w interakcje z naszą stroną internetową, zbierając i raportując informacje anonimowo. Te dane są wykorzystywane do doskonalenia struktury i treści strony.</p>
          </div>
          <div className={styles.group}>
            <Switch
              inputProps={{
                id: 'preferences'
              }}
            >
              Preferencyjne
            </Switch>
            <p className={styles.description}>Pliki cookie preferencyjne pozwalają stronie internetowej zapamiętywać informacje, które zmieniają sposób, w jaki strona się zachowuje lub wygląda, takie jak preferowany język lub region, w którym się znajdujesz.</p>
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
    </aside >
  );
}

const CloseIcon = (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={32}
    height={33}
    fill='none'
  >
    <path
      d='m23 23.233-14-14m14 0-14 14'
      stroke='#9A827A'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
);
