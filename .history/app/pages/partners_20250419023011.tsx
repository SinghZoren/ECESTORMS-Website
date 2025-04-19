import React from 'react';
import Image from 'next/image';
import Footer from '../components/Footer';

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
              {/* Placeholder for TMU Logo */}
              <PartnerLogo
                src="/images/partners/tmu-logo.png"
                alt="Toronto Metropolitan University"
                href="https://www.torontomu.ca/"
              />
              {/* Placeholder for Faculty Logo */}
              <PartnerLogo
                src="/images/partners/faculty-logo.png"
                alt="Faculty of Engineering"
                href="https://www.torontomu.ca/engineering-architectural-science/"
              />
              {/* Placeholder for Another University Partner */}
              <PartnerLogo
                src="/images/partners/department-logo.png"
                alt="Department Logo"
                href="#"
              />
            </div>
          </section>

          {/* Corporate Sponsors Section */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-8 text-center">
              Corporate Sponsors
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {/* Add corporate sponsor logos here */}
              <PartnerLogo
                src="/images/partners/national-bank.png"
                alt="National Bank"
                href="https://www.nbc.ca/"
                width={200}
                height={100}
              />
              <PartnerLogo
                src="/images/partners/fat-bastard.png"
                alt="Fat Bastard Burrito"
                href="https://fatbastardburrito.ca/"
                width={200}
                height={100}
              />
              <PartnerLogo
                src="/images/partners/peo.png"
                alt="Professional Engineers Ontario"
                href="https://www.peo.on.ca/"
                width={200}
                height={100}
              />
              <PartnerLogo
                src="/images/partners/solidworks.png"
                alt="SolidWorks"
                href="https://www.solidworks.com/"
                width={200}
                height={100}
              />
              <PartnerLogo
                src="/images/partners/redbull.png"
                alt="Red Bull"
                href="https://www.redbull.com/"
                width={200}
                height={100}
              />
              <PartnerLogo
                src="/images/partners/joni.png"
                alt="Joni"
                href="https://www.joni.com/"
                width={200}
                height={100}
              />
              <PartnerLogo
                src="/images/partners/bateman.png"
                alt="Bateman's Bicycle Company"
                href="https://www.batemansbikeco.com/"
                width={200}
                height={100}
              />
              <PartnerLogo
                src="/images/partners/bboyz.png"
                alt="B Boyz"
                href="#"
                width={200}
                height={100}
              />
            </div>
          </section>
        </main>
      </div>
      <Footer />
    </div>
  );
} 