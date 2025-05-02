import React, { useState, useEffect } from 'react';
import Image from 'next/image';

export interface Sponsor {
  id: string;
  name: string;
  imageUrl: string;
  websiteUrl: string;
  category: 'university' | 'corporate';
}

interface SponsorsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (sponsors: Sponsor[]) => void;
  currentSponsors: Sponsor[];
}

export default function SponsorsModal({
  isOpen,
  onClose,
  onSave,
  currentSponsors
}: SponsorsModalProps) {
  const [sponsors, setSponsors] = useState<Sponsor[]>(currentSponsors);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [newSponsor, setNewSponsor] = useState<Partial<Sponsor>>({
    name: '',
    websiteUrl: '',
    category: 'corporate'
  });

  useEffect(() => {
    setSponsors(currentSponsors);
  }, [currentSponsors]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleAddSponsor = async () => {
    if (!selectedFile || !newSponsor.name || !newSponsor.websiteUrl || !newSponsor.category) {
      alert('Please fill in all fields and select a logo');
      return;
    }

    try {
      // Create form data for file upload
      const formData = new FormData();
      formData.append('file', selectedFile);

      // Upload the file
      const uploadResponse = await fetch('/api/uploadSponsorLogo', {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload logo');
      }

      const { imageUrl } = await uploadResponse.json();

      // Add new sponsor to the list
      const newSponsorComplete: Sponsor = {
        id: Date.now().toString(),
        name: newSponsor.name,
        imageUrl,
        websiteUrl: newSponsor.websiteUrl,
        category: newSponsor.category as 'university' | 'corporate',
      };

      setSponsors([...sponsors, newSponsorComplete]);

      // Reset form
      setNewSponsor({
        name: '',
        websiteUrl: '',
        category: 'corporate'
      });
      setSelectedFile(null);
      
      // Reset file input
      const fileInput = document.getElementById('sponsorLogo') as HTMLInputElement;
      if (fileInput) {
        fileInput.value = '';
      }
    } catch (error) {
      console.error('Error adding sponsor:', error);
      alert('Failed to add sponsor. Please try again.');
    }
  };

  const handleRemoveSponsor = (id: string) => {
    setSponsors(sponsors.filter(sponsor => sponsor.id !== id));
  };

  const handleSave = () => {
    onSave(sponsors);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Manage Sponsors</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Add New Sponsor Form */}
        <div className="mb-8 bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Add New Sponsor</h3>
          <div className="grid grid-cols-1 gap-4">
            <input
              type="text"
              placeholder="Sponsor Name"
              className="border p-2 rounded"
              value={newSponsor.name}
              onChange={(e) => setNewSponsor({ ...newSponsor, name: e.target.value })}
            />
            <input
              type="text"
              placeholder="Website URL"
              className="border p-2 rounded"
              value={newSponsor.websiteUrl}
              onChange={(e) => setNewSponsor({ ...newSponsor, websiteUrl: e.target.value })}
            />
            <select
              className="border p-2 rounded"
              value={newSponsor.category}
              onChange={(e) => setNewSponsor({ ...newSponsor, category: e.target.value as 'university' | 'corporate' })}
            >
              <option value="university">University Partner</option>
              <option value="corporate">Corporate Sponsor</option>
            </select>
            <input
              type="file"
              id="sponsorLogo"
              accept="image/*"
              className="border p-2 rounded"
              onChange={handleFileChange}
            />
            <button
              onClick={handleAddSponsor}
              className="bg-[#931cf5] text-white px-4 py-2 rounded hover:bg-[#7b17cc]"
            >
              Add Sponsor
            </button>
          </div>
        </div>

        {/* Current Sponsors List */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Current Sponsors</h3>
          
          {/* University Partners */}
          <div className="mb-6">
            <h4 className="text-md font-medium mb-2">University Partners</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sponsors.filter(s => s.category === 'university').map(sponsor => (
                <div key={sponsor.id} className="border p-4 rounded flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="relative w-16 h-16">
                      <Image
                        src={sponsor.imageUrl}
                        alt={sponsor.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div>
                      <p className="font-medium">{sponsor.name}</p>
                      <a href={sponsor.websiteUrl} target="_blank" rel="noopener noreferrer" 
                         className="text-sm text-blue-500 hover:underline">
                        Website
                      </a>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveSponsor(sponsor.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Corporate Sponsors */}
          <div>
            <h4 className="text-md font-medium mb-2">Corporate Sponsors</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sponsors.filter(s => s.category === 'corporate').map(sponsor => (
                <div key={sponsor.id} className="border p-4 rounded flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="relative w-16 h-16">
                      <Image
                        src={sponsor.imageUrl}
                        alt={sponsor.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div>
                      <p className="font-medium">{sponsor.name}</p>
                      <a href={sponsor.websiteUrl} target="_blank" rel="noopener noreferrer" 
                         className="text-sm text-blue-500 hover:underline">
                        Website
                      </a>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveSponsor(sponsor.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={handleSave}
            className="bg-[#931cf5] text-white px-6 py-2 rounded hover:bg-[#7b17cc]"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
} 