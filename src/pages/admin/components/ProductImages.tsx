import React, { useState, useRef } from 'react';
import { Image, X, ArrowUp, ArrowDown } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { useNotification } from '../../../context/NotificationContext';
import LoadingSpinner from '../../../components/LoadingSpinner';

interface ProductImage {
  id: string;
  image_url: string;
  sort_order: number;
}

interface ProductImagesProps {
  productId: string;
  images: ProductImage[];
  onImagesChange: (images: ProductImage[]) => void;
}

export default function ProductImages({ productId, images, onImagesChange }: ProductImagesProps) {
  const { showNotification } = useNotification();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploading(true);
    const newImages: ProductImage[] = [];

    try {
      for (const file of files) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `product-images/${fileName}`;

        // Upload image to storage
        const { error: uploadError } = await supabase.storage
          .from('products')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        // Get public URL
        const { data } = supabase.storage
          .from('products')
          .getPublicUrl(filePath);

        // Add to product_images table
        const { data: imageData, error: insertError } = await supabase
          .from('product_images')
          .insert({
            product_id: productId,
            image_url: data.publicUrl,
            sort_order: images.length + newImages.length
          })
          .select()
          .single();

        if (insertError) throw insertError;

        newImages.push(imageData);
      }

      // Update parent component
      onImagesChange([...images, ...newImages]);
      showNotification('success', 'התמונות הועלו בהצלחה');
    } catch (error) {
      console.error('Error uploading images:', error);
      showNotification('error', 'שגיאה בהעלאת התמונות');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveImage = async (imageId: string) => {
    try {
      const { error } = await supabase
        .from('product_images')
        .delete()
        .eq('id', imageId);

      if (error) throw error;

      // Update local state
      const updatedImages = images.filter(img => img.id !== imageId);
      onImagesChange(updatedImages);
      showNotification('success', 'התמונה הוסרה בהצלחה');
    } catch (error) {
      console.error('Error removing image:', error);
      showNotification('error', 'שגיאה בהסרת התמונה');
    }
  };

  const handleReorderImage = async (imageId: string, direction: 'up' | 'down') => {
    const currentIndex = images.findIndex(img => img.id === imageId);
    if (
      (direction === 'up' && currentIndex === 0) ||
      (direction === 'down' && currentIndex === images.length - 1)
    ) {
      return;
    }

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    const reorderedImages = [...images];
    const [movedImage] = reorderedImages.splice(currentIndex, 1);
    reorderedImages.splice(newIndex, 0, movedImage);

    try {
      // Update sort_order for all affected images
      await Promise.all(
        reorderedImages.map((img, index) => 
          supabase
            .from('product_images')
            .update({ sort_order: index })
            .eq('id', img.id)
        )
      );

      onImagesChange(reorderedImages);
    } catch (error) {
      console.error('Error reordering images:', error);
      showNotification('error', 'שגיאה בסידור התמונות');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">תמונות מוצר</h3>
        <div className="flex gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors flex items-center gap-2"
          >
            {uploading ? (
              <LoadingSpinner />
            ) : (
              <>
                <Image className="w-5 h-5" />
                העלה תמונות
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image, index) => (
          <div key={image.id} className="relative group">
            <img
              src={image.image_url}
              alt={`תמונת מוצר ${index + 1}`}
              className="w-full aspect-square object-cover rounded-lg"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => handleRemoveImage(image.id)}
                className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                title="הסר תמונה"
              >
                <X className="w-4 h-4" />
              </button>
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => handleReorderImage(image.id, 'up')}
                  className="p-2 bg-white text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
                  title="הזז למעלה"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
              )}
              {index < images.length - 1 && (
                <button
                  type="button"
                  onClick={() => handleReorderImage(image.id, 'down')}
                  className="p-2 bg-white text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
                  title="הזז למטה"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>
              )}
            </div>
            {index === 0 && (
              <div className="absolute top-2 right-2 bg-primary text-white px-2 py-1 rounded-full text-xs">
                תמונה ראשית
              </div>
            )}
          </div>
        ))}
      </div>

      {images.length === 0 && (
        <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
          <Image className="w-12 h-12 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500">לא נבחרו תמונות</p>
          <p className="text-sm text-gray-400">לחץ על "העלה תמונות" כדי להוסיף תמונות למוצר</p>
        </div>
      )}
    </div>
  );
}