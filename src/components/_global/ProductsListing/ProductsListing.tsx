import ProductCard from '@/components/ui/ProductCard';
import styles from './ProductsListing.module.scss';
import type { ProductsListingTypes } from './ProductsListing.types';
import Filters from './_Filters';
import Pagination from './_Pagination';
import FeaturedProductCard from '@/components/ui/FeaturedProductCard';
import Markdown from '@/components/ui/markdown';

const ProductsListing = ({
  title,
  text,
  products,
  categories,
  basis,
  courses,
  productsTotalCount,
  authors,
}: ProductsListingTypes) => {
  return (
    <section
      id='listing'
      className={styles['ProductsListing']}
    >
      {title}
      {text}
      <Filters
        courses={courses}
        basis={basis}
        categories={categories}
        authors={authors}
      />
      <div className={styles['products']}>
        <FeaturedProductCard
          excerpt={products[0]!.excerpt ? <Markdown>{products[0]!.excerpt}</Markdown> : undefined}
          data={products[0]!}
        />
        <div className={styles['grid']}>
          {products.slice(1).map((product) => (
            <ProductCard
              key={product._id}
              data={product}
            />
          ))}
        </div>
      </div>
      {/* TODO: Change no items text */}
      {products.length === 0 && <h2>Niestety teraz w tym rozdziale nic nie ma :( </h2>}
      {productsTotalCount > 10 && (
        <Pagination
          basis={basis}
          allElementsCount={productsTotalCount}
          elementsPerPage={10}
        />
      )}
    </section>
  );
};

export default ProductsListing;
