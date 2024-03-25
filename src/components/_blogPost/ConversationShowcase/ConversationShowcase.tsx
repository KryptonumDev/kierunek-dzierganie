import styles from './ConversationShowcase.module.scss';
import type { ConversationShowcaseTypes } from './ConversationShowcase.types';

const ConversationShowcase = ({ list, recipient, sender }: ConversationShowcaseTypes) => {
  console.log(list, recipient, sender);
  return <section className={styles['ConversationShowcase']}></section>;
};

export default ConversationShowcase;
