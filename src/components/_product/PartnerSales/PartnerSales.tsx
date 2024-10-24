import Img from '@/components/ui/image';
import Markdown from '@/components/ui/markdown';
import styles from './PartnerSales.module.scss';
import type { PartnerSalesTypes } from './PartnerSales.types';

const PartnerSales = ({ heading, paragraph, imageList, salesList }: PartnerSalesTypes) => {
  return (
    <div className={styles['PartnerSales']}>
      <ul className={styles.list}>
        {imageList?.map((image, index) => (
          <li key={index}>
            <Img
              data={image}
              sizes=''
            />
          </li>
        ))}
      </ul>
      <header>
        <Markdown.h2>{heading}</Markdown.h2>
        <Markdown className={styles.paragraph}>{paragraph}</Markdown>
        <ul className={styles.brands}>
          {salesList?.map(({ shopName, shopLink, salePercentage }, index) => (
            <li
              className={styles.item}
              key={index}
            >
              <span className={styles.percentage}>{`-${salePercentage}%`}</span>
              {shopLink ? (
                <a
                  href={shopLink}
                  target='_blank'
                  rel='noreferrer'
                >
                  {shopName}
                </a>
              ) : (
                <span>{shopName}</span>
              )}
            </li>
          ))}
        </ul>
      </header>
    </div>
  );
};

export default PartnerSales;
