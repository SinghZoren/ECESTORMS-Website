import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Sponsor } from '../components/SponsorsModal';

export default function Partners() {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSponsors = async () => {
      try {
        const response = await fetch('/api/getSponsors');
        if (!response.ok) {
          throw new Error('Failed to fetch sponsors');
        }
        const data = await response.json();
        setSponsors(data.sponsors);
      } catch (error) {
        console.error('Error fetching sponsors:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSponsors();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#441949] text-white py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">Our Partners</h1>
        
        <p className="text-center mb-12 max-w-3xl mx-auto">
        </p>
        
        <p className="text-center mb-16">
        </p>

        {/* University Partners Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-semibold text-center mb-8">University Partners</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {sponsors
              .filter(sponsor => sponsor.category === 'university')
              .map(sponsor => (
                <a
                  key={sponsor.id}
                  href={sponsor.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white p-6 flex items-center justify-center transform hover:scale-105 transition-transform duration-200"
                >
                  <div className="relative w-full h-40">
                    <Image
                      src={sponsor.imageUrl}
                      alt={sponsor.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                </a>
              ))}
          </div>
        </div>

        {/* Corporate Sponsors Section */}
        <div>
          <h2 className="text-3xl font-semibold text-center mb-8">Corporate Sponsors</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {sponsors
              .filter(sponsor => sponsor.category === 'corporate')
              .map(sponsor => (
                <a
                  key={sponsor.id}
                  href={sponsor.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white p-6 flex items-center justify-center transform hover:scale-105 transition-transform duration-200"
                >
                  <div className="relative w-full h-32">
                    <Image
                      src={sponsor.imageUrl}
                      alt={sponsor.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                </a>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
} 