import React from 'react';
import Image from 'next/image';
import { FaLinkedin } from 'react-icons/fa';
import Footer from '../components/Footer';

// Team member interface
interface TeamMember {
  name: string;
  position: string;
  imageUrl: string;
  linkedinUrl?: string;
}

// Team members data
const executiveMembers: TeamMember[] = [
  { name: 'Name 1', position: 'Co-President', imageUrl: '/images/placeholder-headshot.png', linkedinUrl: 'https://linkedin.com/' },
  { name: 'Name 2', position: 'Co-President', imageUrl: '/images/placeholder-headshot.png', linkedinUrl: 'https://linkedin.com/' },
];

const vpMembers: TeamMember[] = [
  { name: 'Name 3', position: 'VP Academic', imageUrl: '/images/placeholder-headshot.png', linkedinUrl: 'https://linkedin.com/' },
  { name: 'Name 4', position: 'VP Student Life', imageUrl: '/images/placeholder-headshot.png', linkedinUrl: 'https://linkedin.com/' },
  { name: 'Name 5', position: 'VP Professional Development', imageUrl: '/images/placeholder-headshot.png', linkedinUrl: 'https://linkedin.com/' },
  { name: 'Name 6', position: 'VP Marketing', imageUrl: '/images/placeholder-headshot.png', linkedinUrl: 'https://linkedin.com/' },
  { name: 'Name 7', position: 'VP Operations', imageUrl: '/images/placeholder-headshot.png', linkedinUrl: 'https://linkedin.com/' },
  { name: 'Name 8', position: 'VP Finance & Sponsorship', imageUrl: '/images/placeholder-headshot.png', linkedinUrl: 'https://linkedin.com/' },
];

const directorMembers: TeamMember[] = [
  { name: 'Name 9', position: 'Events Director', imageUrl: '/images/placeholder-headshot.png', linkedinUrl: 'https://linkedin.com/' },
  { name: 'Name 10', position: 'Marketing Director', imageUrl: '/images/placeholder-headshot.png', linkedinUrl: 'https://linkedin.com/' },
  { name: 'Name 11', position: 'Merchandise Director', imageUrl: '/images/placeholder-headshot.png', linkedinUrl: 'https://linkedin.com/' },
  { name: 'Name 12', position: 'Outreach Director', imageUrl: '/images/placeholder-headshot.png', linkedinUrl: 'https://linkedin.com/' },
  { name: 'Name 13', position: 'Corporate Relations Director', imageUrl: '/images/placeholder-headshot.png', linkedinUrl: 'https://linkedin.com/' },
  { name: 'Name 14', position: 'Webmaster', imageUrl: '/images/placeholder-headshot.png', linkedinUrl: 'https://linkedin.com/' },
];

const yearRepMembers: TeamMember[] = [
  { name: 'Name 15', position: 'First Year Rep', imageUrl: '/images/placeholder-headshot.png', linkedinUrl: 'https://linkedin.com/' },
  { name: 'Name 16', position: 'Second Year Rep', imageUrl: '/images/placeholder-headshot.png', linkedinUrl: 'https://linkedin.com/' },
  { name: 'Name 17', position: 'Third Year Rep', imageUrl: '/images/placeholder-headshot.png', linkedinUrl: 'https://linkedin.com/' },
  { name: 'Name 18', position: 'Fourth Year Rep', imageUrl: '/images/placeholder-headshot.png', linkedinUrl: 'https://linkedin.com/' },
];

// Team member card component
const TeamMemberCard = ({ member }: { member: TeamMember }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1">
      <div className="relative h-[25vh] w-full bg-gray-200">
        {member.imageUrl && (
          <Image
            src={member.imageUrl}
            alt={`${member.name} - ${member.position}`}
            fill
            className="object-cover"
          />
        )}
      </div>
      <div className="p-[5%]">
        <h3 className="text-xl font-bold text-gray-900">{member.name}</h3>
        <p className="text-[#931cf5] font-medium mb-[4%]">{member.position}</p>
        {member.linkedinUrl && (
          <a 
            href={member.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-[2%] bg-[#0072b1] text-white py-[2%] px-[5%] rounded hover:bg-[#005b8f] transition-colors"
          >
            <FaLinkedin className="text-lg" />
          </a>
        )}
      </div>
    </div>
  );
};

// Team section component
const TeamSection = ({ title, members }: { title: string, members: TeamMember[] }) => {
  return (
    <div className="mb-[8%]">
      <h2 className="text-2xl md:text-3xl font-bold text-[#4A154B] mb-[3%] border-b-2 border-[#931cf5] pb-[1%] text-center">
        {title}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[4%] justify-items-center">
        {members.map((member, index) => (
          <TeamMemberCard key={index} member={member} />
        ))}
      </div>
    </div>
  );
};

export default function OurTeam() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow bg-gradient-to-b from-white to-gray-100 pt-[1%]">
        <main className="container mx-auto px-[4%] py-[5%]">
          <h1 className="text-4xl md:text-5xl font-bold text-[#931cf5] mb-[4%] text-center">
            Our Team
          </h1>
          <div className="max-w-[90%] mx-auto flex flex-col items-center">
            
            {/* Executive Team */}
            <TeamSection title="Presidents" members={executiveMembers} />
            
            {/* Vice Presidents */}
            <TeamSection title="Vice Presidents" members={vpMembers} />
            
            {/* Directors */}
            <TeamSection title="Directors" members={directorMembers} />
            
            {/* Year Representatives */}
            <TeamSection title="Year Representatives" members={yearRepMembers} />
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
} 