'use client';

import React, { useState, useEffect, useRef, LegacyRef } from 'react';
import Image from 'next/image';
import ReactCrop, { Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { useEscapeKey } from '../hooks/useEscapeKey';

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
  onSave: (members: TeamMember[], teamPhotoUrl: string) => void;
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
  const [activeSection, setActiveSection] = useState<'presidents' | 'vps' | 'directors' | 'yearReps' | 'teamPhoto'>('presidents');
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
  const [originalImages, setOriginalImages] = useState<Record<string, string>>({});
  const [teamPhotoUrl, setTeamPhotoUrl] = useState<string>('');
  const [teamPhotoPreview, setTeamPhotoPreview] = useState<string>('');
  const [isTeamPhotoCropperOpen, setIsTeamPhotoCropperOpen] = useState(false);
  const [teamPhotoCrop, setTeamPhotoCrop] = useState<Crop>({ unit: '%', width: 100, height: 100, x: 0, y: 0 });
  const teamPhotoImgRef = useRef<HTMLImageElement | null>(null);

  const sections = [
    { id: 'presidents', label: 'Presidents' },
    { id: 'vps', label: 'Vice Presidents' },
    { id: 'directors', label: 'Directors' },
    { id: 'yearReps', label: 'Year Representatives' },
    { id: 'teamPhoto', label: 'Team Photo' },
  ];

  const positionTitles = {
    presidents: ['Co-President'],
    vps: ['VP Academic', 'VP Student Life', 'VP Professional Development', 'VP Marketing', 'VP Operations', 'VP Finance & Sponsorship'],
    directors: ['Events Director', 'Marketing Director', 'Merchandise Director', 'Outreach Director', 'Corporate Relations Director', 'Webmaster'],
    yearReps: ['First Year Rep', 'Second Year Rep', 'Third Year Rep', 'Fourth Year Rep', 'Computer Representative', 'Electrical Representative']
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
      // Fetch team photo URL
      fetch('/api/getTeamPhoto')
        .then(res => res.json())
        .then(data => {
          setTeamPhotoUrl(data.teamPhotoUrl || '');
          setTeamPhotoPreview(data.teamPhotoUrl || '');
        });
    }
  }, [isOpen, currentMembers]);

  useEscapeKey(() => {
    if (isOpen) {
      onClose();
    }
  });

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

  const handleReCrop = (id: string) => {
    setCrop({
      unit: '%',
      width: 100,
      height: 100,
      x: 0,
      y: 0
    });
    
    const imageToUse = originalImages[id] || imagePreview[id];
    
    setTempImageUrl(imageToUse);
    setTempMemberId(id);
    setIsCropperOpen(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      
      setCrop({
        unit: '%',
        width: 100,
        height: 100,
        x: 0,
        y: 0
      });
      
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setTempImageUrl(result);
        setTempMemberId(id);
        
        setOriginalImages(prev => ({
          ...prev,
          [id]: result
        }));
        
        setIsCropperOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = async () => {
    if (!imgRef.current || !tempImageUrl || !tempMemberId) return;
    
    try {
      const canvas = document.createElement('canvas');
      
      const image = imgRef.current;
      const imageWidth = image.naturalWidth;
      const imageHeight = image.naturalHeight;
      
      // Increase output resolution significantly for better clarity
      const outputSize = 1200;
      canvas.width = outputSize;
      canvas.height = outputSize;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      // Set image smoothing for better quality
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
      
      // Draw with high-quality settings
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
      
      // Use higher quality JPEG compression (0.98 instead of 0.95)
      canvas.toBlob(async (blob) => {
        if (!blob || !tempMemberId) return;
        
        const croppedImageUrl = URL.createObjectURL(blob);
        
        setImagePreview(prev => ({
          ...prev,
          [tempMemberId]: croppedImageUrl
        }));
        
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
          setIsCropperOpen(false);
          setTempImageUrl(null);
          setTempMemberId(null);
        }
      }, 'image/jpeg', 0.98);
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
      console.log('Saving team members:', members);
      await fetch('/api/updateTeamMembers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teamMembers: members, teamPhotoUrl }),
      });
      setHasChanges(false);
      onClose();
    } catch (error) {
      console.error('Error saving changes:', error);
      alert('Failed to save changes. Please try again.');
    } finally {
      setIsPublishing(false);
    }
  };

  const handleRemoveImage = (id: string) => {
    // Update the image preview to remove the image
    setImagePreview(prev => ({
      ...prev,
      [id]: ''
    }));
    
    // Remove from original images as well
    setOriginalImages(prev => {
      const newOriginals = {...prev};
      delete newOriginals[id];
      return newOriginals;
    });
    
    // Update the member data
    handleMemberChange(id, 'imageUrl', '');
    
    setHasChanges(true);
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

        <div className="flex flex-wrap mb-6 border-b">
          {sections.map(section => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id as 'presidents' | 'vps' | 'directors' | 'yearReps' | 'teamPhoto')}
              className={`px-4 py-2 ${activeSection === section.id ? 'text-[#931cf5] border-b-2 border-[#931cf5] -mb-px' : 'text-gray-500'}`}
            >
              {section.label}
            </button>
          ))}
        </div>

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
                  minWidth={50} 
                  minHeight={50}
                >
                  <div className="relative max-w-[90vw] max-h-[60vh] w-auto h-auto">
                    <Image 
                      ref={imgRef as LegacyRef<HTMLImageElement>}
                      src={tempImageUrl || ''}
                      alt="Crop preview"
                      className="max-w-[90vw] max-h-[60vh] w-auto h-auto"
                      onLoad={(e) => {
                        // Store the image element reference
                        imgRef.current = e.currentTarget;
                        // When image loads, initialize crop to center square if not set
                        if (crop.width === 100 && crop.height === 100) {
                          setTimeout(() => {
                            if (!imgRef.current) return;
                            const { width, height } = imgRef.current;
                            // Calculate a centered square crop
                            if (width > height) {
                              const cropSize = (height / width) * 100;
                              setCrop({
                                unit: '%',
                                width: cropSize,
                                height: cropSize,
                                x: (100 - cropSize) / 2,
                                y: 0
                              });
                            } else {
                              const cropSize = (width / height) * 100;
                              setCrop({
                                unit: '%',
                                width: cropSize, 
                                height: cropSize,
                                x: 0,
                                y: (100 - cropSize) / 2
                              });
                            }
                          }, 100);
                        }
                      }}
                      unoptimized
                    />
                  </div>
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

        {activeSection === 'teamPhoto' && (
          <div className="bg-gray-50 p-6 rounded-lg flex flex-col items-center">
            <h3 className="text-lg font-bold mb-4">Upload Team Photo</h3>
            <div className="w-full max-w-xs flex flex-col items-center">
              {teamPhotoPreview && (
                <>
                  <div className="w-full aspect-[2.5/1] shadow mb-4 relative overflow-hidden">
                    <Image src={teamPhotoPreview} alt="Team Photo Preview" fill className="object-cover" />
                  </div>
                  <button
                    className="mb-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                    onClick={() => { setTeamPhotoUrl(''); setTeamPhotoPreview(''); setHasChanges(true); }}
                    type="button"
                  >
                    Delete Image
                  </button>
                </>
              )}
              <div className="flex gap-2 mb-2">
                <button
                  className="bg-[#931cf5] hover:bg-[#7b17cc] text-white font-medium py-2 px-4 rounded-md"
                  onClick={() => document.getElementById('team-photo-upload')?.click()}
                >
                  Upload Image
                </button>
                <button
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md"
                  onClick={() => {
                    const url = prompt('Paste image URL:');
                    if (url) { setTeamPhotoUrl(url); setTeamPhotoPreview(url); setHasChanges(true); }
                  }}
                >
                  Use Image URL
                </button>
              </div>
              <input
                id="team-photo-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={e => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setTeamPhotoPreview(reader.result as string);
                      setIsTeamPhotoCropperOpen(true);
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
            </div>
            {isTeamPhotoCropperOpen && teamPhotoPreview && (
              <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[60]">
                <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-gray-900">Crop Team Photo</h3>
                    <button onClick={() => setIsTeamPhotoCropperOpen(false)} className="text-gray-500 hover:text-gray-700">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <ReactCrop
                    crop={teamPhotoCrop}
                    onChange={(newCrop, percentCrop) => setTeamPhotoCrop(percentCrop)}
                    aspect={2.5}
                    minWidth={100}
                    minHeight={40}
                  >
                    <Image
                      ref={teamPhotoImgRef as LegacyRef<HTMLImageElement>}
                      src={teamPhotoPreview}
                      alt="Crop preview"
                      width={1000}
                      height={400}
                      className="max-h-[50vh] max-w-full"
                      onLoad={e => { teamPhotoImgRef.current = e.currentTarget; }}
                      unoptimized
                    />
                  </ReactCrop>
                  <div className="flex justify-end gap-3 mt-4">
                    <button onClick={() => setIsTeamPhotoCropperOpen(false)} className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">Cancel</button>
                    <button
                      onClick={async () => {
                        if (!teamPhotoImgRef.current || !teamPhotoPreview) return;
                        const canvas = document.createElement('canvas');
                        const image = teamPhotoImgRef.current;
                        const imageWidth = image.naturalWidth;
                        const imageHeight = image.naturalHeight;
                        const outputWidth = 1200;
                        const outputHeight = 480;
                        canvas.width = outputWidth;
                        canvas.height = outputHeight;
                        const ctx = canvas.getContext('2d');
                        if (!ctx) return;
                        ctx.imageSmoothingEnabled = true;
                        ctx.imageSmoothingQuality = 'high';
                        ctx.clearRect(0, 0, canvas.width, canvas.height);
                        let sourceX, sourceY, sourceWidth, sourceHeight;
                        if (teamPhotoCrop.unit === '%') {
                          sourceX = (teamPhotoCrop.x / 100) * imageWidth;
                          sourceY = (teamPhotoCrop.y / 100) * imageHeight;
                          sourceWidth = (teamPhotoCrop.width / 100) * imageWidth;
                          sourceHeight = (teamPhotoCrop.height / 100) * imageHeight;
                        } else {
                          sourceX = teamPhotoCrop.x;
                          sourceY = teamPhotoCrop.y;
                          sourceWidth = teamPhotoCrop.width;
                          sourceHeight = teamPhotoCrop.height;
                        }
                        ctx.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, outputWidth, outputHeight);
                        canvas.toBlob(async (blob) => {
                          if (!blob) return;
                          const croppedUrl = URL.createObjectURL(blob);
                          setTeamPhotoPreview(croppedUrl);
                          // Upload to S3
                          const formData = new FormData();
                          formData.append('file', blob, 'team-photo.jpg');
                          formData.append('memberId', 'team-photo');
                          try {
                            const response = await fetch('/api/uploadTeamImage', {
                              method: 'POST',
                              body: formData,
                            });
                            if (response.ok) {
                              const data = await response.json();
                              setTeamPhotoUrl(data.imageUrl);
                              setHasChanges(true);
                            } else {
                              alert('Failed to upload team photo.');
                            }
                          } catch {
                            alert('Failed to upload team photo.');
                          }
                          setIsTeamPhotoCropperOpen(false);
                        }, 'image/jpeg', 0.98);
                      }}
                      className="px-4 py-2 bg-[#931cf5] text-white rounded-md hover:bg-[#7b17cc] transition-colors"
                    >Apply Crop</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="space-y-8">
          {filteredMembers.map(member => (
            <div key={member.id} className="bg-gray-50 p-6 rounded-lg">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-1/4">
                  <div className="relative h-[200px] w-full bg-gray-200 mb-2 overflow-hidden">
                    {imagePreview[member.id] && (
                      <>
                        <Image
                          src={imagePreview[member.id]}
                          alt={member.name}
                          fill
                          className="object-cover"
                        />
                        <button 
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-md hover:bg-red-600 transition-colors z-10"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (window.confirm('Are you sure you want to remove this image?')) {
                              handleRemoveImage(member.id);
                            }
                          }}
                          title="Remove image"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </>
                    )}
                  </div>
                  <div className="flex flex-col items-center space-y-2">
                    <div className="flex space-x-2 w-full">
                      <label htmlFor={`image-upload-${member.id}`} className="flex-1 cursor-pointer bg-[#931cf5] hover:bg-[#7b17cc] text-white font-medium py-2 px-4 rounded-md text-center transition-colors flex justify-center items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                        </svg>
                        {imagePreview[member.id] ? 'Change' : 'Upload'}
                      </label>
                      {imagePreview[member.id] && (
                        <button
                          onClick={() => handleReCrop(member.id)}
                          className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md text-center transition-colors flex justify-center items-center gap-2"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM14 11a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1v-1a1 1 0 011-1z" />
                          </svg>
                          Crop
                        </button>
                      )}
                    </div>
                    <input
                      id={`image-upload-${member.id}`}
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, member.id)}
                      className="hidden"
                    />
                    <p className="text-xs text-gray-500 text-center">
                      {imagePreview[member.id] 
                        ? 'Change photo or adjust the crop' 
                        : 'Upload a team member photo (square crop will be applied)'}
                    </p>
                  </div>
                </div>

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

                  {['presidents', 'vps', 'directors', 'yearReps'].includes(activeSection) && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Position
                      </label>
                      <select
                        value={member.position}
                        onChange={(e) => handleMemberChange(member.id, 'position', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#931cf5]"
                      >
                        {positionTitles[activeSection as keyof typeof positionTitles].map((position: string) => (
                          <option key={position} value={position}>{position}</option>
                        ))}
                      </select>
                    </div>
                  )}

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