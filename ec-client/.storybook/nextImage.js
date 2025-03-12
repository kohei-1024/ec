import * as NextImage from 'next/image';

// Replace Next.js Image component with a regular img for Storybook
const OriginalNextImage = NextImage.default;

Object.defineProperty(NextImage, 'default', {
  configurable: true,
  value: (props) => {
    const { src, alt, width, height, layout, objectFit, ...rest } = props;

    // If src is a StaticImageData, use its src property
    const imgSrc = typeof src === 'object' && src.src ? src.src : src;

    // Handle responsive layout
    if (layout === 'fill') {
      return (
        <img 
          style={{ 
            objectFit: objectFit || 'cover',
            position: 'absolute',
            width: '100%',
            height: '100%'
          }} 
          src={imgSrc} 
          alt={alt} 
          {...rest} 
        />
      );
    }
    
    // Handle fixed layout
    return (
      <img 
        style={{ maxWidth: '100%', height: 'auto' }} 
        src={imgSrc} 
        alt={alt} 
        width={width} 
        height={height} 
        {...rest} 
      />
    );
  },
});

export default NextImage;