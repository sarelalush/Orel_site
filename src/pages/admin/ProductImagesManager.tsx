import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Image, X, ArrowUp, ArrowDown, Save, ChevronLeft, Upload } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useNotification } from '../../context/NotificationContext';
import LoadingSpinner from '../../components/LoadingSpinner';

interface ProductImage {
  id: string;
  image_url: string;
  sort_order: number;
}

export default function ProductImagesManager() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [product, setProduct] = useState<any>(null);
  const [images, setImages] = useState<ProductImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (id) {
      fetchProduct();
      fetchImages();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setProduct(data);
    } catch (error) {
      console.error('Error fetching product:', error);
      showNotification('error', 'שגיאה בטעינת המוצר');
    }
  };

  const fetchImages = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('product_images')
        .select('*')
        .eq('product_id', id)
        .order('sort_order');

      if (error) throw error;
      setImages(data || []);
    } catch (error) {
      console.error('Error fetching product images:', error);
      showNotification('error', 'שגיאה בטעינת תמונות המוצר');
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploading(true);

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
        const { error: insertError } = await supabase
          .from('product_images')
          .insert({
            product_id: id,
            image_url: data.publicUrl,
            sort_order: images.length
          });

        if (insertError) throw insertError;
      }

      // Refresh images
      fetchImages();
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

      // Refresh images
      fetchImages();
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

      setImages(reorderedImages);
      showNotification('success', 'סדר התמונות עודכן בהצלחה');
    } catch (error) {
      console.error('Error reordering images:', error);
      showNotification('error', 'שגיאה בסידור התמונות');
    }
  };

  const setMainImage = async (imageUrl: string) => {
    if (!product) return;
    
    try {
      const { error } = await supabase
        .from('products')
        .update({ image_url: imageUrl })
        .eq('id', id);

      if (error) throw error;
      
      setProduct({ ...product, image_url: imageUrl });
      showNotification('success', 'התמונה הראשית עודכנה בהצלחה');
    } catch (error) {
      console.error('Error setting main image:', error);
      showNotification('error', 'שגיאה בעדכון התמונה הראשית');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          חזרה
        </button>
        <h1 className="text-2xl font-bold">ניהול תמונות מוצר</h1>
      </div>

      {product && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
          <p className="text-gray-600">{product.description}</p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">תמונות המוצר</h3>
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
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors flex items-center gap-2"
            >
              {uploading ? (
                <LoadingSpinner />
              ) : (
                <>
                  <Upload className="w-5 h-5" />
                  העלה תמונות
                </>
              )}
            </button>
          </div>
        </div>

        {images.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
            <Image className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">אין תמונות למוצר זה</p>
            <p className="text-gray-500">לחץ על "העלה תמונות" כדי להוסיף תמונות</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {images.map((image, index) => (
              <div key={image.id} className="relative group">
                <img
                  src={image.image_url}
                  alt={`תמונת מוצר ${index + 1}`}
                  className={`w-full aspect-square object-cover rounded-lg ${
                    product?.image_url === image.image_url ? 'ring-4 ring-primary' : ''
                  }`}
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                  <button
                    onClick={() => handleRemoveImage(image.id)}
                    className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    title="הסר תמונה"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  {index > 0 && (
                    <button
                      onClick={() => handleReorderImage(image.id, 'up')}
                      className="p-2 bg-white text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
                      title="הזז למעלה"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                  )}
                  {index < images.length - 1 && (
                    <button
                      onClick={() => handleReorderImage(image.id, 'down')}
                      className="p-2 bg-white text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
                      title="הזז למטה"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                  )}
                  {product?.image_url !== image.image_url && (
                    <button
                      onClick={() => setMainImage(image.image_url)}
                      className="p-2 bg-primary text-white rounded-full hover:bg-primary-dark transition-colors"
                      title="הגדר כתמונה ראשית"
                    >
                      <Save className="w-4 h-4" />
                    </button>
                  )}
                </div>
                {product?.image_url === image.image_url && (
                  <div className="absolute top-2 right-2 bg-primary text-white px-2 py-1 rounded-full text-xs">
                    תמונה ראשית
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}