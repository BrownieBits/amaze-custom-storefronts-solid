export default function LogoImage(props: {url: string, height?: string}) {
    const imageUrl = props.url.replace(
        '{{assetPath}}',
        `//premium-storefronts.s3.amazonaws.com/storefronts/browniebits/assets`
      )
  return <img src={imageUrl} height={props.height ? props.height : '44px'}/>;
}
