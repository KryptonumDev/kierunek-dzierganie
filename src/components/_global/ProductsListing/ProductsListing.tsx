import ProductCard from '@/components/ui/ProductCard';
import styles from './ProductsListing.module.scss';
import type { ProductsListingTypes } from './ProductsListing.types';
import Filters from './_Filters';
// import Pagination from '@/components/ui/Pagination';

const ProductsListing = ({ title, text, products, categories, basis }: ProductsListingTypes) => {
  return (
    <section
      id='produkty'
      className={styles['ProductsListing']}
    >
      {title}
      {text}
      <Filters
        basis={basis}
        categories={categories}
      />
      <div className={styles['grid']}>
        {products.map((product) => (
          <ProductCard
            key={product._id}
            data={product}
          />
        ))}
      </div>
      {products.length === 0 && <h2>Niestety teraz w tym rozdziale nic niema :( </h2>}
      {/* <Pagination
        selectedNumber={1}
        numberOfElements={100}
        elementsDivider={10}
        pathPrefix={'/kursy-dziergania-na-drutach'}
        urlID='#produkty'
        isCategoryPagination={false}
      /> */}
    </section>
  );
};

export default ProductsListing;
