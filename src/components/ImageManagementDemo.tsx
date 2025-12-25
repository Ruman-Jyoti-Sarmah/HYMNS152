import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { products, getProductById } from '@/data/products';
import { imageUtils } from '@/utils/imageUtils';

const ImageManagementDemo: React.FC = () => {
  const [selectedProductId, setSelectedProductId] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const { toast } = useToast();

  const handleAddImage = () => {
    if (!selectedProductId || !newImageUrl.trim()) {
      toast({
        title: 'Error',
        description: 'Please select a product and enter an image URL',
        variant: 'destructive'
      });
      return;
    }

    const success = imageUtils.addImages(selectedProductId, [newImageUrl.trim()]);
    if (success) {
      toast({
        title: 'Success',
        description: 'Image added to product successfully'
      });
      setNewImageUrl('');
    } else {
      toast({
        title: 'Error',
        description: 'Failed to add image',
        variant: 'destructive'
      });
    }
  };

  const handleQuickAddTshirt = () => {
    if (!selectedProductId) {
      toast({
        title: 'Error',
        description: 'Please select a product first',
        variant: 'destructive'
      });
      return;
    }

    const success = imageUtils.quickSetup.addTshirtImages(selectedProductId);
    if (success) {
      toast({
        title: 'Success',
        description: 'T-shirt images added successfully'
      });
    }
  };

  const handleQuickAddStudio = () => {
    if (!selectedProductId) {
      toast({
        title: 'Error',
        description: 'Please select a product first',
        variant: 'destructive'
      });
      return;
    }

    const success = imageUtils.quickSetup.addStudioImages(selectedProductId);
    if (success) {
      toast({
        title: 'Success',
        description: 'Studio images added successfully'
      });
    }
  };

  const selectedProduct = selectedProductId ? getProductById(selectedProductId) : null;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🖼️ Image Management System
            <Badge variant="secondary">Demo</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Product Selection */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Select Product</h3>
              <div>
                <Label htmlFor="product-select">Choose a product to manage images:</Label>
                <select
                  id="product-select"
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="w-full mt-1 p-2 border rounded-md"
                >
                  <option value="">Select a product...</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name} (ID: {product.id})
                    </option>
                  ))}
                </select>
              </div>

              {selectedProduct && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium">{selectedProduct.name}</h4>
                  <p className="text-sm text-gray-600">{selectedProduct.brand}</p>
                  <div className="mt-2">
                    <Badge variant="outline">
                      {selectedProduct.images.length} images
                    </Badge>
                  </div>
                </div>
              )}
            </div>

            {/* Image Operations */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Image Operations</h3>

              {/* Add Single Image */}
              <div className="space-y-2">
                <Label>Add Single Image</Label>
                <div className="flex gap-2">
                  <Input
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    placeholder="Enter image URL..."
                    className="flex-1"
                  />
                  <Button onClick={handleAddImage} disabled={!selectedProductId}>
                    Add
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Quick Actions */}
              <div className="space-y-2">
                <Label>Quick Actions</Label>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleQuickAddTshirt}
                    disabled={!selectedProductId}
                  >
                    Add T-Shirt Images
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleQuickAddStudio}
                    disabled={!selectedProductId}
                  >
                    Add Studio Images
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Current Images Preview */}
          {selectedProduct && selectedProduct.images.length > 0 && (
            <>
              <Separator />
              <div>
                <h3 className="text-lg font-semibold mb-4">Current Images</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {selectedProduct.images.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={image}
                        alt={`${selectedProduct.name} ${index + 1}`}
                        className="w-full aspect-square object-cover rounded border"
                        onError={(e) => {
                          e.currentTarget.src = '/images/hymns-logo.jpg';
                        }}
                      />
                      <Badge className="absolute top-1 left-1 text-xs">
                        {index + 1}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Usage Instructions */}
          <Separator />
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">How to Use</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium mb-2">🖱️ Admin Panel Method:</h4>
                <ol className="list-decimal list-inside space-y-1 text-gray-600">
                  <li>Go to <code className="bg-gray-100 px-1 rounded">/admin</code></li>
                  <li>Login with password: <code className="bg-gray-100 px-1 rounded">admin123</code></li>
                  <li>Click "Images" button on any product</li>
                  <li>Add/remove/reorder images easily</li>
                </ol>
              </div>
              <div>
                <h4 className="font-medium mb-2">💻 Console Method:</h4>
                <ol className="list-decimal list-inside space-y-1 text-gray-600">
                  <li>Open browser Developer Tools (F12)</li>
                  <li>Go to Console tab</li>
                  <li>Use <code className="bg-gray-100 px-1 rounded">imageUtils.addImages()</code></li>
                  <li>Example: <code className="bg-gray-100 px-1 rounded text-xs">imageUtils.addImages("1", ["/images/new.jpg"])</code></li>
                </ol>
              </div>
            </div>
          </div>

          {/* Available Images */}
          <Separator />
          <div>
            <h3 className="text-lg font-semibold mb-4">Available Images in /public/images/</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                'HYMNS T-SHIRT1.png',
                'HYMNS T-SHIRT2.png',
                'hymns-studio.jpeg',
                'hymns-studio1.jpeg',
                'hymns-studio2.jpeg',
                'hymns-studio3.jpeg',
                'hymns-logo.jpg'
              ].map((imageName) => (
                <div key={imageName} className="text-center">
                  <img
                    src={`/images/${imageName}`}
                    alt={imageName}
                    className="w-full aspect-square object-cover rounded border mx-auto mb-2"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  <p className="text-xs text-gray-600 truncate">{imageName}</p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ImageManagementDemo;