import FileItem from '@/components/ui/FileItem';
import type { File } from '@/global/types';
import type { QueryProps as MapNotesQueryProps } from '@/utils/map-note';
import mapNotes from '@/utils/map-note';
import { useMemo } from 'react';
import RelatedNotes from '../RelatedNotes';
import styles from './ListingFiles.module.scss';
import type { ListingFilesTypes } from './ListingFiles.types';

const ListingFiles = ({ courses, left_handed, progress }: ListingFilesTypes) => {
  const transformFiles = useMemo(() => {
    type ArrElement = {
      slug: string;
      name: string;
      files: File[];
      filesAlt: File[];
      showCert: boolean;
      notes: {
        chapterName: string;
        lessons: {
          name: string;
          notes: string;
        }[];
      }[];
    };

    const newArr: ArrElement[] = [];

    courses?.forEach((course) => {
      const obj: ArrElement = {
        name: course.name,
        slug: course.slug,
        files: [],
        filesAlt: [],
        showCert: false,
        notes: [],
      };

      // get all files from lessons
      course.chapters?.forEach((chapter) => {
        chapter?.lessons?.forEach((lesson) => {
          if (!lesson) return;
          if (lesson.files) obj.files.push(...lesson.files);
          if (lesson.files_alter) obj.filesAlt.push(...lesson.files_alter);
        });
      });

      // check if course is completed
      const courseProgress = progress.find((el) => el.course_id === course._id)!;

      if (!courseProgress) return;

      obj.notes = mapNotes(courseProgress, course as unknown as MapNotesQueryProps['course']);

      let completedChapters = 0;
      for (const chapterId in courseProgress.progress) {
        let completedLessons = 0;

        const chapter = course.chapters.find((el) => el._id === chapterId);

        // case - course was updated and some old chapters was removed
        if (!chapter) continue;

        for (const lessonId in courseProgress.progress[chapterId]) {
          if (courseProgress.progress[chapterId]![lessonId]!.ended) completedLessons++;
        }

        if (completedLessons === chapter!.lessons?.length) completedChapters++;
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
            <h2>{el.name}</h2>{' '}
            <ul>
              <>
                {left_handed
                  ? el.filesAlt.map((file) => (
                      <li key={file.asset._id}>
                        <FileItem file={file} />
                      </li>
                    ))
                  : el.files.map((file) => (
                      <li key={file.asset._id}>
                        <FileItem file={file} />
                      </li>
                    ))}
                {el.notes.length > 0 && (
                  <RelatedNotes
                    notes={el.notes}
                    courseName={el.name}
                  />
                )}
              </>
            </ul>
          </div>
        );
      })}
    </section>
  );
};

export default ListingFiles;
