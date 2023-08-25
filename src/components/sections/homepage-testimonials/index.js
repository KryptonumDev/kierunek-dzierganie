import Button from '@/components/atoms/Button';
import Heading from '@/utils/Heading';
import Markdown from '@/utils/Markdown';
import styles from './styles.module.scss';

const Testimonials = ({
  data: {
    testimonials_Title,
    testimonials_List,
    testimonials_Paragraph,
    testimonials_Cta,
    testimonials_CtaAnnotation,
  }
}) => {
  return (
    <section className={styles.wrapper}>
      <Heading level='h2' className={styles.title}>{testimonials_Title}</Heading>
      <ul className={styles.testimonials}>
        {testimonials_List.map((testimonial, i) => (
          <li key={i}>
            <Quote aria-hidden="true" className={styles.quote} />
            <Markdown className={styles.content}>{testimonial.content}</Markdown>
            <Markdown className={styles.author}>{testimonial.author}</Markdown>
          </li>
        ))}
      </ul>
      <div className={styles.copy}>
        <Markdown className={styles.paragraph}>{testimonials_Paragraph}</Markdown>
        <Button data={testimonials_Cta} />
        <Markdown className={styles.ctaAnnotation}>{testimonials_CtaAnnotation}</Markdown>
      </div>
    </section>
  );
};

export default Testimonials;

const Quote = ({ ...props }) => (
  <svg xmlns='http://www.w3.org/2000/svg' width='33' height='35' viewBox='0 0 33 35' fill='none' {...props}> 
    <path
      fill='#EFE8E7'
      d='M12.948 1.808c2.082 1.534 2.818 3.915 2.612 6.748-5.496 2.752-10.486 3.366-9.378-2.73C7.16.455 11.455.455 12.948 1.809z'
    ></path>
    <path
      stroke='#EFE8E7'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth='2'
      d='M1.375 33.497c8.682-8.953 19.23-26.046 11.573-31.69C11.455.455 7.16.455 6.182 5.828c-1.22 6.715 4.96 5.287 11.065 1.827'
    ></path>
    <path
      fill='#EFE8E7'
      d='M28.312 1.808c1.993 1.47 2.787 3.59 2.718 6.083-3.139 3.42-10.566 3.886-9.484-2.064.977-5.373 5.272-5.373 6.766-4.02z'
    ></path>
    <path
      stroke='#EFE8E7'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth='2'
      d='M17.247 31.666C25.93 22.712 35.968 7.45 28.312 1.808 26.818.454 22.522.454 21.546 5.827c-1.221 6.715 8.394 5.258 10.454.606'
    ></path>
  </svg>
)