import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

const LandingPage = async () => {
  const data = await getData();
  console.log(data);
  
  return <h1>Homepage</h1>;
};


const getData = async () => {
  const supabase = createServerActionClient({ cookies });
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data } = await supabase
    .from('profiles')
    .select(
      `
        id, 
        enrolled_courses (
          course_id
        )
      `
    )
    .eq('id', user?.id);

  return data;
};

export default LandingPage;
