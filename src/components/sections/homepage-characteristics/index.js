import styles from './styles.module.scss';
import Markdown from '@/utils/Markdown';

const Characteristics = ({
  data: {
    characteristics_List
  }
}) => {
  return (
    <section className={styles.wrapper}>
      {characteristics_List.map((item, i) => (
        <div className="item" key={i}>
          <Markdown.h2 className={styles.title}>{item.title}</Markdown.h2>
          <Markdown className={styles.description}>{item.description}</Markdown>
        </div>
      ))}
      <Decoration aria-label="hidden" className={styles.decoration} />
    </section>
  );
};

export default Characteristics;

const Decoration = ({ ...props }) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='125'
    height='125'
    viewBox='0 0 125 125'
    fill='none'
    {...props}
  >
    <path
      stroke='#9A827A'
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M50.152 71.645c8.852-6.744 23.481 4.468 29.69 10.917-12.81.418-22.966-.923-26.443-1.645-7.15-2.558-5.144-7.248-3.247-9.272zM77.45 78.2c-2.253-6.866-5.7-21.764-1.472-26.429 1.29-1.544 4.741-3.869 8.229-.817 2.743 2.815 5.296 12.141-6.43 26.92m13.442 23.262c-2.056-7.995-4.875-25.238.294-30.24 1.585-1.664 5.693-4.058 9.442-.318 2.916 3.414 5.133 14.236-9.339 30.21M34.4 54.333c5.144-5.319 19.036-.582 25.34 2.452-12.033 5.58-20.708 5.086-23.542 4.141-3.487-2.092-2.652-5.267-1.798-6.593zm10.68-25.721c-2.964 7.673 8.61 21.833 14.768 27.955 1.145-6.376 2.017-20.762-3.65-27.301-5.668-6.54-9.773-3.16-11.117-.654zM10.968 38.965c5.406-4.708 19.581-1.852 25.993.164-5.013 6.321-16.802 7.175-22.07 6.812-6.756-.916-5.43-5.032-3.923-6.976z'
    ></path>
    <path
      stroke='#9A827A'
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M97.666 117.708c-5.957-17.874-26.418-58.59-60.596-78.47m0 0c-7.338-3.85-21.84-13.47-21.143-21.143.654-1.526 2.92-3.793 6.757-.654 5.014 3.996 14.91 13.95 14.386 21.797z'
    ></path>
  </svg>
)