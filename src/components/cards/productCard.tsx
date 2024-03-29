import { useStoreInfo } from '~/lib/store';
import { A } from '@solidjs/router';
import { FullProduct, Product } from '~/lib/typeDefs';
import styles from './productCard.module.scss';
import { Setter, Show } from 'solid-js';

export default function ProductCard(props: { product?: Product }) {
  const { cart } = useStoreInfo()!;
  const productID = props.product?.url?.match(/pid=(\d+)/)?.at(1);
  const productSlug = props.product?.url?.split('?')?.at(0)?.split('/').at(1);
  return (
    <>
      <Show when={props.product}>
        <div class={styles.productCard}>
          <A href={`/listing/${productSlug}?product=${productID}`}>
            <div class={styles.productImage}>
              <img
                src={props.product?.imageUrl}
                alt={props.product?.name}
                loading="lazy"
              />
            </div>
            <div class={styles.productDetails}>
              <div class={styles.info}>
                <p class={styles.name}>{props.product?.name}</p>
                <p class={styles.type}>{props.product?.productName}</p>
              </div>
              <div class={styles.price}>
                <p>{props.product?.price}</p>
              </div>
            </div>
          </A>
          {/* <button
              onClick={() => {
                props.setFullProductInfo(
                  `slug=${productSlug}&productId=${productID}`
                );
              }}
              class={styles.quickAddButton}
            >
              <i class={`fa-solid fa-cart-plus`} />
            </button> */}
        </div>
      </Show>
      <Show when={!props.product}>
        <div class={styles.productCard}>
          <div class={styles.noProductImage}></div>

          <div class={styles.productDetails}>
            <div class={styles.info}>
              <p class={styles.name}>Product Name</p>
              <p class={styles.type}>Product Type</p>
            </div>
            <div class={styles.price}>
              <p>$0.00</p>
            </div>
          </div>
        </div>
      </Show>
    </>
  );
}
// cart.addProduct({
//   colorID: '12',
//   sizeID: '34',
//   productID: productID!,
//   quantity: 1,
//   itemGroupID: '78',
//   slug: props.product?.url?.split('?')[0].replace('/', '')!,
//   sku: props.product?.id?.toString()!,
// });
