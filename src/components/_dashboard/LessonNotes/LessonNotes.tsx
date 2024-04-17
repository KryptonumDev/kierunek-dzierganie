'use client';
import Input from '@/components/ui/Input';
import styles from './LessonNotes.module.scss';
import type { FormTypes, LessonNotesTypes } from './LessonNotes.types';
import { useForm, type SubmitHandler } from 'react-hook-form';
import Button from '@/components/ui/Button';
import { updateElement } from '@/utils/update-progress';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LessonNotes = ({ progress, currentChapter, currentLessonIndex }: LessonNotesTypes) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormTypes>({
    mode: 'all',
    defaultValues: {
      notes: progress.progress[currentChapter._id]![currentChapter.lessons[currentLessonIndex]!._id]?.notes || '',
    },
  });

  const handleSave = () => {
    toast('Notatki zostały pomyślnie zapisane w plikach do pobrania', {
      position: 'top-right',
      autoClose: 5000,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: false,
      theme: 'light',
      progress: undefined,
    });
  };

  const onSubmit: SubmitHandler<FormTypes> = async (data) => {
    const currentChapterId = currentChapter._id;
    const currentLessonId = currentChapter.lessons[currentLessonIndex]!._id;

    await updateElement({
      ...progress,
      progress: {
        ...progress.progress,
        [currentChapterId]: {
          ...progress.progress[currentChapterId],
          [currentLessonId]: {
            ...progress.progress[currentChapterId]![currentLessonId]!,
            notes: data.notes,
          },
        },
      },
    })
      .then(() => {
        handleSave();
      })
      .catch(() => {});
  };

  return (
    <section className={styles['LessonNotes']}>
      <h2>
        Dodaj swoje <strong>notatki</strong>
      </h2>
      <p>Specjalne miejsce na Twoje przemyślenia</p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          textarea={true}
          label=''
          placeholder='Napisz coś ciekawego'
          rows={5}
          register={register('notes')}
          errors={errors}
        />
        <Button type='submit'>Zapisz</Button>
      </form>
    </section>
  );
};

export default LessonNotes;
