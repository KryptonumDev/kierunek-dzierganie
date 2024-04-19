import EmptyFiles from '@/components/_dashboard/EmptyFiles';
import FilesHero from '@/components/_dashboard/FilesHero';
import ListingFiles from '@/components/_dashboard/ListingFiles';
import { Img_Query } from '@/components/ui/image';
import Seo from '@/global/Seo';
import type { CoursesProgress, File, ImgType } from '@/global/types';
import sanityFetch from '@/utils/sanity.fetch';
import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

type QueryProps = {
  data: {
    global: {
      image_knitting: ImgType;
      image_crochet: ImgType;
    };
    courses: {
      _id: string;
      name: string;
      slug: string;
      chapters: {
        _id: string;
        lessons: {
          _id: string;
          files: File[];
          files_alter: File[];
        }[];
      }[];
    }[];
  };
  id: string;
  left_handed: boolean;
  progress: CoursesProgress[];
};

export default async function Files() {
  const {
    data: { global, courses },
    id,
    left_handed,
    progress,
  }: QueryProps = await query();

  return (
    <div>
      <FilesHero
        left_handed={left_handed}
        id={id}
      />
      {courses.length > 0 ? (
        <ListingFiles
          left_handed={left_handed}
          courses={courses}
          progress={progress}
        />
      ) : (
        <EmptyFiles
          image_crochet={global.image_crochet}
          image_knitting={global.image_knitting}
        />
      )}
    </div>
  );
}

export async function generateMetadata() {
  return Seo({
    title: 'Pliki do pobrania | Kierunek dzierganie',
    path: '/moje-konto/pliki-do-pobrania',
  });
}

const query = async (): Promise<QueryProps> => {
  const cookieStore = cookies();
  const supabase = createServerActionClient({ cookies: () => cookieStore });
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const res = await supabase
    .from('profiles')
    .select(
      `
        id,
        left_handed,
        courses_progress (
          id,
          course_id,
          owner_id,
          progress
        )
      `
    )
    .eq('id', user!.id)
    .single();

  const data = await sanityFetch<QueryProps['data']>({
    query: /* groq */ ` {
      "global":  *[_id == 'global'][0] {
        image_crochet {
          asset -> {
            url,
            altText,
            metadata {
              lqip,
              dimensions {
                width,
                height,
              },
            },
          },
        },
        image_knitting {
          ${Img_Query}
        },
      },
      "courses": *[_type == "course" && _id in $id] {
        _id,
        name,
        "slug": slug.current,
        chapters {
          "_id": _key,
          lessons[]->{
            files[]{
              asset->{
                url,
                size,
                originalFilename,
                _id
              }
            },
            files_alter[]{
              asset->{
                url,
                size,
                originalFilename,
                _id
              }
            },
          }
        }[],
      },
    }`,
    params: {
      id: res.data!.courses_progress.map((course) => course.course_id),
    },
  });
  return { data: data, id: res.data!.id, left_handed: res.data!.left_handed, progress: res.data!.courses_progress };
};
