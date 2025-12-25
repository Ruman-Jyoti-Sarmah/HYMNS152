import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Plus, Edit, Trash2, Eye, Upload, Image as ImageIcon, X, Save, RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { products, AdminProduct, updateProduct, getProductById } from '@/data/products';

interface ImageManagerProps {
  productId: string;
  onClose: () => void;
}

const ImageManager: React.FC<ImageManagerProps> = ({ productId, onClose }) => {
  const [product, setProduct] = useState<AdminProduct | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadProduct();
  }, [productId]);

  const loadProduct = () => {
    const foundProduct = getProductById(productId);
    if (foundProduct) {
      setProduct({ ...foundProduct });
    }
    setIsLoading(false);
  };

  const handleAddImage = () => {
    if (!imageUrl.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter an image URL',
        variant: 'destructive'
      });
      return;
    }

    if (!product) return;

    const newImages = [...product.images, imageUrl.trim()];
    setProduct({ ...product, images: newImages });
    setImageUrl('');
    setHasChanges(true);

    toast({
      title: 'Image added',
      description: 'Image has been added to the product'
    });
  };

  const handleRemoveImage = (index: number) => {
    if (!product) return;

    const newImages = product.images.filter((_, i) => i !== index);
    setProduct({ ...product, images: newImages });
    setHasChanges(true);

    toast({
      title: 'Image removed',
      description: 'Image has been removed from the product'
    });
  };

  const handleMoveImage = (fromIndex: number, toIndex: number) => {
    if (!product) return;

    const newImages = [...product.images];
    const [movedImage] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, movedImage);

    setProduct({ ...product, images: newImages });
    setHasChanges(true);
  };

  const handleSaveChanges = () => {
    if (!product) return;

    updateProduct(productId, { images: product.images });
    setHasChanges(false);

    toast({
      title: 'Changes saved',
      description: 'Product images have been updated successfully'
    });
  };

  const handleResetChanges = () => {
    loadProduct();
    setHasChanges(false);

    toast({
      title: 'Changes reset',
      description: 'All unsaved changes have been discarded'
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center p-8">
        <p className="text-red-600">Product not found</p>
        <Button onClick={onClose} className="mt-4">Close</Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Manage Images</h2>
          <p className="text-muted-foreground">{product.name}</p>
        </div>
        <div className="flex gap-2">
          {hasChanges && (
            <>
              <Button variant="outline" onClick={handleResetChanges}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
              <Button onClick={handleSaveChanges}>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </>
          )}
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>

      {/* Add New Image */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Add New Image
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Enter image URL (e.g., /images/product-image.jpg)"
              className="flex-1"
            />
            <Button onClick={handleAddImage} disabled={!imageUrl.trim()}>
              <Plus className="w-4 h-4 mr-2" />
              Add Image
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Supported formats: JPG, PNG, WebP. Images should be placed in the public/images/ folder.
          </p>
        </CardContent>
      </Card>

      {/* Current Images */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <ImageIcon className="w-5 h-5" />
              Current Images ({product.images.length})
            </span>
            {product.images.length === 0 && (
              <Badge variant="secondary">No images</Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {product.images.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <ImageIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No images added yet</p>
              <p className="text-sm">Add your first image above</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {product.images.map((image, index) => (
                <div key={index} className="relative group border rounded-lg overflow-hidden">
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full aspect-square object-cover"
                    onError={(e) => {
                      e.currentTarget.src = '/images/hymns-logo.jpg';
                    }}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center">
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {/* Move Left */}
                      {index > 0 && (
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleMoveImage(index, index - 1)}
                          className="h-8 w-8 p-0"
                        >
                          ←
                        </Button>
                      )}

                      {/* Move Right */}
                      {index < product.images.length - 1 && (
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleMoveImage(index, index + 1)}
                          className="h-8 w-8 p-0"
                        >
                          →
                        </Button>
                      )}

                      {/* Delete */}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="destructive"
                            className="h-8 w-8 p-0"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Remove Image</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to remove this image from the product?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleRemoveImage(index)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Remove
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>

                  {/* Image Number Badge */}
                  <div className="absolute top-2 left-2">
                    <Badge variant="secondary" className="text-xs">
                      {index + 1}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Preview */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground mb-4">
            This is how the images will appear on the product page:
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {product.images.slice(0, 4).map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`${product.name} ${index + 1}`}
                className="w-20 h-20 object-cover rounded border flex-shrink-0"
                onError={(e) => {
                  e.currentTarget.src = '/images/hymns-logo.jpg';
                }}
              />
            ))}
            {product.images.length > 4 && (
              <div className="w-20 h-20 bg-gray-100 rounded border flex items-center justify-center text-sm text-gray-500 flex-shrink-0">
                +{product.images.length - 4}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ImageManager;