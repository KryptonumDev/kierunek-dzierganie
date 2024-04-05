import { Img_Query } from '@/components/ui/image';
import SuggestedCourses from './SuggestedCourses';
export default SuggestedCourses;
export type { SuggestedCoursesTypes } from './SuggestedCourses.types';

/**
 * Define courses in params.
 */
export const SuggestedCourses_Query = `
"suggestedCourses": *[_type=="product" && type=="digital" && (course->_id in $courses)][0..2] {
  price,
  name,
  course -> {
    _id,
    type,
    image {
      ${Img_Query}
    },          
    complexity,
    "slug": slug.current,
  },
},
`;
