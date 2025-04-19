'use client';

import React, { useState, useEffect } from 'react';
import { FaLinkedin } from 'react-icons/fa';
import Image from 'next/image';

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
  const [newImageFile, setNewImageFile] = useState<File | null>(null);
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setNewImageFile(file);
      
      // Create and set image preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(prev => ({
          ...prev,
          [id]: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
      
      // Update the member's imageUrl
      const formData = new FormData();
      formData.append('file', file);
      formData.append('memberId', id);
      
      try {
        const response = await fetch('/api/uploadTeamImage', {
          method: 'POST',
          body: formData,
        });
        
        if (response.ok) {
          const data = await response.json();
          handleMemberChange(id, 'imageUrl', data.imageUrl);
        } else {
          console.error('Failed to upload image');
        }
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
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
              onClick={() => setActiveSection(section.id as any)}
              className={`px-4 py-2 ${activeSection === section.id ? 'text-[#931cf5] border-b-2 border-[#931cf5] -mb-px' : 'text-gray-500'}`}
            >
              {section.label}
            </button>
          ))}
        </div>

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
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, member.id)}
                    className="text-sm w-full"
                  />
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