import { useMemo } from 'react';
import styles from './ListingFiles.module.scss';
import type { ListingFilesTypes } from './ListingFiles.types';
import type { File } from '@/global/types';
import { formatBytes } from '@/utils/format-bytes';

const ListingFiles = ({ courses, left_handed }: ListingFilesTypes) => {
  const transformFiles = useMemo(() => {
    type ArrElement = { name: string; files: File[]; filesAlt: File[] };

    const newArr: ArrElement[] = [];

    courses.forEach((course) => {
      const obj: ArrElement = {
        name: course.name,
        files: [],
        filesAlt: [],
      };

      course.chapters.forEach((chapter) => {
        chapter.lessons.forEach((lesson) => {
          if (lesson.files) obj.files.push(...lesson.files);
          if (lesson.files_alter) obj.filesAlt.push(...lesson.files_alter);
        });
      });

      newArr.push(obj);
    });

    return newArr;
  }, [courses]);

  return (
    <section className={styles['ListingFiles']}>
      {transformFiles.map((el, i) => (
        <div key={el.name + i}>
          <h3>{el.name}</h3>
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
                    {file.asset.originalFilename} <small>({formatBytes(file.asset.size)})</small>
                  </a>
                </li>
              ))}
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
                    {file.asset.originalFilename} <small>({formatBytes(file.asset.size)})</small>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </section>
  );
};

export default ListingFiles;

