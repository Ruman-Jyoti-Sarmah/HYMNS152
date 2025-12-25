import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, X, Upload, Image as ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AdminProduct, addProduct, updateProduct } from '@/data/products';

interface AdminAddProductProps {
  product?: AdminProduct | null;
  onSave: () => void;
  onCancel: () => void;
}

const AdminAddProduct: React.FC<AdminAddProductProps> = ({
  product,
  onSave,
  onCancel
}) => {
  const [formData, setFormData] = useState({
    name: '',
    brand: 'HYMNS',
    price: '',
    mrp: '',
    discount: '',
    rating: '4.5',
    reviews: '0',
    description: '',
    inStock: true,
    category: 'Clothing',
    sizes: [] as string[],
    images: [] as string[],
    variants: [] as Array<{
      color: string;
      color_code: string;
      images: string[];
      stock: number;
    }>
  });

  const [imageUrl, setImageUrl] = useState('');
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [newVariant, setNewVariant] = useState({
    color: '',
    color_code: '#000000',
    images: [] as string[],
    stock: 0
  });
  const [variantImageUrl, setVariantImageUrl] = useState('');

  const { toast } = useToast();

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        brand: product.brand,
        price: product.price.toString(),
        mrp: product.mrp.toString(),
        discount: product.discount.toString(),
        rating: product.rating.toString(),
        reviews: product.reviews.toString(),
        description: product.description,
        inStock: product.inStock,
        category: product.category || 'Clothing',
        sizes: product.sizes || [],
        images: product.images || [],
        variants: product.variants || []
      });
      setSelectedSizes(product.sizes || []);
    }
  }, [product]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddImage = () => {
    if (!imageUrl.trim()) return;

    if (formData.images.includes(imageUrl)) {
      toast({
        title: 'Duplicate image',
        description: 'This image URL is already added',
        variant: 'destructive'
      });
      return;
    }

    setFormData(prev => ({
      ...prev,
      images: [...prev.images, imageUrl]
    }));
    setImageUrl('');
  };

  const handleRemoveImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSizeToggle = (size: string) => {
    const newSizes = selectedSizes.includes(size)
      ? selectedSizes.filter(s => s !== size)
      : [...selectedSizes, size];

    setSelectedSizes(newSizes);
    setFormData(prev => ({
      ...prev,
      sizes: newSizes
    }));
  };

  const handleAddVariant = () => {
    if (!newVariant.color.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a color name',
        variant: 'destructive'
      });
      return;
    }

    if (newVariant.images.length === 0) {
      toast({
        title: 'Error',
        description: 'Please add at least one image for this variant',
        variant: 'destructive'
      });
      return;
    }

    setFormData(prev => ({
      ...prev,
      variants: [...prev.variants, { ...newVariant }]
    }));

    setNewVariant({
      color: '',
      color_code: '#000000',
      images: [],
      stock: 0
    });
  };

  const handleRemoveVariant = (index: number) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index)
    }));
  };

  const handleAddVariantImage = () => {
    if (!variantImageUrl.trim()) return;

    setNewVariant(prev => ({
      ...prev,
      images: [...prev.images, variantImageUrl]
    }));
    setVariantImageUrl('');
  };

  const handleRemoveVariantImage = (variantIndex: number, imageIndex: number) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.map((variant, vIndex) =>
        vIndex === variantIndex
          ? { ...variant, images: variant.images.filter((_, iIndex) => iIndex !== imageIndex) }
          : variant
      )
    }));
  };

  const handleSave = () => {
    // Validation
    if (!formData.name.trim()) {
      toast({
        title: 'Error',
        description: 'Product name is required',
        variant: 'destructive'
      });
      return;
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      toast({
        title: 'Error',
        description: 'Valid price is required',
        variant: 'destructive'
      });
      return;
    }

    if (formData.images.length === 0) {
      toast({
        title: 'Error',
        description: 'At least one product image is required',
        variant: 'destructive'
      });
      return;
    }

    // Calculate discount if MRP is provided
    const price = parseFloat(formData.price);
    const mrp = formData.mrp ? parseFloat(formData.mrp) : price;
    const discount = mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;

    const productData = {
      name: formData.name.trim(),
      brand: formData.brand.trim(),
      price,
      mrp,
      discount,
      rating: parseFloat(formData.rating) || 4.5,
      reviews: parseInt(formData.reviews) || 0,
      description: formData.description.trim(),
      inStock: formData.inStock,
      category: formData.category,
      sizes: formData.sizes,
      images: formData.images,
      variants: formData.variants
    };

    try {
      if (product) {
        // Update existing product
        updateProduct(product.id, productData);
      } else {
        // Add new product
        addProduct(productData);
      }

      onSave();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save product',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="space-y-6 max-h-[70vh] overflow-y-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Basic Information</h3>

          <div>
            <Label htmlFor="name">Product Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter product name"
            />
          </div>

          <div>
            <Label htmlFor="brand">Brand</Label>
            <Input
              id="brand"
              value={formData.brand}
              onChange={(e) => handleInputChange('brand', e.target.value)}
              placeholder="Enter brand name"
            />
          </div>

          <div>
            <Label htmlFor="category">Category</Label>
            <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Clothing">Clothing</SelectItem>
                <SelectItem value="Accessories">Accessories</SelectItem>
                <SelectItem value="Music">Music</SelectItem>
                <SelectItem value="Merchandise">Merchandise</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Enter product description"
              rows={3}
            />
          </div>
        </div>

        {/* Pricing & Stock */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Pricing & Stock</h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">Price (₹) *</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => handleInputChange('price', e.target.value)}
                placeholder="0"
                min="0"
              />
            </div>

            <div>
              <Label htmlFor="mrp">MRP (₹)</Label>
              <Input
                id="mrp"
                type="number"
                value={formData.mrp}
                onChange={(e) => handleInputChange('mrp', e.target.value)}
                placeholder="0"
                min="0"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="rating">Rating</Label>
              <Input
                id="rating"
                type="number"
                value={formData.rating}
                onChange={(e) => handleInputChange('rating', e.target.value)}
                placeholder="4.5"
                min="0"
                max="5"
                step="0.1"
              />
            </div>

            <div>
              <Label htmlFor="reviews">Reviews Count</Label>
              <Input
                id="reviews"
                type="number"
                value={formData.reviews}
                onChange={(e) => handleInputChange('reviews', e.target.value)}
                placeholder="0"
                min="0"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="inStock"
              checked={formData.inStock}
              onCheckedChange={(checked: boolean) => handleInputChange('inStock', checked)}
            />
            <Label htmlFor="inStock">In Stock</Label>
          </div>
        </div>
      </div>

      {/* Sizes */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Sizes</h3>
        <div className="flex flex-wrap gap-2">
          {['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'].map((size) => (
            <button
              key={size}
              type="button"
              onClick={() => handleSizeToggle(size)}
              className={`px-3 py-1 border rounded ${
                selectedSizes.includes(size)
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Product Images */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Product Images *</h3>

        <div className="flex gap-2">
          <Input
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="Enter image URL"
            className="flex-1"
          />
          <Button onClick={handleAddImage} disabled={!imageUrl.trim()}>
            <Plus className="w-4 h-4 mr-2" />
            Add
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {formData.images.map((image, index) => (
            <Card key={index} className="relative group">
              <CardContent className="p-2">
                <img
                  src={image}
                  alt={`Product ${index + 1}`}
                  className="w-full aspect-square object-cover rounded"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Color Variants */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Color Variants</h3>

        {/* Existing Variants */}
        {formData.variants.map((variant, vIndex) => (
          <Card key={vIndex} className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-6 h-6 rounded border"
                  style={{ backgroundColor: variant.color_code }}
                />
                <span className="font-medium capitalize">{variant.color}</span>
                <Badge variant="outline">Stock: {variant.stock}</Badge>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleRemoveVariant(vIndex)}
                className="text-red-600"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {variant.images.map((image, iIndex) => (
                <div key={iIndex} className="relative group">
                  <img
                    src={image}
                    alt={`${variant.color} ${iIndex + 1}`}
                    className="w-full aspect-square object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveVariantImage(vIndex, iIndex)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </Card>
        ))}

        {/* Add New Variant */}
        <Card className="p-4 border-dashed">
          <h4 className="font-medium mb-4">Add New Color Variant</h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <Label>Color Name</Label>
              <Input
                value={newVariant.color}
                onChange={(e) => setNewVariant(prev => ({ ...prev, color: e.target.value }))}
                placeholder="e.g., Black, White"
              />
            </div>

            <div>
              <Label>Color Code</Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={newVariant.color_code}
                  onChange={(e) => setNewVariant(prev => ({ ...prev, color_code: e.target.value }))}
                  className="w-16"
                />
                <Input
                  value={newVariant.color_code}
                  onChange={(e) => setNewVariant(prev => ({ ...prev, color_code: e.target.value }))}
                  placeholder="#000000"
                  className="flex-1"
                />
              </div>
            </div>

            <div>
              <Label>Stock</Label>
              <Input
                type="number"
                value={newVariant.stock}
                onChange={(e) => setNewVariant(prev => ({ ...prev, stock: parseInt(e.target.value) || 0 }))}
                placeholder="0"
                min="0"
              />
            </div>
          </div>

          <div className="mb-4">
            <Label>Images</Label>
            <div className="flex gap-2 mt-2">
              <Input
                value={variantImageUrl}
                onChange={(e) => setVariantImageUrl(e.target.value)}
                placeholder="Enter image URL"
                className="flex-1"
              />
              <Button onClick={handleAddVariantImage} disabled={!variantImageUrl.trim()}>
                <Plus className="w-4 h-4 mr-2" />
                Add
              </Button>
            </div>
          </div>

          {newVariant.images.length > 0 && (
            <div className="grid grid-cols-4 gap-2 mb-4">
              {newVariant.images.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={image}
                    alt={`New variant ${index + 1}`}
                    className="w-full aspect-square object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={() => setNewVariant(prev => ({
                      ...prev,
                      images: prev.images.filter((_, i) => i !== index)
                    }))}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <Button onClick={handleAddVariant} disabled={!newVariant.color.trim()}>
            Add Variant
          </Button>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4 pt-6 border-t">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSave}>
          {product ? 'Update Product' : 'Save Product'}
        </Button>
      </div>
    </div>
  );
};

export default AdminAddProduct;
