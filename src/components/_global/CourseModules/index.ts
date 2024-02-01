import CourseModules from './CourseModules';
export type { Props as CourseModulesProps } from './CourseModules.types';
export default CourseModules;

export const CourseModules_Query = `
  _type == 'CourseModules' => {
    _type,
    heading,
    paragraph,
    list[] {
      title,
      description,
      img {
        asset -> {
          url,
          altText,
          metadata {
            lqip,
            dimensions {
              width,
              height,
            }
          }
        }
      }
    }
  },
`;