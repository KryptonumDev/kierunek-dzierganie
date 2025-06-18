import FilesComponent from './FilesComponent';
export type { Props as FilesComponentProps } from './FilesComponent.types';
export default FilesComponent;

export const FilesComponent_Query = `
    files[] {
      asset -> {
        url,
        originalFilename,
        size
      }
    },
`;