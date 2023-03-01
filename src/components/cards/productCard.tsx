import { useStoreInfo } from '~/lib/store';
import { A } from '@solidjs/router';
import { Product } from '~/lib/typeDefs';
import styles from './productCard.module.scss';

export default function ProductCard(props: {product: Product}) {
  const { cart } = useStoreInfo()!;
  console.log(props.product)
  const productID = props.product.url?.match(/pid=(\d+)/)?.at(1)
  const productSlug = props.product.url?.split('?')?.at(0)?.split('/').at(1);

  console.log('productID',productID)
  console.log('productSlug',productSlug)
  return (
    <div class={styles.productCard}>
      <A href={`/listing/${productSlug}?product=${productID}`}>
        <img class={styles.productImage} src={props.product.imageUrl} alt={props.product.name} loading="lazy" />
        <div class={styles.productDetails}>
          <div class={styles.info}>
          <p class={styles.name}>{props.product.name}</p>
          <p class={styles.type}>{props.product.productName}</p>
          </div>
          <div class={styles.price}>
          <p>{props.product.price}</p>
          </div>
        </div>
      </A>
      <button
          onClick={() => {
            cart.addProduct(props.product);
          }}
          class={styles.quickAddButton}
        >
          <i class={`fa-solid fa-cart-plus`} />
        </button>
    </div>
  );
}