const Icon = () => (
  <svg
    width='174'
    height='108'
    viewBox='0 0 174 108'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    xmlnsXlink='http://www.w3.org/1999/xlink'
  >
    <rect
      x='-0.000976562'
      width='174'
      height='108'
      rx='4'
      fill='url(#pattern0)'
    />
    <defs>
      <pattern
        id='pattern0'
        patternContentUnits='objectBoundingBox'
        width='1'
        height='1'
      >
        <use
          xlinkHref='#image0_1261_18710'
          transform='matrix(0.000929368 0 0 0.00149732 0 -0.00234924)'
        />
      </pattern>
      <image
        id='image0_1261_18710'
        width='1076'
        height='671'
        xlinkHref='data:image/png;base64,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DQAAACBH0AAAAAByBA0AAAAgR9AAAAAAcgQNAAAAIEfQAAAAAHIEDQAAACBH0AAAAAByBA0AAAAgR9AAAAAAcgQNAAAAIEfQAAAAAHIEDQAAACBH0AAAAAByBA0AAAAgR9AAAAAAcgQNAAAAIEfQAAAAAHIEDQAAACBH0AAAAAByBA0AAAAgR9AAAAAAcgQNAAAAIEfQAAAAAHIEDQAAACBH0AAAAAByBA0AAAAgR9AAAAAAcgQNAAAAIEfQAAAAAHIEDQAAACBH0AAAAAByBA0AAAAgR9AAAAAAcgQNAAAAIEfQAAAAAHIEDQAAACBH0AAAAAByBA0AAAAgR9AAAAAAcgQNAAAAIEfQAAAAAHIEDQAAACBH0AAAAAByBA0AAAAgR9AAAAAAcgQNAAAAIEfQAAAAAHIEDQAAACBH0AAAAAByBA0AAAAgR9AAAAAAcgQNAAAAIEfQAAAAAHIEDQAAACBH0AAAAAByBA0AAAAgR9AAAAAAcgQNAAAAIEfQAAAAAHIEDQAAACBH0AAAAAByBA0AAAAgR9AAAAAAcgQNAAAAIEfQAAAAAHIEDQAAACBH0AAAAAByBA0AAAAgR9AAAAAAcgQNAAAAIEfQAAAAAHIEDQAAACBH0AAAAAByBA0AAAAgR9AAAAAAcgQNAAAAIEfQAAAAAHIEDQAAACBH0AAAAAByBA0AAAAgR9AAAAAAcgQNAAAAIEfQAAAAAHIEDQAAACBH0AAAAAByBA0AAAAgR9AAAAAAcgQNAAAAIEfQABgAAECNoAEAAADkCBoAAABAjqABAAAA5AgaAAAAQI6gAQAAAOQIGgAAAECOoAEAAADkCBoAAABAjqABAAAA5AgaAAAAQI6gAQAAAOQIGgAAAECOoAEAAADkCBoAAABAjqABAAAA5AgaAAAAQI6gAQAAAOQIGgAAAECOoAEAAADkCBoAAABAjqABAAAA5AgaAAAAQI6gAQAAAOQIGgAAAECOoAEAAADkCBoAAABAjqABAAAA5AgaAAAAQI6gAQAAAOQIGgAAAECOoAEAAADkCBoAAABAjqABAAAA5AgaAAAAQI6gAQAAAOQIGgAAAECOoAEAAADkCBoAAABAjqABAAAA5AgaAAAAQI6gAQAAAOQIGgAAAECOoAEAAADkCBoAAABAjqABAAAA5AgaAAAAQI6gAQAAAOQIGgAAAECOoAEA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BA0AAAAgR9AAAAAAcgQNAAAAIEfQAAAAAHIEDQAAACBH0AAAAAByBA0AAAAgR9AAAAAAcgQNAAAAIEfQAAAAAHIEDQAAACBH0AAAAAByBA0AAAAgR9AAAAAAcgQNAAAAIEfQAAAAAHIEDQAAACBH0AAAAAByBA0AAAAgR9AAAAAAcgQNAAAAIEfQAAAAAHIEDQAAACBH0AAAAAByBA0AAAAgR9AAAAAAcgQNAAAAIEfQAAAAAHIEDQAAACBH0AAAAAByBA0AAAAgR9AAAAAAcgQNAAAAIEfQAAAAAHIEDQAAACBH0AAAAAByBA0AAAAgR9AAAAAAcgQNAAAAIEfQAAAAAHIEDQAAACBH0AAAAAByBA0AAAAgR9AAAAAAcgQNAAAAIEfQAAAAAHIEDQAAACBH0AAAAAByBA0AAAAgR9AAAAAAcgQNAAAAIEfQAAAAAHIEDQAAACBH0AAAAAByBA0AAAAgR9AAAAAAcgQNAAAAIEfQAAAAAHIEDQAAACBH0AAAAAByBA0AAAAgR9AAAAAAcgQNAAAAIEfQAAAAAHIEDQAAACBH0AAAAAByBA0AAAAgR9AAAAAAcgQNAAAAIEfQAAAAAHIEDQAAACBH0AAAAAByBA0AAAAgR9AAAAAAcgQNAAAAIEfQAAAAAHIEDQAAACBH0AAAAAByBA0AAAAgR9AAAAAAcgQNAAAAIEfQAAAAAHIEDQAAACBH0AAAAAByBA0AAAAgR9AAAAAAcgQNAAAAIEfQAAAAAHIEDQAAACBH0AAAAAByBA0AAAAgR9AAAAAAcgQNAAAAIEfQAAAAAHIEDQAAACBH0AAAAAByBA0AAAAgR9AAAAAAcgQNAAAAIEfQAAAAAHIEDQAAACBH0AAAAAByBA0AAAAgR9AAAAAAcgQNAAAAIEfQAAAAAHIEDQAAACBH0AAAAAByBA0AAAAgR9AAAAAAcgQNAAAAIEfQAAAAAHIEDQAAACBH0AAAAAByBA0AAAAgR9AAAAAAcgQNAAAAIEfQAAAAAHIEDQAAACBH0AAAAAByBA0AAAAgR9AAAAAAcgQNAAAAIEfQAAAAAHIEDQAAACBH0AAAAAByBA0AAAAgR9AAAAAAcgQNAAAAIEfQAAAAAHIEDQAAACBH0AAAAAByBA0AAAAgR9AAAAAAcv4L/SB2I8EjMOUAAAAASUVORK5CYII='
      />
    </defs>
  </svg>
);
