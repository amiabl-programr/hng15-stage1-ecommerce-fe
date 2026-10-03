import React, { useState } from 'react';
import type { MediaAsset, ProfileKind } from '~/types/api';
import { ProfileDiagram } from './ProfileDiagram';
import { cn } from '~/lib/cn';

export interface ProductMediaProps {
  media?: MediaAsset[];
  profileKind?: ProfileKind;
  productName?: string;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
}

export const ProductMedia: React.FC<ProductMediaProps> = ({
  media,
  profileKind = 'longspan',
  productName = 'Roofing Product',
  className,
  imageClassName,
  priority = false,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Find primary image or first main/available image
  const primaryMedia =
    media?.find((m) => m.isPrimary) ||
    media?.find((m) => m.role === 'main') ||
    media?.[0];

  if (!primaryMedia || imageError) {
    return (
      <div
        className={cn(
          'relative w-full aspect-[4/3] bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden flex items-center justify-center p-4',
          className
        )}
      >
        <ProfileDiagram kind={profileKind} className="w-full h-full max-h-48 object-contain" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        'relative w-full aspect-[4/3] bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden',
        className
      )}
    >
      {!imageLoaded && (
        <div className="absolute inset-0 bg-slate-200 dark:bg-slate-700 animate-pulse" />
      )}
      <img
        src={primaryMedia.url}
        alt={primaryMedia.alt || productName}
        loading={priority ? 'eager' : 'lazy'}
        onLoad={() => setImageLoaded(true)}
        onError={() => setImageError(true)}
        className={cn(
          'w-full h-full object-cover transition-opacity duration-300',
          imageLoaded ? 'opacity-100' : 'opacity-0',
          imageClassName
        )}
      />
    </div>
  );
};
