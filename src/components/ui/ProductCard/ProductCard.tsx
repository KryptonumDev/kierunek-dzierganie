import { useEffect, useMemo, useState } from 'react';
import styles from './ProductCard.module.scss';
import type { Props } from './ProductCard.types';
import { ImgType } from '@/global/types';
import Img from '../image';
import { formatPrice } from '@/utils/price-formatter';
import Button from '../Button';
import { useCart } from 'react-use-cart';
import { pageUrls } from '@/global/constants';

const ProductCard = ({ data: { variants }, data, inCart = false }: Props) => {
  const { addItem } = useCart();
  const [buttonText, setButtonText] = useState(inCart ? 'Już w koszyku' : 'Dodaj do koszyka');
  const mainVariant = useMemo(() => {
    const productData: {
      price: string;
      discount?: number;
      stock?: number;
      image?: ImgType;
      type?: 'normal' | 'variable';
      name?: string;
    } = {
      price: '',
      discount: undefined,
      stock: undefined,
      image: undefined,
      type: 'normal',
      name: data.name,
    };

    if (variants?.length > 0) {
      const minPrice = Math.min(...variants.map((variant) => variant.price));
      const maxPrice = Math.max(...variants.map((variant) => variant.price));

      productData['price'] = formatPrice(minPrice) + ' - ' + formatPrice(maxPrice);
      productData['stock'] = variants[0]!.countInStock;
      productData['image'] = variants[0]!.gallery;
      productData['type'] = 'variable';
    } else {
      productData['price'] = formatPrice(data!.price!);
      productData['discount'] = data!.discount;
      productData['stock'] = data!.countInStock;
      productData['image'] = data!.gallery;
    }

    return productData;
  }, [variants, data]);

  useEffect(() => {
    if (buttonText !== 'Dodano do koszyka') setButtonText(inCart ? 'Już w koszyku' : 'Dodaj do koszyka');
  }, [inCart, buttonText]);

  return (
    <div className={styles['productCard']}>
      <div>
        {mainVariant.image && (
          <Img
            data={mainVariant.image}
            sizes='380px'
          />
        )}
        <span>rating</span>
        <h3 className={styles['names']}>{mainVariant.name}</h3>
        <p
          className={styles['price']}
          dangerouslySetInnerHTML={{ __html: mainVariant.price }}
        />
      </div>
      {mainVariant.type === 'variable' ? (
        <Button href={`${pageUrls[data.basis]}/produkt/${data.slug}`}>Wybierz wariant</Button>
      ) : (
        <Button
          disabled={buttonText !== 'Dodaj do koszyka'}
          onClick={() => {
            addItem({ quantity: 1, id: data._id, price: 0 });
            setButtonText('Dodano do koszyka');
          }}
        >
          {buttonText}
        </Button>
      )}
    </div>
  );
};

export default ProductCard;