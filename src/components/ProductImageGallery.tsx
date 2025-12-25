import React, { useState } from 'react';

interface ProductImageGalleryProps {
  images: string[];
  title: string;
}

export const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({ images, title }) => {
  const [selectedImage, setSelectedImage] = useState(images[0] || '');

  const handleThumbnailClick = (image: string) => {
    setSelectedImage(image);
  };

  if (!images || images.length === 0) {
    return (
      <div className="w-full">
        <div className="aspect-square bg-gray-100 flex items-center justify-center">
          <span className="text-gray-500">No image available</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Main Image */}
      <div className="aspect-square mb-4 overflow-hidden rounded-lg border border-gray-200">
        <img
          src={selectedImage}
          alt={title}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/images/hymns-logo.jpg';
          }}
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => handleThumbnailClick(image)}
              className={`flex-shrink-0 w-16 h-16 border-2 rounded overflow-hidden ${
                selectedImage === image
                  ? 'border-blue-500'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <img
                src={image}
                alt={`${title} ${index + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/hymns-logo.jpg';
                }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
