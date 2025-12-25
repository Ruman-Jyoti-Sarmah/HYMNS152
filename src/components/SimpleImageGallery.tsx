import React, { useState } from 'react';

interface SimpleImageGalleryProps {
  images: string[];
  alt: string;
  className?: string;
}

const SimpleImageGallery: React.FC<SimpleImageGalleryProps> = ({
  images,
  alt,
  className = ''
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const currentImage = images[currentImageIndex];

  const handleThumbnailClick = (index: number) => {
    setCurrentImageIndex(index);
  };

  if (!images || images.length === 0) {
    return (
      <div className={`bg-gray-100 rounded-lg flex items-center justify-center ${className}`}>
        <div className="text-gray-400 text-center p-8">
          <div className="w-16 h-16 mx-auto mb-2">📷</div>
          <p>No images available</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Main Image */}
      <div className="relative bg-white rounded-lg overflow-hidden border border-gray-200">
        <img
          src={currentImage}
          alt={`${alt} - View ${currentImageIndex + 1}`}
          className="w-full h-auto max-h-96 object-contain"
          loading="lazy"
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => handleThumbnailClick(index)}
              className={`flex-shrink-0 w-16 h-16 border-2 rounded-lg overflow-hidden transition-all ${
                currentImageIndex === index
                  ? 'border-blue-500 shadow-md'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              aria-label={`View image ${index + 1} of ${images.length}`}
            >
              <img
                src={image}
                alt={`${alt} thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}

      {/* Image Counter */}
      {images.length > 1 && (
        <div className="text-center text-sm text-gray-500">
          {currentImageIndex + 1} of {images.length} images
        </div>
      )}
    </div>
  );
};

export default SimpleImageGallery;
