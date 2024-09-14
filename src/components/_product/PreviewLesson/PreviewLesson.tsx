'use client';
import styles from './PreviewLesson.module.scss';
import type { FieldValues, Props } from './PreviewLesson.types';
import Link from 'next/link';
import Vimeo from '@u-wave/react-vimeo';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Checkbox from '@/components/ui/Checkbox';
import { useForm } from 'react-hook-form';
import { REGEX } from '@/global/constants';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { setCookie } from '@/utils/set-cookie';

const LessonHero = ({ lesson, course, alreadySubscribed }: Props) => {
  const [status, setStatus] = useState({ sending: false });
  const [popupOpen, setPopupOpen] = useState(alreadySubscribed ? false : !!course.previewGroupMailerLite);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FieldValues>({ mode: 'onTouched' });

  const onSubmit = async (data: FieldValues) => {
    setStatus({ sending: true });
    // Add email to group, if already exists just disable popu
    try {
      const response = await fetch('/api/mailerlite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, groupID: course.previewGroupMailerLite! }),
      });
      const responseData = await response.json();
      if (response.ok && responseData.success) {
        setCookie(course.previewGroupMailerLite!, 'true', 365);
        setStatus((prevStatus) => ({ ...prevStatus, success: true }));
        toast('Dziekujemy, miłego oglądania!');
        setPopupOpen(false);
        reset();
      } else {
        toast('Wystąpił błąd, spróbuj ponownie');
        setStatus((prevStatus) => ({ ...prevStatus, success: false }));
      }
    } catch {
      setStatus((prevStatus) => ({ ...prevStatus, success: false }));
    } finally {
      setStatus((prevStatus) => ({ ...prevStatus, sending: false }));
    }
  };

  const handleTimeUpdate = ({ seconds }: { seconds: number }) => {
    localStorage.setItem(`vimeo-progress-${lesson.video}`, String(seconds));
  };

  return (
    <section className={styles['LessonHero']}>
      <div className={styles['grid']}>
        {popupOpen && <div className={styles['overlay']}></div>}
        <Link
          className={`${styles.returnLink}`}
          href={'./'}
        >
          <ChevronRight />
          Wróć do kursu
        </Link>
        <div className={styles['content']}>
          <div className={styles['video'] + ' ' + (popupOpen ? styles['popup-opened'] : '')}>
            {popupOpen && (
              <form
                onSubmit={handleSubmit(onSubmit)}
                className={styles['popup']}
              >
                <div>
                  <div>
                    <h2>
                      Chcesz obejrzeć <strong>darmowe</strong> lekcje?
                    </h2>
                    <p>Podaj maila na którego dostaniesz dostęp</p>
                  </div>
                  <div>
                    <Input
                      label='Imię'
                      register={register('name', {
                        required: { value: true, message: 'Imię jest wymagane' },
                        minLength: { value: 2, message: 'Imię jest za krótkie' },
                        pattern: { value: REGEX.string, message: 'Imię jest za krótkie' },
                      })}
                      errors={errors}
                    />
                    <Input
                      label='E-mail'
                      type='email'
                      register={register('email', {
                        required: { value: true, message: 'E-mail jest wymagany' },
                        pattern: { value: REGEX.email, message: 'Niepoprawny adres e-mail' },
                      })}
                      errors={errors}
                    />
                    <Checkbox
                      register={register('privacy', {
                        required: {
                          value: true,
                          message: 'Zgoda jest wymagana',
                        },
                      })}
                      label={
                        <>
                          Zgadzam się na{' '}
                          <Link
                            className='link'
                            href='/polityka-prywatnosci'
                            target='_blank'
                            rel='noopener'
                          >
                            przetwarzanie moich danych
                          </Link>
                        </>
                      }
                      errors={errors}
                    />
                  </div>
                </div>
                <Button
                  type='submit'
                  disabled={status.sending}
                >
                  Odbieram darmowe lekcje
                </Button>
              </form>
            )}
            <Vimeo
              speed={true}
              video={lesson.video}
              loop={false}
              className={styles['vimeo']}
              start={Number(localStorage.getItem(`vimeo-progress-${lesson.video}`))}
              onTimeUpdate={handleTimeUpdate}
            />
          </div>
        </div>
        <div>
          <h1>Co znajdziesz w kursie?</h1>
          <div className={styles.lessonsWrapper}>
            <div className={styles.lessons}>
              {course.previewLessons.map((el, i) => {
                return (
                  <Link
                    href={`/moje-konto/kursy/${course.slug}/${el.slug}`}
                    key={i}
                    data-current={el.slug === lesson.slug}
                  >
                    <p>
                      <small>Lekcja {i + 1}</small>
                    </p>{' '}
                    {el.title}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LessonHero;

function ChevronRight() {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='20'
      height='20'
      fill='none'
    >
      <path
        stroke='#B4A29C'
        strokeLinecap='round'
        strokeLinejoin='round'
        d='M12.813 4.375L7.186 10l5.625 5.625'
      ></path>
    </svg>
  );
}
