'use client';
import Switch from '@/components/ui/Switch';
import styles from './UserData.module.scss';
import type { UserDataTypes } from './UserData.types';
// import AuthorizationData from './_AuthorizationData';
import PersonalData from './_PersonalData';
import DeletePopup from './_DeletePopup';
import { useState } from 'react';
import { createClient } from '@/utils/supabase-client';

const UserData = ({ data }: UserDataTypes) => {
  const [openDeletePopup, setOpenDeletePopup] = useState(false);
  const supabase = createClient();

  const setLeftHanded = async (leftHanded: boolean) => {
    await supabase
      .from('profiles')
      .update({
        left_handed: leftHanded,
      })
      .eq('id', data.id);
  };

  return (
    <section className={styles['UserData']}>
      <h1>
        Moje <strong>dane</strong>
      </h1>

      <div className={styles['grid']}>
        <div>
          <Switch
            inputProps={{
              onClick: (v) => setLeftHanded(v.currentTarget.checked),
              defaultChecked: data.left_handed,
            }}
          >
            Jestem osobą leworęczną
          </Switch>
          <p className={styles['switch-annotation']}>Zmienia sposób, w jaki wyświetlają się kursy i pliki do lekcji</p>
        </div>
        <div className={styles['right-column']}>
          {/* <AuthorizationData
            id={data.id}
            email={data.email}
          /> */}
          <PersonalData
            id={data.id}
            billing_data={data.billing_data}
          />
          <hr />
          <button
            onClick={() => setOpenDeletePopup(true)}
            className='link'
          >
            Usuń konto
          </button>
        </div>
      </div>
      <DeletePopup
        openDeletePopup={openDeletePopup}
        setOpenDeletePopup={setOpenDeletePopup}
      />
    </section>
  );
};

export default UserData;
