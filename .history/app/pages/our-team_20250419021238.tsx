import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { FaLinkedin } from 'react-icons/fa';
import Footer from '../components/Footer';
import { TeamMember } from '../data/teamMembers';

// Team member card component
const TeamMemberCard = ({ member }: { member: TeamMember }) => {
  return (
    <div className="bg-white shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1 w-full">
      <div className="relative w-full aspect-square bg-gray-200">
        {member.imageUrl && (
          <Image
            src={member.imageUrl}
            alt={`${member.name} - ${member.position}`}
            fill
            className="object-cover"
          />
        )}
      </div>
      <div className="p-4">
        <h3 className="text-xl font-bold text-gray-900">{member.name}</h3>
        <p className="text-[#931cf5] font-medium mb-2">{member.position}</p>
        {member.linkedinUrl && (
          <a 
            href={member.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1 bg-[#0072b1] text-white py-1 px-3 rounded hover:bg-[#005b8f] transition-colors"
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
    <div className="mb-12 w-full">
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 border-b-2 border-[#f7ce46] pb-2 text-center">
        {title}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {members.map((member, index) => (
          <TeamMemberCard key={index} member={member} />
        ))}
      </div>
    </div>
  );
};

export default function OurTeam() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const response = await fetch('/api/getTeamMembers');
        if (!response.ok) {
          throw new Error('Failed to fetch team members');
        }
        const data = await response.json();
        setTeamMembers(data.teamMembers);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching team members:', err);
        setError('Failed to load team members');
        setLoading(false);
      }
    };

    fetchTeamMembers();
  }, []);

  // Filter team members by section
  const presidents = teamMembers.filter(member => member.section === 'presidents');
  const vps = teamMembers.filter(member => member.section === 'vps');
  const directors = teamMembers.filter(member => member.section === 'directors');
  const yearReps = teamMembers.filter(member => member.section === 'yearReps');

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-[#4A154B]">
        <div className="flex-grow flex items-center justify-center">
          <div className="text-white text-xl">Loading team members...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen bg-[#4A154B]">
        <div className="flex-grow flex items-center justify-center">
          <div className="text-white text-xl bg-red-500/80 p-4 rounded-lg">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#4A154B]">
      <div className="flex-grow pt-[1%]">
        <main className="container mx-auto px-[4%] py-[5%]">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-[4%] text-center">
            Our Team
          </h1>
          <div className="max-w-[90%] mx-auto flex flex-col items-center">
            
            {/* Presidents */}
            {presidents.length > 0 && <TeamSection title="Presidents" members={presidents} />}
            
            {/* Vice Presidents */}
            {vps.length > 0 && <TeamSection title="Vice Presidents" members={vps} />}
            
            {/* Directors */}
            {directors.length > 0 && <TeamSection title="Directors" members={directors} />}
            
            {/* Year Representatives */}
            {yearReps.length > 0 && <TeamSection title="Year Representatives" members={yearReps} />}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
} 