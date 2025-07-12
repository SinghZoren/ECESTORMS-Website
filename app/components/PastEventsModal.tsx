import React, { useState, ChangeEvent, useRef, useEffect } from 'react';
import { IoClose } from 'react-icons/io5';
import ReactCrop, { Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import Image from 'next/image';

interface PastEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  imageUrl: string;
  year: string;
  term: string;
}

interface PastEventsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (events: PastEvent[]) => void;
  currentEvents: PastEvent[];
}

export default function PastEventsModal({ isOpen, onClose, onSave, currentEvents }: PastEventsModalProps) {
  const [events, setEvents] = useState<PastEvent[]>(currentEvents);
  const [editingEvent, setEditingEvent] = useState<PastEvent | null>(null);
  const [editMode, setEditMode] = useState<'add' | 'edit'>('add');
  const [editEventId, setEditEventId] = useState<string | null>(null);
  const years = Array.from(new Set(events.map(e => e.year))).sort().reverse();
  const [selectedYear, setSelectedYear] = useState(years[0] || '');
  const [useImageUpload, setUseImageUpload] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const [crop, setCrop] = useState<Crop>({ unit: '%', width: 100, height: 100, x: 0, y: 0 });
  const imgRef = useRef<HTMLImageElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setEvents(currentEvents);
    }
  }, [isOpen, currentEvents]);

  // Filter events by selected year
  const filteredEvents = events.filter(e => e.year === selectedYear);

  const handleAddEvent = () => {
    const newEvent: PastEvent = {
      id: Date.now().toString(),
      title: '',
      date: '',
      time: '',
      location: '',
      description: '',
      imageUrl: '',
      year: '',
      term: ''
    };
    setEditingEvent(newEvent);
    setEditMode('add');
    setEditEventId(null);
    // Reset image-related states
    setImagePreview(null);
    setImageFile(null);
    setUseImageUpload(false);
    setIsCropperOpen(false);
    setCrop({ unit: '%', width: 100, height: 100, x: 0, y: 0 });
    setSaveError(null);
  };

  const handleEditEvent = (event: PastEvent) => {
    setEditingEvent({ ...event });
    setEditMode('edit');
    setEditEventId(event.id);
    // Set image preview for existing event
    setImagePreview(event.imageUrl);
    setImageFile(null);
    setUseImageUpload(false);
    setIsCropperOpen(false);
    setCrop({ unit: '%', width: 100, height: 100, x: 0, y: 0 });
    setSaveError(null);
  };

  const handleDeleteEvent = (id: string) => {
    setEvents(events.filter(event => event.id !== id));
  };

  const handleSaveEvent = async (event: PastEvent) => {
    setSaveError(null);
    // Validation: require year and term
    if (!event.year || !event.term) {
      setSaveError('Year and term are required.');
      return;
    }
    let finalImageUrl = event.imageUrl;
    if (useImageUpload && imageFile && imagePreview) {
      // Upload cropped image to S3
      const blob = await fetch(imagePreview).then(r => r.blob());
      const formData = new FormData();
      formData.append('file', blob, 'event-image.jpg');
      try {
        const response = await fetch('/api/uploadEventImage', {
          method: 'POST',
          body: formData,
        });
        if (response.ok) {
          const data = await response.json();
          finalImageUrl = data.imageUrl;
        } else {
          alert('Failed to upload image.');
          return;
        }
      } catch {
        alert('Failed to upload image.');
        return;
      }
    }
    const newEvent = { ...event, imageUrl: finalImageUrl };
    if (editMode === 'edit' && editEventId) {
      // Update existing event
      const updatedEvents = events.map(e => e.id === editEventId ? { ...newEvent, id: editEventId } : e);
      setEvents(updatedEvents);
    } else {
      // Add new event
      setEvents([...events, newEvent]);
    }
    setEditingEvent(null);
    setEditMode('add');
    setEditEventId(null);
    // Reset image-related states after saving
    setImagePreview(null);
    setImageFile(null);
    setUseImageUpload(false);
    setIsCropperOpen(false);
    setCrop({ unit: '%', width: 100, height: 100, x: 0, y: 0 });
    setSaveError(null);
  };

  const handleSaveAll = () => {
    onSave(events);
    onClose();
  };

  // Handle image file change
  const handleImageFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
    if (file) {
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
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.clearRect(0, 0, canvas.width, canvas.height);
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
    canvas.toBlob((blob) => {
      if (!blob) return;
      const croppedUrl = URL.createObjectURL(blob);
      setImagePreview(croppedUrl);
      setIsCropperOpen(false);
    }, 'image/jpeg', 0.98);
  };
  const cancelCrop = () => {
    setIsCropperOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-4 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Manage Past Events</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <IoClose size={24} />
          </button>
        </div>

        {/* Year Selector */}
        <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
          {years.map(year => (
            <button
              key={year}
              onClick={() => setSelectedYear(year)}
              className={`px-4 py-2 rounded-full border transition-colors whitespace-nowrap ${selectedYear === year ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-blue-100'}`}
            >
              {year}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {filteredEvents.map(event => (
            <div key={event.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{event.title}</h3>
                  <p className="text-sm text-gray-600">{event.date} at {event.time}</p>
                  <p className="text-sm text-gray-600">{event.location}</p>
                  <p className="text-sm text-gray-600">{event.year} - {event.term}</p>
                </div>
                <div className="space-x-2">
                  <button
                    onClick={() => handleEditEvent(event)}
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteEvent(event.id)}
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
            onClick={handleAddEvent}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Add New Event
          </button>
          <button
            onClick={handleSaveAll}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Save All Changes
          </button>
        </div>

        {editingEvent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">
                  {editingEvent.id ? 'Edit Event' : 'Add New Event'}
                </h3>
                <button onClick={() => setEditingEvent(null)} className="text-gray-500 hover:text-gray-700">
                  <IoClose size={24} />
                </button>
              </div>
              <form onSubmit={async (e) => {
                e.preventDefault();
                await handleSaveEvent(editingEvent);
              }}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Title</label>
                    <input
                      type="text"
                      value={editingEvent.title || ''}
                      onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Location</label>
                    <input
                      type="text"
                      value={editingEvent.location || ''}
                      onChange={(e) => setEditingEvent({ ...editingEvent, location: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Year</label>
                    <input
                      type="text"
                      value={editingEvent.year || ''}
                      onChange={(e) => setEditingEvent({ ...editingEvent, year: e.target.value })}
                      placeholder="e.g., 2023-2024"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Term</label>
                    <select
                      value={editingEvent.term}
                      onChange={(e) => setEditingEvent({ ...editingEvent, term: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select a term</option>
                      <option value="Fall">Fall</option>
                      <option value="Winter">Winter</option>
                      <option value="Spring">Spring</option>
                      <option value="Summer">Summer</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                      value={editingEvent.description || ''}
                      onChange={(e) => setEditingEvent({ ...editingEvent, description: e.target.value })}
                      rows={4}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Event Image</label>
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
                        value={editingEvent.imageUrl || ''}
                        onChange={(e) => {
                          setEditingEvent({ ...editingEvent, imageUrl: e.target.value });
                          setImagePreview(e.target.value);
                        }}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="https://example.com/image.jpg"
                        required={!useImageUpload}
                      />
                    ) : (
                      <div
                        className="border-2 border-dashed border-gray-300 rounded p-4 text-center cursor-pointer hover:bg-gray-50"
                        onClick={() => fileInputRef.current?.click()}
                        onDragOver={e => { e.preventDefault(); e.stopPropagation(); }}
                        onDrop={e => {
                          e.preventDefault();
                          e.stopPropagation();
                          const files = (e.dataTransfer.files as FileList);
                          const file = files?.[0];
                          if (file) handleImageFileChange({ target: { files } } as ChangeEvent<HTMLInputElement>);
                        }}
                      >
                        <span className="block text-gray-500">Drag & drop an image here, or click to choose a file</span>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileChange}
                      style={{ display: 'none' }}
                      ref={fileInputRef}
                      required={useImageUpload}
                    />
                    {imagePreview && (
                      <Image src={imagePreview} alt="Preview" className="mt-2 rounded max-h-40" width={160} height={160} />
                    )}
                  </div>
                </div>
                <div className="mt-6 flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setEditingEvent(null)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  >
                    Save Event
                  </button>
                </div>
              </form>
              {saveError && (
                <div className="text-red-600 font-semibold mb-2">{saveError}</div>
              )}
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
                  <Image
                    src={imagePreview}
                    alt="Crop preview"
                    className="max-h-[50vh] max-w-full"
                    width={400}
                    height={400}
                    onLoadingComplete={(img) => { imgRef.current = img; }}
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