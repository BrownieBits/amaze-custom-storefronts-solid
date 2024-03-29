import {
  createResource,
  createContext,
  useContext,
  JSX,
  createSignal,
  onMount,
} from 'solid-js';
import { createMutable } from 'solid-js/store';
import { useBrowserLocation } from 'solidjs-use';
import {
  ThemeInfo,
  StoreInfo,
  Collections,
  ProductCollection,
  ContextInterface,
  Cart,
  AddCartItem
} from './typeDefs';
import { isServer } from 'solid-js/web';


// console.log('SOLID_APP',import.meta.env.SOLID_APP_STORE_SLUG) // undefined (in terminal)
// console.log('SERVER',import.meta.env.SERVER_STORE_SLUG) // undefined (in terminal)
console.log('VITE',import.meta.env.VITE_STORE_SLUG) // undefined (in terminal)
export const slug = import.meta.env.VITE_STORE_SLUG ? import.meta.env.VITE_STORE_SLUG : 'browniebits';

const location = useBrowserLocation();
const hrefArray = location()
  .href?.replace(`${location().protocol}//`, '')
  .split('.');
const subDomain = hrefArray ? hrefArray[0] : 'www';

let cartStorage = { items: {}, region: 'USA' } as Cart;
if (!isServer) {
  cartStorage =
    JSON.parse(localStorage.getItem(`${slug}-cart`)!) ||
    ({ items: {}, region: 'USA' } as Cart);
}
const getInitialCartTotal = (cartFromStorage: Cart) => {
  return Object.keys(cartFromStorage.items).reduce(
    (total: number, sku: string) => total + cartFromStorage.items[sku].quantity,
    0
  );
};

const fetchTheme = async (slug: string) =>
  (
    await fetch(
      `https://kxqd7cf966.execute-api.us-west-1.amazonaws.com/dev/themes?siteKey=${slug}`
    )
  ).json();
const fetchStoreInfo = async (slug: string) =>
  (await fetch(`https://commerce.teespring.com/v1/stores?slug=${slug}`)).json();
const fetchCollections = async (slug: string) =>
  (
    await fetch(
      `https://commerce.teespring.com/v1/stores/collections?slug=${slug}`
    )
  ).json();
const fetchProducts = async (numProducts: string) =>
  (
    await fetch(
      `https://commerce.teespring.com/v1/stores/products?slug=${slug}&currency=USD&region=USA&per=${numProducts}`
    )
  ).json();

const StoreContext = createContext<ContextInterface>();

export function StoreProvider(props: { children: JSX.Element }) {
  const [theme] = createResource<ThemeInfo, string>(
    () => slug,
    fetchTheme,
    {
      initialValue: {},
    }
  );
  const [storeInfo] = createResource<StoreInfo, string>(
    () => slug,
    fetchStoreInfo,
    {
      initialValue: {},
    }
  );
  const [collections] = createResource<Collections, string>(
    () => slug,
    fetchCollections,
    {
      initialValue: { storeId: 0, storeSlug: slug, collections: [] },
    }
  );
  const [products] = createResource<ProductCollection, string>(
    () => '1000',
    fetchProducts,
    {
      initialValue: {},
    }
  );

  const [cartCount, setCartCount] = createSignal(0);
  const [searchOpen, setSearchOpen] = createSignal(false);
  const [mobileMenuOpen, setMobileMenuOpen] = createSignal(false);

  const myCart = createMutable({
    cart: { items: {}, region: 'USA' } as Cart,
    addProduct(addCartItem: AddCartItem) {
      if (this.cart.items[addCartItem.slug] !== undefined) {
        this.cart.items[addCartItem.slug].quantity += addCartItem.quantity;
      } else {
        this.cart.items[addCartItem.slug] = {
          colorID: addCartItem.colorID,
          sizeID: addCartItem.sizeID,
          productID: addCartItem.productID,
          quantity: addCartItem.quantity,
          itemGroupID: addCartItem.itemGroupID,
          slug: addCartItem.slug,
        };
      }
      if (!isServer) {
        localStorage.setItem(`${slug}-cart`, JSON.stringify(this.cart));
      }
      setCartCount((prev) => prev + addCartItem.quantity);
    },
    updateCart(newCart: Cart) {
      this.cart = newCart;
    },
    removeItem(sku: string) {
      setCartCount(prev => prev - this.cart.items[sku].quantity);
      delete this.cart.items[sku];
      if (!isServer) {
        localStorage.setItem(`${slug}-cart`, JSON.stringify(this.cart));
      }
    },
    updateItemQuantity(slug: string, newQuantity: number) {
      if (this.cart.items[slug] != undefined && newQuantity !== 0) {
        const difference = newQuantity - this.cart.items[slug].quantity;
        setCartCount(prev => prev + difference);
        this.cart.items[slug].quantity = newQuantity;
        if (!isServer) {
          localStorage.setItem(`${slug}-cart`, JSON.stringify(this.cart));
        }
      }
    },
    clear() {
      this.cart = { items: {}, region: 'USA' };
      if (!isServer) {
        localStorage.setItem(`${slug}-cart`, JSON.stringify(this.cart));
      }
      setCartCount(0);
    },
  });
  onMount(() => {
    setCartCount(getInitialCartTotal(cartStorage));
    if(cartStorage) {
      myCart.updateCart(cartStorage)
    }
  });
  const value: ContextInterface = {
    slug: slug,
    theme: theme,
    storeInfo: storeInfo,
    collections: collections,
    cart: myCart,
    products: products,
    searchOpen: searchOpen,
    setSearchOpen: setSearchOpen,
    cartCount: cartCount,
    setCartCount: setCartCount,
    mobileMenuOpen: mobileMenuOpen,
    setMobileMenuOpen: setMobileMenuOpen
  };
  return (
    <StoreContext.Provider value={value}>
      {props.children}
    </StoreContext.Provider>
  );
}

export function useStoreInfo(): ContextInterface | undefined {
  return useContext(StoreContext);
}
