import ColorPicker from './ColorPicker';
export default ColorPicker;
export type { ColorPickerTypes } from './ColorPicker.types';

export const ColorPicker_Query = `
  _type == "ColorPicker" => {
    name,
    list[] {
      name,
      color {
        hex
      }
    },
  },
`;