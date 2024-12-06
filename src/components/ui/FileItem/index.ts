import FileItem from './FileItem';
export default FileItem;
export type { FileItemTypes } from './FileItem.types';

export const FileItem_Query = `
  _type == "FileItem" => {

  },
`;