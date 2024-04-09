import Markdown from '@/components/ui/markdown';
import styles from './ConversationShowcase.module.scss';
import type { ConversationShowcaseTypes } from './ConversationShowcase.types';
import Img from '@/components/ui/image';
import Visualizer from './Visualizer';

const ConversationShowcase = ({ list, recipient, sender }: ConversationShowcaseTypes) => {
  return (
    <section className={styles['ConversationShowcase']}>
      {list.map(({ message, isRecipient, audioFile }, index) => (
        <div
          className={styles.item}
          key={index}
        >
          <div className={isRecipient ? styles.recipientMessage : styles.senderMessage}>
            <div className={styles.cloudWrapper}>
              {message && <p className={styles.cloud}>{message}</p>}
              {audioFile && <Visualizer audioFile={audioFile} />}
              <CloudBeggining />
            </div>
            {isRecipient ? (
              <div className={styles.recipient}>
                <Img
                  data={recipient.img}
                  sizes=''
                />
                <Markdown.h4>{recipient.name}</Markdown.h4>
              </div>
            ) : (
              <div className={styles.sender}>
                <Markdown.h4>{sender.name}</Markdown.h4>
                <Img
                  data={sender.img}
                  sizes=''
                />
              </div>
            )}
          </div>
        </div>
      ))}
    </section>
  );
};

export default ConversationShowcase;

function CloudBeggining() {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='50'
      height='30'
      fill='none'
      viewBox='0 0 50 30'
      className={styles.cloudBeggining}
    >
      <path
        fill='#FAF4F0'
        d='M47.63 27.04c-4.373-9.746-1.845-17.91 1.579-23.021 1.02-1.525-.112-4.1-1.945-4.013L1.789 2.192C.113 2.272-.631 4.319.619 5.44c19.995 17.94 36.927 23.47 45.364 24.235 1.397.126 2.22-1.355 1.646-2.635z'
      ></path>
    </svg>
  );
}
