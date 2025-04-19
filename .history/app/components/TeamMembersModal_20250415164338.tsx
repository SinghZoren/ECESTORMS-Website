'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import ReactCrop, { Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

interface TeamMember {
  id: string;
  name: string;
  position: string;
  imageUrl: string;
  linkedinUrl?: string;
  section: 'presidents' | 'vps' | 'directors' | 'yearReps';
}

interface TeamMembersModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (members: TeamMember[]) => void;
  currentMembers: TeamMember[];
}

export default function TeamMembersModal({
  isOpen,
  onClose,
  onSave,
  currentMembers
}: TeamMembersModalProps) {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [isPublishing, setIsPublishing] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [activeSection, setActiveSection] = useState<'presidents' | 'vps' | 'directors' | 'yearReps'>('presidents');
  const [tempImageUrl, setTempImageUrl] = useState<string | null>(null);
  const [tempMemberId, setTempMemberId] = useState<string | null>(null);
  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const [crop, setCrop] = useState<Crop>({
    unit: '%',
    width: 100,
    height: 100,
    x: 0,
    y: 0
  });
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [imagePreview, setImagePreview] = useState<Record<string, string>>({});

  const sections = [
    { id: 'presidents', label: 'Presidents' },
    { id: 'vps', label: 'Vice Presidents' },
    { id: 'directors', label: 'Directors' },
    { id: 'yearReps', label: 'Year Representatives' }
  ];

  const positionTitles = {
    presidents: ['Co-President'],
    vps: ['VP Academic', 'VP Student Life', 'VP Professional Development', 'VP Marketing', 'VP Operations', 'VP Finance & Sponsorship'],
    directors: ['Events Director', 'Marketing Director', 'Merchandise Director', 'Outreach Director', 'Corporate Relations Director', 'Webmaster'],
    yearReps: ['First Year Rep', 'Second Year Rep', 'Third Year Rep', 'Fourth Year Rep']
  };

  useEffect(() => {
    if (isOpen) {
      setMembers(currentMembers);
      setHasChanges(false);
      
      // Initialize image previews
      const previews: Record<string, string> = {};
      currentMembers.forEach(member => {
        previews[member.id] = member.imageUrl;
      });
      setImagePreview(previews);
    }
  }, [isOpen, currentMembers]);

  const handleClose = () => {
    if (hasChanges) {
      if (window.confirm('You have unsaved changes. Are you sure you want to close without publishing?')) {
        onClose();
      }
    } else {
      onClose();
    }
  };

  const handleMemberChange = (id: string, field: keyof TeamMember, value: string) => {
    setMembers(prev => 
      prev.map(member => 
        member.id === id ? { ...member, [field]: value } : member
      )
    );
    setHasChanges(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      
      // Create temporary URL for cropping
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempImageUrl(reader.result as string);
        setTempMemberId(id);
        setIsCropperOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = async () => {
    if (!imgRef.current || !tempImageUrl || !tempMemberId) return;
    
    try {
      // Create a canvas to draw the cropped image
      const canvas = document.createElement('canvas');
      const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
      const scaleY = imgRef.current.naturalHeight / imgRef.current.height;
      
      // Set canvas dimensions to 300x300 for a reasonable file size
      canvas.width = 300;
      canvas.height = 300;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      // Calculate the scaled crop dimensions
      const cropX = crop.x * scaleX;
      const cropY = crop.y * scaleY;
      const cropWidth = crop.width * scaleX;
      const cropHeight = crop.height * scaleY;
      
      // Draw the cropped image on the canvas
      ctx.drawImage(
        imgRef.current,
        cropX,
        cropY,
        cropWidth,
        cropHeight,
        0,
        0,
        canvas.width,
        canvas.height
      );
      
      // Convert canvas to blob
      canvas.toBlob(async (blob) => {
        if (!blob || !tempMemberId) return;
        
        // Update preview
        const croppedImageUrl = URL.createObjectURL(blob);
        setImagePreview(prev => ({
          ...prev,
          [tempMemberId]: croppedImageUrl
        }));
        
        // Create form data and upload
        const formData = new FormData();
        formData.append('file', blob, 'cropped-image.jpg');
        formData.append('memberId', tempMemberId);
        
        try {
          const response = await fetch('/api/uploadTeamImage', {
            method: 'POST',
            body: formData,
          });
          
          if (response.ok) {
            const data = await response.json();
            handleMemberChange(tempMemberId, 'imageUrl', data.imageUrl);
          } else {
            console.error('Failed to upload image');
          }
        } catch (error) {
          console.error('Error uploading image:', error);
        } finally {
          // Close the cropper
          setIsCropperOpen(false);
          setTempImageUrl(null);
          setTempMemberId(null);
        }
      }, 'image/jpeg', 0.95);
    } catch (error) {
      console.error('Error cropping image:', error);
      setIsCropperOpen(false);
    }
  };
  
  const cancelCrop = () => {
    setIsCropperOpen(false);
    setTempImageUrl(null);
    setTempMemberId(null);
  };

  const handleSave = async () => {
    setIsPublishing(true);
    try {
      // Save changes to team members
      await onSave(members);
      setHasChanges(false);
      onClose();
    } catch (error) {
      console.error('Error saving changes:', error);
      alert('Failed to save changes. Please try again.');
    } finally {
      setIsPublishing(false);
    }
  };

  const filteredMembers = members.filter(member => member.section === activeSection);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-white rounded-lg p-8 max-w-5xl w-full max-h-[90vh] overflow-y-auto m-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Edit Team Members</h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Section tabs */}
        <div className="flex flex-wrap mb-6 border-b">
          {sections.map(section => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id as 'presidents' | 'vps' | 'directors' | 'yearReps')}
              className={`px-4 py-2 ${activeSection === section.id ? 'text-[#931cf5] border-b-2 border-[#931cf5] -mb-px' : 'text-gray-500'}`}
            >
              {section.label}
            </button>
          ))}
        </div>

        {/* Image Cropper Modal */}
        {isCropperOpen && tempImageUrl && (
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
                >
                  <img 
                    ref={imgRef}
                    src={tempImageUrl}
                    alt="Crop preview"
                    className="max-h-[50vh] max-w-full"
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

        {/* Member editing form */}
        <div className="space-y-8">
          {filteredMembers.map(member => (
            <div key={member.id} className="bg-gray-50 p-6 rounded-lg">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Image preview */}
                <div className="w-full md:w-1/4">
                  <div className="relative h-[200px] w-full bg-gray-200 mb-2 overflow-hidden">
                    {imagePreview[member.id] && (
                      <Image
                        src={imagePreview[member.id]}
                        alt={member.name}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="flex flex-col items-center">
                    <label htmlFor={`image-upload-${member.id}`} className="w-full cursor-pointer bg-[#931cf5] hover:bg-[#7b17cc] text-white font-medium py-2 px-4 rounded-md text-center transition-colors flex justify-center items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                      </svg>
                      {imagePreview[member.id] ? 'Change Photo' : 'Upload Photo'}
                    </label>
                    <input
                      id={`image-upload-${member.id}`}
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, member.id)}
                      className="hidden"
                    />
                    <p className="text-xs text-gray-500 mt-1 text-center">
                      Click to {imagePreview[member.id] ? 'change' : 'upload'} team member photo
                    </p>
                  </div>
                </div>

                {/* Member details */}
                <div className="w-full md:w-3/4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      value={member.name}
                      onChange={(e) => handleMemberChange(member.id, 'name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#931cf5]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Position
                    </label>
                    <select
                      value={member.position}
                      onChange={(e) => handleMemberChange(member.id, 'position', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#931cf5]"
                    >
                      {positionTitles[activeSection].map(position => (
                        <option key={position} value={position}>{position}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      LinkedIn URL
                    </label>
                    <input
                      type="text"
                      value={member.linkedinUrl || ''}
                      onChange={(e) => handleMemberChange(member.id, 'linkedinUrl', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#931cf5]"
                      placeholder="https://linkedin.com/in/username"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-end space-x-4">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isPublishing}
            className="px-4 py-2 bg-[#931cf5] text-white rounded-md hover:bg-[#7b17cc] transition-colors disabled:opacity-50"
          >
            {isPublishing ? 'Publishing...' : 'Publish Changes'}
          </button>
        </div>
      </div>
    </div>
  );
} 