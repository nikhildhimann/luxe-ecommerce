import React, { useRef } from 'react';
import { useInView } from 'react-intersection-observer';

export const LazyImage = ({ src, alt, className = '', fallback = null, onLoadStart, onLoadEnd }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
    rootMargin: '50px'
  });

  const [isLoaded, setIsLoaded] = React.useState(false);
  const [error, setError] = React.useState(false);

  React.useEffect(() => {
    if (inView && !isLoaded && !error) {
      onLoadStart?.();
    }
  }, [inView, isLoaded, error, onLoadStart]);

  const handleImageLoad = () => {
    setIsLoaded(true);
    onLoadEnd?.();
  };

  const handleImageError = () => {
    setError(true);
    onLoadEnd?.();
  };

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      {!isLoaded && !error && (
        <div className="absolute inset-0 bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 animate-shimmer" />
      )}

      {inView && (
        <img
          src={src}
          alt={alt}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
      )}

      {error && fallback && (
        <div className="w-full h-full flex items-center justify-center bg-slate-600">
          {fallback}
        </div>
      )}
    </div>
  );
};
