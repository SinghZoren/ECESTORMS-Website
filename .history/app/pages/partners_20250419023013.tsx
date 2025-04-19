import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Footer from '../components/Footer';
import { Sponsor } from '../components/SponsorsModal';

// Partner logo component with link
const PartnerLogo = ({ 
  src, 
  alt, 
  href, 
  width = 250,
  height = 120 
}: { 
  src: string; 
  alt: string; 
  href: string;
  width?: number;
  height?: number;
}) => (
  <a 
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="block transition-transform hover:-translate-y-1 hover:shadow-lg p-4 bg-white rounded-lg"
  >
    <div className="relative" style={{ width, height }}>
      <Image
        src={src}
        alt={alt}
        fill
        className="object-contain"
      />
    </div>
  </a>
);

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
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#931cf5]"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#4A154B]">
      <div className="flex-grow">
        <main className="container mx-auto px-4 py-16">
          {/* Main Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-white text-center mb-12">
            Our Partners
          </h1>

          {/* Description */}
          <div className="text-white text-center max-w-3xl mx-auto mb-16">
            <p className="mb-4">
              In order to provide all the services we offer, we have support from many partners within the community. 
              Whether it be through financial donations, to products and services, MUES welcomes every opportunity for partnership.
            </p>
            <p>
              Thank you to our partners below for helping our society reach new heights. 
              Click their logo to be redirected to their webpages to learn more about them!
            </p>
          </div>

          {/* University Partners Section */}
          <section className="mb-20">
            <h2 className="text-2xl font-bold text-white mb-8 text-center">
              University Partners
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {sponsors
                .filter(sponsor => sponsor.category === 'university')
                .map(sponsor => (
                  <a
                    key={sponsor.id}
                    href={sponsor.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white rounded-lg p-6 flex items-center justify-center transform hover:scale-105 transition-transform duration-200"
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
          </section>

          {/* Corporate Sponsors Section */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-8 text-center">
              Corporate Sponsors
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {sponsors
                .filter(sponsor => sponsor.category === 'corporate')
                .map(sponsor => (
                  <a
                    key={sponsor.id}
                    href={sponsor.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white rounded-lg p-6 flex items-center justify-center transform hover:scale-105 transition-transform duration-200"
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
          </section>
        </main>
      </div>
      <Footer />
    </div>
  );
} 