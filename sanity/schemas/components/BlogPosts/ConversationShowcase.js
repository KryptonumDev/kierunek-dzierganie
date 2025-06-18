import { removeMarkdown } from '../../../utils/remove-markdown';
const title = 'Przedstawienie rozmowy';
const icon = () => '💬';

export default {
  name: 'ConversationShowcase',
  type: 'object',
  title,
  icon,
  fields: [
    {
      name: 'list',
      type: 'array',
      of: [{ type: 'ConversationShowcase_List' }],
      title: 'Konwersacja',
      description: 'Dodaj wiadomości do konwersacji',
      validation: Rule => Rule.required(),
    },
    {
      name: 'recipient',
      type: 'ConversationShowcase_Recipient',
      title: 'Odbiorca',
      description: 'Odbiorca znajduje się po prawej stronie konwersacji',
      validation: Rule => Rule.required(),
    },
    {
      name: 'sender',
      type: 'ConversationShowcase_Sender',
      title: 'Nadawca',
      description: 'Nadawca znajduje się po lewej stronie konwersacji',
      validation: Rule => Rule.required(),
    },
  ],
  preview: {
    select: {
      list: 'list',
      recipient: 'recipient',
      sender: 'sender',
    },
    prepare({ recipient, sender, list }) {
      return {
        title: `[${title}] - liczba wiadomości: ${list.length}`,
        subtitle: `Odbiorca: ${removeMarkdown(recipient.name)} | Nadawca: ${removeMarkdown(sender.name)}`,
        media: icon,
      };
    },
  },
};

export const ConversationShowcase_List = {
  name: 'ConversationShowcase_List',
  title: 'Lista',
  type: 'object',
  fields: [
    {
      name: 'message',
      type: 'text',
      title: 'Wiadomość',
    },
    {
      name: 'audioFile',
      type: 'file',
      title: 'Plik audio',
      description: 'Plik audio najlepiej w formacie mp3',
    },
    {
      name: 'isRecipient',
      type: 'boolean',
      title: 'Odbiorca',
      description: 'Czy ta wiadomość jest od odbiorcy?',
      validation: Rule => Rule.required(),
    },
  ],
  preview: {
    select: {
      message: 'message',
      audio: 'audioFile',
      isRecipient: 'isRecipient',
    },
    prepare({ message, isRecipient, audio }) {
      return {
        title: `${isRecipient ? 'Odbiorca' : 'Nadawca'} - ${message ? message : 'Plik audio'}`,
        media: icon,
      };
    },
  },
};

export const ConversationShowcase_Recipient = {
  name: 'ConversationShowcase_Recipient',
  title: 'Odbiorca',
  type: 'object',
  fields: [
    {
      name: 'name',
      type: 'markdown',
      title: 'Imię',
      validation: Rule => Rule.required(),
    },
    {
      name: 'img',
      type: 'image',
      title: 'Zdjęcie odbiorcy',
      validation: Rule => Rule.required(),
    },
  ],
};

export const ConversationShowcase_Sender = {
  name: 'ConversationShowcase_Sender',
  title: 'Nadawca',
  type: 'object',
  fields: [
    {
      name: 'name',
      type: 'markdown',
      title: 'Imię',
      validation: Rule => Rule.required(),
    },
    {
      name: 'img',
      type: 'image',
      title: 'Zdjęcie nadawcy',
      validation: Rule => Rule.required(),
    },
  ],
};
