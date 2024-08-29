import { useMemo } from 'react';
import styles from './ListingFiles.module.scss';
import type { ListingFilesTypes } from './ListingFiles.types';
import type { File } from '@/global/types';
import { formatBytes } from '@/utils/format-bytes';
import Link from 'next/link';
import parseFileName from '@/utils/parse-file-name';

const ListingFiles = ({ courses, left_handed, progress }: ListingFilesTypes) => {
  const transformFiles = useMemo(() => {
    type ArrElement = { slug: string; name: string; files: File[]; filesAlt: File[]; showCert: boolean };

    const newArr: ArrElement[] = [];

    courses?.forEach((course) => {
      const obj: ArrElement = {
        name: course.name,
        slug: course.slug,
        files: [],
        filesAlt: [],
        showCert: false,
      };

      // get all files from lessons
      course.chapters?.forEach((chapter) => {
        chapter?.lessons?.forEach((lesson) => {
          if (lesson.files) obj.files.push(...lesson.files);
          if (lesson.files_alter) obj.filesAlt.push(...lesson.files_alter);
        });
      });

      // check if course is completed
      const courseProgress = progress.find((el) => el.course_id === course._id)!;

      if (!courseProgress) return;

      let completedChapters = 0;
      for (const chapterId in courseProgress.progress) {
        let completedLessons = 0;
        for (const lessonId in courseProgress.progress[chapterId]) {
          if (courseProgress.progress[chapterId]![lessonId]!.ended) completedLessons++;
        }
        if (completedLessons === course.chapters.find((el) => el._id === chapterId)!.lessons.length)
          completedChapters++;
      }
      if (completedChapters === course.chapters?.length && course.generateCertificate) {
        obj.showCert = true;
      }

      newArr.push(obj);
    });

    return newArr;
  }, [courses, progress]);

  return (
    <section className={styles['ListingFiles']}>
      {transformFiles.map((el, i) => {
        if (left_handed && el.filesAlt.length === 0) return null;
        if (!left_handed && el.files.length === 0) return null;

        return (
          <div key={el.name + i}>
            <h2>{el.name}</h2>
            {left_handed ? (
              <ul>
                {el.filesAlt.map((file) => (
                  <li key={file.asset._id}>
                    <a
                      href={file.asset.url}
                      target='_blank'
                      rel='noreferrer'
                      download
                    >
                      <Icon />
                      {parseFileName(file.asset.originalFilename)} <small>({formatBytes(file.asset.size)})</small>
                    </a>
                  </li>
                ))}
                {/* TODO: przerobić na wyświetlenie procentów kursu */}
                {el.showCert && (
                  <li>
                    {/* TODO: przerobić na pobieranie certyfikatu */}
                    <Link href={`/moje-konto/kursy/${el.slug}/certyfikat`}>
                      <Icon />
                      Certyfikat
                    </Link>
                  </li>
                )}
              </ul>
            ) : (
              <ul>
                {el.files.map((file) => (
                  <li key={file.asset._id}>
                    <a
                      href={file.asset.url}
                      target='_blank'
                      rel='noreferrer'
                      download
                    >
                      <Icon />
                      {parseFileName(file.asset.originalFilename)} <small>({formatBytes(file.asset.size)})</small>
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </section>
  );
};

export default ListingFiles;

function Icon() {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='174'
      height='108'
      viewBox='0 0 522 324'
      fill='none'
    >
      <rect
        width='522'
        height='324'
        x='-0.001'
        fill='#FAF4F0'
        rx='12'
      ></rect>
      <circle
        cx='260.999'
        cy='162'
        r='132.914'
        fill='#EFE8E7'
      ></circle>
      <path
        fill='#FDFBF8'
        stroke='#B4A29C'
        strokeWidth='1.097'
        d='M197.355 75.585h90.188c.571 0 1.12.223 1.529.62l37.103 36.043c.425.413.665.981.665 1.574v132.399a2.194 2.194 0 01-2.195 2.194h-127.29a2.194 2.194 0 01-2.195-2.194V77.78c0-1.212.983-2.195 2.195-2.195z'
      ></path>
      <path
        fill='#fff'
        stroke='#B4A29C'
        strokeWidth='1.097'
        d='M287.268 111.798V77.006c0-.968 1.163-1.462 1.86-.789l37.132 35.889c.71.686.224 1.886-.763 1.886h-36.035a2.194 2.194 0 01-2.194-2.194z'
      ></path>
      <path
        fill='#E5D8D4'
        d='M195.409 193.178h131.188v53.043a2.194 2.194 0 01-2.194 2.194H197.604a2.194 2.194 0 01-2.195-2.194v-53.043z'
      ></path>
      <path
        fill='#332621'
        d='M240.149 223.291v7.506h-1.343v-18.633h4.806c2.186 0 3.832.478 4.938 1.435 1.115.957 1.672 2.322 1.672 4.096a5.42 5.42 0 01-.461 2.251 4.988 4.988 0 01-1.303 1.778c-.571.492-1.264.878-2.081 1.159-.816.272-1.738.408-2.765.408h-3.463zm0-1.08h3.463c.825 0 1.562-.114 2.212-.342.65-.228 1.198-.544 1.646-.948a4.024 4.024 0 001.04-1.422 4.39 4.39 0 00.369-1.804c0-1.431-.443-2.533-1.33-3.306-.878-.772-2.19-1.158-3.937-1.158h-3.463v8.98zm29.582-.737c0 1.44-.215 2.734-.646 3.884-.43 1.15-1.036 2.129-1.817 2.937a7.89 7.89 0 01-2.805 1.857c-1.088.43-2.295.645-3.621.645h-6.794v-18.633h6.794c1.326 0 2.533.215 3.621.645a7.864 7.864 0 012.805 1.857c.781.808 1.387 1.786 1.817 2.936.431 1.15.646 2.441.646 3.872zm-1.396 0c0-1.299-.18-2.458-.54-3.477-.36-1.018-.869-1.878-1.528-2.58a6.392 6.392 0 00-2.357-1.607c-.921-.369-1.944-.553-3.068-.553h-5.438v16.447h5.438c1.124 0 2.147-.185 3.068-.553a6.392 6.392 0 002.357-1.607c.659-.702 1.168-1.562 1.528-2.581.36-1.018.54-2.181.54-3.489zm16.888-9.31v1.119h-9.81v7.835h8.493v1.12h-8.493v8.559h-1.356v-18.633h11.166z'
      ></path>
      <path
        stroke='#B4A29C'
        strokeWidth='1.097'
        d='M197.358 75.585h90.188c.571 0 1.119.223 1.529.62l37.103 36.043c.425.413.665.981.665 1.574V246.22a2.195 2.195 0 01-2.195 2.195h-127.29a2.195 2.195 0 01-2.195-2.195V77.78c0-1.212.983-2.195 2.195-2.195z'
      ></path>
    </svg>
  );
}
