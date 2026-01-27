
import React, { useState } from 'react';
import Skeleton from './Skeleton';

interface ImageWithSkeletonProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  containerClassName?: string;
  skeletonClassName?: string;
}

const ImageWithSkeleton: React.FC<ImageWithSkeletonProps> = ({ 
  containerClassName = '', 
  skeletonClassName = '', 
  className = '', 
  alt, 
  ...props 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={`relative overflow-hidden ${containerClassName}`}>
      {!isLoaded && (
        <Skeleton className={`absolute inset-0 z-10 rounded-none ${skeletonClassName}`} />
      )}
      <img
        {...props}
        alt={alt}
        className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}
        onLoad={() => setIsLoaded(true)}
      />
    </div>
  );
};

export default ImageWithSkeleton;
