import { useForm } from 'react-hook-form';
import styles from './UserData.module.scss';
import type { AuthorizationDataFormTypes, AuthorizationDataTypes } from './UserData.types';
import Input from '@/components/ui/PasswordInput';
import { REGEX } from '@/global/constants';
import Button from '@/components/ui/Button';
import { toast } from 'react-toastify';
import { createClient } from '@/utils/supabase-client';

export default function AuthorizationData({ email }: AuthorizationDataTypes) {
  const supabase = createClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthorizationDataFormTypes>({
    mode: 'all',
    defaultValues: {
      email,
    },
  });

  const onSubmit = async (data: AuthorizationDataFormTypes) => {
    const { data: userData } = await supabase.auth.getUser();

    const newData: { email?: string; password?: string } = {};

    if (data.email !== userData.user!.email) {
      newData.email = data.email;
    }

    if (data.password) {
      newData.password = data.password;
    }

    try {
      await supabase.auth.updateUser(newData);

      if (newData.email) {
        // await supabase.from('profiles').update({ email: newData.email }).eq('id', id);
        toast('E-mail z potwierdzeniem zmiany został wysłany na podany adres');
      }

      if (newData.password) {
        toast('Hasło zostało zmienione');
      }
    } catch (error) {
      toast('Wystąpił błąd podczas zapisywania danych');
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={styles['authorization-data']}
    >
      <Input
        label='E-mail'
        register={register('email', {
          required: {
            value: true,
            message: 'Pole wymagane',
          },
          pattern: {
            value: REGEX.email,
            message: 'Proszę wpisać poprawny e-mail',
          },
        })}
        errors={errors}
      />
      <Input
        isRegister={true}
        password={true}
        label='Password'
        register={register('password', {
          required: {
            value: true,
            message: 'Pole wymagane',
          },
          minLength: {
            value: 12,
            message: 'Co najmniej 12 znaków',
          },
        })}
        errors={errors}
      />
      <Button type='submit'>Zapisz</Button>
    </form>
  );
}
