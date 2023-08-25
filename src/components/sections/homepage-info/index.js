import Heading from '@/utils/Heading';
import Markdown from '@/utils/Markdown';
import styles from './styles.module.scss';

const Info = ({
  data: {
    info_Heading,
    info_List,
  }
}) => {
  return (
    <section className={`sec-wo-margin ${styles.wrapper}`}>
      <Heading level='h2'>{info_Heading}</Heading>
      <ul className={styles.list}>
        {info_List.map((item, i) => (
          <li key={i}>
            <Markdown className={styles.title}>{item.title}</Markdown>
            <Markdown className={styles.description}>{item.description}</Markdown>
          </li>
        ))}
      </ul>
      <Decoration aria-hidden="true" className={styles.decoration} />
    </section>
  );
};

export default Info;

const Decoration = ({ ...props }) => (
  <svg xmlns='http://www.w3.org/2000/svg' width='142' height='80' viewBox='0 0 142 80' fill='none' {...props}>
    <path
      stroke='#9A827A'
      strokeLinecap='round'
      d='M91.547 26.787c-4.543 6.521-9.698 24.364 6.028 43.567M92.118 26.206C90.336 33.808 89.94 51.9 102.607 63.46'
    ></path>
    <path
      stroke='#9A827A'
      strokeLinecap='round'
      d='M91.957 26.184c1.927 5.685 8.295 19.43 18.343 28.928M91.698 25.656c7.918 3.524 25.341 14.204 31.691 28.736M91.838 25.84C82.56 15.664 52.83-2.295 8.133 7.266M133.959 45.44c-6.355-9.07-23.644-25.687-41.96-19.579'
    ></path>
    <circle
      cx='135.057'
      cy='47.068'
      r='2.771'
      fill='#9A827A'
      transform='rotate(97.602 135.057 47.068)'
    ></circle>
    <circle
      cx='124.682'
      cy='57.032'
      r='2.771'
      fill='#9A827A'
      transform='rotate(97.602 124.682 57.032)'
    ></circle>
    <circle
      cx='112.713'
      cy='56.75'
      r='2.771'
      fill='#9A827A'
      transform='rotate(97.602 112.713 56.75)'
    ></circle>
    <circle
      cx='104.233'
      cy='64.829'
      r='2.771'
      fill='#9A827A'
      transform='rotate(97.602 104.233 64.829)'
    ></circle>
    <circle
      cx='98.717'
      cy='71.658'
      r='2.771'
      fill='#9A827A'
      transform='rotate(97.602 98.717 71.658)'
    ></circle>
  </svg>
)