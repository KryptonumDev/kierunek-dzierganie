import ProductCard from '@/components/ui/ProductCard';
import styles from './ProductsListing.module.scss';
import type { ProductsListingTypes } from './ProductsListing.types';
// import Pagination from '@/components/ui/Pagination';

const ProductsListing = ({ title, text, products }: ProductsListingTypes) => {


  return (
    <section
      id='produkty'
      className={styles['ProductsListing']}
    >
      {title}
      {text}
      {/* <div className={styles['filters']}>
        <button>
          Filtry i sortowanie <Chevron />
        </button>
      </div> */}
      <div className={styles['grid']}>
        {products.map((product) => (
          <ProductCard
            key={product._id}
            data={product}
          />
        ))}
      </div>
      {products.length === 0 && (
        <h2>Niestety teraz w tym rozdziale nic niema :( </h2>
      )}
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

// const Chevron = () => (
//   <svg
//     width='24'
//     height='25'
//     viewBox='0 0 24 25'
//     fill='none'
//     xmlns='http://www.w3.org/2000/svg'
//   >
//     <path
//       d='M5.25 15.8607L12 9.11072L18.75 15.8607'
//       stroke='#9A827A'
//       strokeLinecap='round'
//       strokeLinejoin='round'
//     />
//   </svg>
// );
