import { Suspense,Show } from "solid-js";
import { 
  Title,
  createRouteData,
  RouteDataArgs,
  useRouteData,
  Meta,
  Link,
} from "solid-start";
import CollectionLoader from "~/components/loaders/CollectionLoader";
import GetStoreInfo from "~/lib/getStoreInfo";
import { useBrowserLocation } from 'solidjs-use'

export function routeData({ params } : RouteDataArgs) {
  const location = useBrowserLocation()
  const hrefArray = location().href?.replace(`${location().protocol}//`,'').split('.');
  const subDomain = hrefArray ? hrefArray[0] : 'www';
  // const slug = process.env.SOLID_APP_STORE_SLUG ? process.env.SOLID_APP_STORE_SLUG : subDomain;
  // console.log(slug)
  return createRouteData(
    async key => GetStoreInfo(key[0]),
    { key: () => ['browniebits'] }
  );
}

export default function Home() {
  const storeInfo = useRouteData<typeof routeData>();
  return (
    <>
      <span style="display:none">{storeInfo()?.name}</span>
      <Suspense fallback={<CollectionLoader/>}>
        <main>
          <Title>{storeInfo()?.name}</Title>
          <Meta property="og:title" content={storeInfo()?.name} />
          {/* <Meta
            property="og:image"
            content={storeInfo()?.banner}
          />
          <Link
            rel="icon"
            href={storeInfo()?.logo}
          /> */}
          
          <h1>Hello Home Site!</h1>
        </main>
      </Suspense>
    </>
  );
}
