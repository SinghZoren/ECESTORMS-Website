import React, { useState, ChangeEvent, useEffect, useRef } from 'react';
import { IoClose } from 'react-icons/io5';
import ReactCrop, { Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

interface ShopItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  buyUrl: string;
}

interface ShopModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (items: ShopItem[]) => void;
  currentItems: ShopItem[];
}

export default function ShopModal({ isOpen, onClose, onSave, currentItems }: ShopModalProps) {
  const [items, setItems] = useState<ShopItem[]>(currentItems);
  const [editingItem, setEditingItem] = useState<ShopItem | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [useImageUpload, setUseImageUpload] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const [crop, setCrop] = useState<Crop>({ unit: '%', width: 100, height: 100, x: 0, y: 0 });
  const imgRef = useRef<HTMLImageElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [imageType, setImageType] = useState<string>('image/jpeg');

  useEffect(() => {
    setItems(currentItems);
  }, [currentItems]);

  const handleAddItem = () => {
    setEditingItem({
      id: Date.now().toString(),
      title: '',
      description: '',
      imageUrl: '',
      buyUrl: ''
    });
    setImagePreview(null);
    setUseImageUpload(false);
    setImageFile(null);
  };

  const handleEditItem = (item: ShopItem) => {
    setEditingItem({ ...item });
    setImagePreview(item.imageUrl);
    setUseImageUpload(false);
    setImageFile(null);
  };

  const handleDeleteItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const handleImageFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
    if (file) {
      setImageType(file.type);
      const reader = new FileReader();
      reader.onload = (ev) => {
        setImagePreview(ev.target?.result as string);
        setIsCropperOpen(true);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  // Handle crop complete
  const handleCropComplete = async () => {
    if (!imgRef.current || !imagePreview) return;
    const canvas = document.createElement('canvas');
    const image = imgRef.current;
    const imageWidth = image.naturalWidth;
    const imageHeight = image.naturalHeight;
    const outputSize = 800;
    canvas.width = outputSize;
    canvas.height = outputSize;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // If PNG, keep transparent background; else, fill white
    if (imageType === 'image/png') {
      // Do nothing, keep transparent
    } else {
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    let sourceX, sourceY, sourceWidth, sourceHeight;
    if (crop.unit === '%') {
      sourceX = (crop.x / 100) * imageWidth;
      sourceY = (crop.y / 100) * imageHeight;
      sourceWidth = (crop.width / 100) * imageWidth;
      sourceHeight = (crop.height / 100) * imageHeight;
    } else {
      sourceX = crop.x;
      sourceY = crop.y;
      sourceWidth = crop.width;
      sourceHeight = crop.height;
    }
    ctx.drawImage(
      image,
      sourceX,
      sourceY,
      sourceWidth,
      sourceHeight,
      0,
      0,
      outputSize,
      outputSize
    );
    // Export as PNG if original was PNG, else JPEG
    if (imageType === 'image/png') {
      canvas.toBlob((blob) => {
        if (!blob) return;
        const croppedUrl = URL.createObjectURL(blob);
        setImagePreview(croppedUrl);
        setIsCropperOpen(false);
      }, 'image/png');
    } else {
      canvas.toBlob((blob) => {
        if (!blob) return;
        const croppedUrl = URL.createObjectURL(blob);
        setImagePreview(croppedUrl);
        setIsCropperOpen(false);
      }, 'image/jpeg', 0.98);
    }
  };
  const cancelCrop = () => {
    setIsCropperOpen(false);
  };

  const handleSaveItem = (item: ShopItem) => {
    if (items.some(i => i.id === item.id)) {
      setItems(items.map(i => i.id === item.id ? item : i));
    } else {
      setItems([...items, item]);
    }
    setEditingItem(null);
    setImagePreview(null);
    setImageFile(null);
  };

  const handleSaveAll = () => {
    onSave(items);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Manage Shop Items</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <IoClose size={24} />
          </button>
        </div>
        <div className="space-y-4">
          {items.map(item => (
            <div key={item.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.description}</p>
                  <a href={item.buyUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline text-sm">Buy Link</a>
                </div>
                <div className="space-x-2">
                  <button
                    onClick={() => handleEditItem(item)}
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteItem(item.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 space-x-4">
          <button
            onClick={handleAddItem}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Add New Item
          </button>
          <button
            onClick={handleSaveAll}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Save All Changes
          </button>
        </div>
        {editingItem && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">
                  {editingItem.id ? 'Edit Item' : 'Add New Item'}
                </h3>
                <button onClick={() => setEditingItem(null)} className="text-gray-500 hover:text-gray-700">
                  <IoClose size={24} />
                </button>
              </div>
              <form onSubmit={e => {
                e.preventDefault();
                handleSaveItem({ ...editingItem, imageUrl: imagePreview || editingItem.imageUrl });
              }}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Title</label>
                    <input
                      type="text"
                      value={editingItem.title}
                      onChange={e => setEditingItem({ ...editingItem, title: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                      value={editingItem.description}
                      onChange={e => setEditingItem({ ...editingItem, description: e.target.value })}
                      rows={3}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Buy URL</label>
                    <input
                      type="text"
                      value={editingItem.buyUrl}
                      onChange={e => setEditingItem({ ...editingItem, buyUrl: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Product Image</label>
                    <div className="flex items-center space-x-4 mb-2">
                      <button
                        type="button"
                        className={`px-3 py-1 rounded ${!useImageUpload ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                        onClick={() => setUseImageUpload(false)}
                      >
                        Use Image URL
                      </button>
                      <button
                        type="button"
                        className={`px-3 py-1 rounded ${useImageUpload ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                        onClick={() => {
                          setUseImageUpload(true);
                          setTimeout(() => fileInputRef.current?.click(), 0);
                        }}
                      >
                        Upload Image
                      </button>
                    </div>
                    {!useImageUpload ? (
                      <input
                        type="text"
                        value={editingItem.imageUrl || ''}
                        onChange={e => {
                          setEditingItem({ ...editingItem, imageUrl: e.target.value });
                          setImagePreview(e.target.value);
                        }}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="https://example.com/image.jpg"
                        required={!useImageUpload}
                      />
                    ) : (
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageFileChange}
                        className="mt-1 block w-full"
                        required={useImageUpload}
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                      />
                    )}
                    {imagePreview && (
                      <img src={imagePreview} alt="Preview" className="mt-2 rounded max-h-40" />
                    )}
                  </div>
                </div>
                <div className="mt-6 flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setEditingItem(null)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  >
                    Save Item
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {isCropperOpen && imagePreview && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[60]">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">Crop Image</h3>
                <button
                  onClick={cancelCrop}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <p className="mb-4 text-gray-600">Drag to adjust the crop area. The image will be cropped to a square (1:1 ratio).</p>
              <div className="flex justify-center mb-4">
                <ReactCrop
                  crop={crop}
                  onChange={(newCrop, percentCrop) => setCrop(percentCrop)}
                  aspect={1}
                  circularCrop={false}
                  minWidth={50}
                  minHeight={50}
                >
                  <img
                    ref={imgRef}
                    src={imagePreview}
                    alt="Crop preview"
                    className="max-h-[50vh] max-w-full"
                    onLoad={(e) => {
                      imgRef.current = e.currentTarget;
                      if (crop.width === 100 && crop.height === 100) {
                        setTimeout(() => {
                          if (!imgRef.current) return;
                          const { width, height } = imgRef.current;
                          if (width > height) {
                            const cropSize = (height / width) * 100;
                            setCrop({ unit: '%', width: cropSize, height: cropSize, x: (100 - cropSize) / 2, y: 0 });
                          } else {
                            const cropSize = (width / height) * 100;
                            setCrop({ unit: '%', width: cropSize, height: cropSize, x: 0, y: (100 - cropSize) / 2 });
                          }
                        }, 100);
                      }
                    }}
                  />
                </ReactCrop>
              </div>
              <div className="flex justify-end gap-3">
                <button
                  onClick={cancelCrop}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCropComplete}
                  className="px-4 py-2 bg-[#931cf5] text-white rounded-md hover:bg-[#7b17cc] transition-colors"
                >
                  Apply Crop
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 