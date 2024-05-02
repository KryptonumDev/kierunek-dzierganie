import styles from './ProductsListing.module.scss';
import type { ProductsListingTypes } from './ProductsListing.types';
import Filters from './_Filters';
import Pagination from './_Pagination';
import Markdown from '@/components/ui/markdown';
import Listing from './_Listing';

const ProductsListing = ({
  title,
  text,
  products,
  categories,
  basis,
  courses,
  productsTotalCount,
  authors,
  ownedCourses,
}: ProductsListingTypes) => {
  const featuredProductExcerpt = products?.[0]?.excerpt ? <Markdown>{products[0]!.excerpt}</Markdown> : undefined;

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
      <Listing
        basis={basis}
        featuredProductExcerpt={featuredProductExcerpt}
        products={products}
        ownedCourses={ownedCourses}
      />
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
