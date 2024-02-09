import ContactForm from './ContactForm';
export type { Props as ContactFormProps } from './ContactForm.types';
export default ContactForm;

export const ContactForm_Query = `
  _type == 'ContactForm' => {
    _type,
    heading,
    paragraph,
  },
`;