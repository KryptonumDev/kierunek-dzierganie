import Img from '@/utils/Img';
import Markdown from '@/utils/Markdown';
import styles from './styles.module.scss';

const AboutMe = ({
  data: {
    aboutMe_Heading,
    aboutMe_Paragraph,
    aboutMe_Img,
  }
}) => {
  return (
    <section className={`sec-wo-margin ${styles.wrapper}`}>
      <header>
        <Markdown.h2>{aboutMe_Heading}</Markdown.h2>
        <Markdown className={styles.paragraph}>{aboutMe_Paragraph}</Markdown>
      </header>
      <Img data={aboutMe_Img} className={styles.img} />
      <Decoration aria-hidden="true" className={styles.decoration} />
    </section>
  );
};

export default AboutMe;

const Decoration = ({ ...props }) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='107'
    height='129'
    viewBox='0 0 107 129'
    fill='none'
    {...props}
  >
    <path
      stroke='#9A827A'
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M69.26 89.293c-2.72-3.31-7.126-10.618-3-13.356 4.126-2.738 3.719 7.763 3 13.356zm18.697 12.602c-4.127-1.149-12.591-2.229-13.43 2.652-.838 4.88 8.604.266 13.43-2.652zM24.52 16.154c19.274-2.92 40.751 16.628 19.067 42.28M23.436 15.993l-.284-.224m-2.806-2.222l2.806 2.222m0 0l-1.042-3.393m1.042 3.393l.765-3.321m-.437 4.201c4.105 9.721 13.767 31.643 19.565 41.559M23.683 16.22c-6.507 8.066-11.713 27.832 19.52 42.372M23.593 16.084C34.035 20.526 52.648 35.12 43.565 57.96'
    ></path>
    <path
      stroke='#9A827A'
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M11.59 42.036c-3.964-14.338 6.832-23.14 12.726-25.747 16.498-8.37 27.193 1.6 30.479 7.63 8.977 19.3-3.943 31.127-11.525 34.627-19.692 6.501-29.325-8.298-31.68-16.51zm31.703 16.691c6.748 13.507 28.032 41.766 59.176 46.746'
    ></path>
  </svg>
)