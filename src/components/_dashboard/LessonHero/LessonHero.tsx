'use client';
import PercentChart from '@/components/ui/PercentChart';
import Switch from '@/components/ui/Switch';
import VideoPlayer from '@/components/ui/VideoPlayer/VideoPlayer';
import { formatBytes } from '@/utils/format-bytes';
import parseFileName from '@/utils/parse-file-name';
import { createClient } from '@/utils/supabase-client';
import { updateElement } from '@/utils/update-progress';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import styles from './LessonHero.module.scss';
import type { Props } from './LessonHero.types';

const LessonHero = ({
  progress,
  lesson,
  course,
  currentChapter,
  currentChapterIndex,
  currentLessonIndex,
  left_handed,
  auto_play,
  id,
}: Props) => {
  const router = useRouter();
  const supabase = createClient();
  const [leftHanded, setLeftHanded] = useState(left_handed);
  const [autoplay, setAutoplay] = useState(auto_play);
  const [isCompleted, setIsCompleted] = useState(
    () => progress.progress[currentChapter._id]![lesson._id]?.ended ?? false
  );
  const completePercentage = useMemo(() => {
    const totalLessons = currentChapter.lessons.length;
    let completedLessons = 0;

    currentChapter.lessons.forEach((lesson) => {
      if (progress.progress[currentChapter._id]![lesson._id]?.ended) completedLessons++;
    });

    return Math.round((completedLessons / totalLessons) * 100);
  }, [currentChapter, progress]);

  const updateProgress = async (type: 'manual' | 'auto', ended: boolean) => {
    const currentChapterId = currentChapter._id;
    const currentLessonId = currentChapter.lessons[currentLessonIndex]!._id;
    await updateElement({
      ...progress,
      progress: {
        ...progress.progress,
        [currentChapterId]: {
          ...progress.progress[currentChapterId],
          [currentLessonId]: {
            notes: progress.progress[currentChapterId]![currentLessonId]?.notes || null,
            ended: ended,
          },
        },
      },
    })
      .then(() => {
        setIsCompleted(ended);

        // check if  course progress is 100%
        if (ended) {
          let completedChapters = 0;
          for (const chapterId in progress.progress) {
            let completedLessons = 0;
            for (const lessonId in progress.progress[chapterId]) {
              if (progress.progress[chapterId]![lessonId]!.ended || lessonId === currentLessonId) completedLessons++;
            }
            if (completedLessons === course.chapters.find((el) => el._id === chapterId)!.lessons.length)
              completedChapters++;
          }
          if (completedChapters === course.chapters.length && course.generateCertificate) {
            router.push(`/moje-konto/kursy/${course.slug}/certyfikat`);
          }
        }

        if (!autoplay && type === 'auto') return;

        if (type === 'manual') {
          router.refresh();
          return;
        }

        if (currentChapter.lessons.length > currentLessonIndex + 1) {
          router.push(`/moje-konto/kursy/${course.slug}/${currentChapter.lessons[currentLessonIndex + 1]!.slug}`);
        } else {
          router.push(`/moje-konto/kursy/${course.slug}/${course.chapters[currentChapterIndex + 1]!.lessons[0]!.slug}`);
        }
      })
      .catch(() => {});
  };

  const setIsLeftHanded = async (isLeftHanded: boolean) => {
    await supabase
      .from('profiles')
      .update({
        left_handed: isLeftHanded,
      })
      .eq('id', id);

    setLeftHanded(isLeftHanded);
  };

  const setIsAutoplay = async (isAutoplay: boolean) => {
    await supabase
      .from('profiles')
      .update({
        auto_play: isAutoplay,
      })
      .eq('id', id);

    setAutoplay(isAutoplay);
  };

  const files = useMemo(() => {
    return leftHanded ? lesson.files_alter : lesson.files;
  }, [leftHanded, lesson.files, lesson.files_alter]);

  const handleTimeUpdate = (seconds: number) => {
    localStorage.setItem(
      `video-progress-${leftHanded ? lesson.video_alter : lesson.video}-${lesson.videoProvider || 'vimeo'}`,
      String(seconds)
    );
  };

  const lessonsWrapperRef = useRef<HTMLDivElement>(null);

  // Scroll to current lesson on mount
  useEffect(() => {
    const lessonsDiv = lessonsWrapperRef.current?.querySelector(`.${styles.lessons}`);
    const currentLessonElement = lessonsDiv?.querySelector('[data-current="true"]');

    if (currentLessonElement && lessonsDiv) {
      const lessonTop = (currentLessonElement as HTMLElement).offsetTop;
      const lessonHeight = currentLessonElement.clientHeight;
      const wrapperHeight = lessonsDiv.clientHeight;

      const scrollPosition = lessonTop - wrapperHeight / 2 + lessonHeight / 2;
      lessonsDiv.scrollTop = Math.max(0, scrollPosition);
    }
  }, []);

  const nextChapterDate = course.chapters[currentChapterIndex + 1]?.dateOfUnlock;
  const isNextChapterSoon = nextChapterDate && new Date().getTime() < new Date(nextChapterDate).getTime();
  const isLastChapter = currentChapterIndex === course.chapters.length - 1;

  return (
    <section className={styles['LessonHero']}>
      <div className={styles['grid']}>
        <Link
          className={`${styles.returnLink}`}
          href={'/moje-konto/kursy'}
        >
          <ChevronRight />
          Wszystkie kursy
        </Link>
        <div className={styles['content']}>
          <div className={styles.video}>
            <VideoPlayer
              video={lesson.video}
              video_alter={lesson.video_alter}
              autoplay={autoplay}
              speed={true}
              onEnd={() => updateProgress('auto', true)}
              onTimeUpdate={handleTimeUpdate}
              start={
                typeof window === 'undefined'
                  ? 0
                  : Number(
                      localStorage?.getItem(
                        `video-progress-${leftHanded ? lesson.video_alter : lesson.video}-${
                          lesson.videoProvider || 'vimeo'
                        }`
                      ) ?? 0
                    )
              }
              leftHanded={leftHanded}
              provider={lesson.videoProvider}
            />
          </div>
          <nav className={styles.nav}>
            {currentLessonIndex === 0 ? (
              <>
                {currentChapterIndex === 0 ? (
                  <div />
                ) : (
                  <Link
                    className={`${styles['prev']}`}
                    href={`/moje-konto/kursy/${course.slug}/${
                      course.chapters[currentChapterIndex - 1]!.lessons[
                        course.chapters[currentChapterIndex - 1]!.lessons.length - 1
                      ]!.slug
                    }`}
                  >
                    <ChevronRight />
                    Poprzedni moduł
                  </Link>
                )}
              </>
            ) : (
              <Link
                className={`${styles['prev']}`}
                href={`/moje-konto/kursy/${course.slug}/${currentChapter.lessons[currentLessonIndex - 1]!.slug}`}
              >
                <ChevronRight />
                Poprzednia lekcja
              </Link>
            )}
            <button
              data-checked={isCompleted}
              className={styles['complete-button']}
              onClick={() => updateProgress('manual', !isCompleted)}
            >
              <span>
                <Checkmark />
              </span>
              {isCompleted ? 'Oznacz jako nieukończoną' : 'Oznacz jako ukończoną'}
            </button>
            {currentChapter.lessons.length > currentLessonIndex &&
            currentChapter.lessons.length > currentLessonIndex + 1 ? (
              <Link
                className={`${styles['next']}`}
                href={`/moje-konto/kursy/${course.slug}/${currentChapter.lessons[currentLessonIndex + 1]!.slug}`}
              >
                Następna lekcja
                <ChevronLeft />
              </Link>
            ) : (
              <>
                {currentChapterIndex === course.chapters.length - 1 &&
                  isCompleted &&
                  completePercentage === 100 &&
                  course.generateCertificate && (
                    <Link
                      className={`${styles['next']}`}
                      href={`/moje-konto/kursy/${course.slug}/certyfikat`}
                    >
                      Podsumowanie kursu
                      <ChevronLeft />
                    </Link>
                  )}
                {currentChapterIndex !== course.chapters.length - 1 &&
                  (isNextChapterSoon ? (
                    <span
                      style={{ textAlign: 'end' }}
                      className={`${styles['next']}`}
                    >
                      Następny moduł wkrótce
                    </span>
                  ) : !isLastChapter ? (
                    <Link
                      className={`${styles['next']}`}
                      href={`/moje-konto/kursy/${course.slug}/${course.chapters[currentChapterIndex + 1]!.lessons[0]!.slug}`}
                    >
                      Następny moduł
                      <ChevronLeft />
                    </Link>
                  ) : null)}
              </>
            )}
          </nav>
        </div>
        <div>
          <div className={styles.progress}>
            <h1>{course.name}</h1>
            <p>
              Ukończono <PercentChart p={completePercentage} />
            </p>
          </div>
          <p className={styles['chapter']}>
            <span>Moduł {currentChapterIndex + 1}:</span> {currentChapter.chapterName}
          </p>
          <div
            className={styles.lessonsWrapper}
            ref={lessonsWrapperRef}
          >
            <div className={styles.lessons}>
              {currentChapter.lessons.map((el, i) => (
                <Link
                  href={`/moje-konto/kursy/${course.slug}/${el.slug}`}
                  key={i}
                  data-current={el.slug === lesson.slug}
                  data-checked={progress.progress[currentChapter._id]![el._id]?.ended}
                  scroll={false}
                >
                  <p>
                    {progress.progress[currentChapter._id]![el._id]?.ended && <CheckIcon />}
                    <small>Lekcja {i + 1}</small>
                  </p>{' '}
                  {el.title}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className={styles['columns']}>
        <div className={styles['column']}>
          <Switch inputProps={{ defaultChecked: autoplay, onChange: () => setIsAutoplay(!autoplay) }}>
            Autoodtwarzanie
          </Switch>
          <Switch inputProps={{ defaultChecked: leftHanded, onChange: () => setIsLeftHanded(!leftHanded) }}>
            Jestem osobą leworęczną
          </Switch>
          <p>Ustawienie to dostosowuje w jaki sposób wyświetlają Ci się kursy i pliki do lekcji</p>
        </div>
        <div className={styles['column']}>
          {files && <h2>Pliki do pobrania</h2>}
          <ul className={styles['list']}>
            {files?.map((el, i) => (
              <li key={i}>
                <a
                  download={el.asset.originalFilename}
                  href={el.asset.url + '?dl='}
                  className='link'
                >
                  {parseFileName(el.asset.originalFilename)} <small>({formatBytes(el.asset.size)})</small>
                </a>
              </li>
            ))}
          </ul>
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

function ChevronLeft() {
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
        d='M7.187 15.625L12.813 10 7.187 4.375'
      ></path>
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='20'
      height='21'
      fill='none'
    >
      <path
        stroke='#5C7360'
        strokeLinecap='round'
        strokeLinejoin='round'
        d='M16.25 5.97l-8.75 10-3.75-3.75'
      ></path>
    </svg>
  );
}

const Checkmark = () => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='14'
    height='12'
    fill='none'
    viewBox='0 0 14 12'
  >
    <path
      stroke='#9A827A'
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M13.25 1L4.5 11 .75 7.25'
    ></path>
  </svg>
);
