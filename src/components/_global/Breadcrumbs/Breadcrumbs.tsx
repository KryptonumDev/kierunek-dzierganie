import { Fragment } from 'react';
import Link from 'next/link';
import styles from './Breadcrumbs.module.scss';
import BreadcrumbsSchema from '@/global/Schema/BreadcrumbsSchema';
import type { Props } from './Breadcrumbs.types';

const Breadcrumbs = ({ data = [], visible = true }: Props) => {
  data = [
    {
      name: 'Strona główna',
      path: '/',
    },
    ...data,
  ];

  return (
    <>
      <BreadcrumbsSchema data={data} />
      {visible && data.length >= 2 && (
        <nav className={styles['Breadcrumbs']}>
          {data.map(({ name, path }, i) => {
            const Item = i !== data.length - 1 ? Link : 'span';
            return (
              <Fragment key={i}>
                <Item href={i !== data.length - 1 ? path : ''}>
                  {i === data.length - 2 && <Chevron />}
                  <span>{name}</span>
                </Item>
                {i !== data.length - 1 && <Chevron />}
              </Fragment>
            );
          })}
        </nav>
      )}
    </>
  );
};

export default Breadcrumbs;

const Chevron = () => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='24'
    height='25'
    fill='none'
    viewBox='0 0 24 25'
  >
    <path
      stroke='#9A827A'
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M8.625 5.483l6.75 6.75-6.75 6.75'
    ></path>
  </svg>
);