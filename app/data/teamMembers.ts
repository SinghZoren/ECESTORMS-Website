export interface TeamMember {
  id: string;
  name: string;
  position: string;
  imageUrl: string;
  linkedinUrl?: string;
  section: 'presidents' | 'vps' | 'directors' | 'yearReps';
}

// Export team members data in a format that's easy to extract with regex
export const defaultTeamMembers: TeamMember[] = [
  {
    "id": "pres1",
    "name": "Name 1",
    "position": "Co-President",
    "imageUrl": "https://ecestorms-website-database.s3.amazonaws.com/team/pres1.jpg",
    "linkedinUrl": "https://www.linkedin.com/",
    "section": "presidents"
  },
  {
    "id": "pres2",
    "name": "Name 2",
    "position": "Co-President",
    "imageUrl": "/images/placeholder-headshot.png",
    "linkedinUrl": "https://linkedin.com/",
    "section": "presidents"
  },
  {
    "id": "vp1",
    "name": "Name 3",
    "position": "VP Academic",
    "imageUrl": "/images/placeholder-headshot.png",
    "linkedinUrl": "https://linkedin.com/",
    "section": "vps"
  },
  {
    "id": "vp6",
    "name": "Name 8",
    "position": "VP Finance & Sponsorship",
    "imageUrl": "/images/placeholder-headshot.png",
    "linkedinUrl": "https://linkedin.com/",
    "section": "vps"
  },
  {
    "id": "vp4",
    "name": "Name 6",
    "position": "VP Marketing",
    "imageUrl": "/images/placeholder-headshot.png",
    "linkedinUrl": "https://linkedin.com/",
    "section": "vps"
  },
  {
    "id": "vp5",
    "name": "Name 7",
    "position": "VP Operations",
    "imageUrl": "/images/placeholder-headshot.png",
    "linkedinUrl": "https://linkedin.com/",
    "section": "vps"
  },
  {
    "id": "vp3",
    "name": "Name 5",
    "position": "VP Professional Development",
    "imageUrl": "/images/placeholder-headshot.png",
    "linkedinUrl": "https://linkedin.com/",
    "section": "vps"
  },
  {
    "id": "vp2",
    "name": "Name 4",
    "position": "VP Student Life",
    "imageUrl": "/images/placeholder-headshot.png",
    "linkedinUrl": "https://linkedin.com/",
    "section": "vps"
  },
  {
    "id": "dir5",
    "name": "Name 13",
    "position": "Corporate Relations Director",
    "imageUrl": "/images/placeholder-headshot.png",
    "linkedinUrl": "https://linkedin.com/",
    "section": "directors"
  },
  {
    "id": "dir1",
    "name": "Name 9",
    "position": "Events Director",
    "imageUrl": "/images/placeholder-headshot.png",
    "linkedinUrl": "https://linkedin.com/",
    "section": "directors"
  },
  {
    "id": "dir2",
    "name": "Name 10",
    "position": "Marketing Director",
    "imageUrl": "/images/placeholder-headshot.png",
    "linkedinUrl": "https://linkedin.com/",
    "section": "directors"
  },
  {
    "id": "dir3",
    "name": "Name 11",
    "position": "Merchandise Director",
    "imageUrl": "/images/placeholder-headshot.png",
    "linkedinUrl": "https://linkedin.com/",
    "section": "directors"
  },
  {
    "id": "dir4",
    "name": "Name 12",
    "position": "Outreach Director",
    "imageUrl": "/images/placeholder-headshot.png",
    "linkedinUrl": "https://linkedin.com/",
    "section": "directors"
  },
  {
    "id": "dir6",
    "name": "Name 14",
    "position": "Webmaster",
    "imageUrl": "/images/placeholder-headshot.png",
    "linkedinUrl": "https://linkedin.com/",
    "section": "directors"
  },
  {
    "id": "year1",
    "name": "Name 15",
    "position": "First Year Rep",
    "imageUrl": "/images/placeholder-headshot.png",
    "linkedinUrl": "https://linkedin.com/",
    "section": "yearReps"
  },
  {
    "id": "year2",
    "name": "Name 16",
    "position": "Second Year Rep",
    "imageUrl": "/images/placeholder-headshot.png",
    "linkedinUrl": "https://linkedin.com/",
    "section": "yearReps"
  },
  {
    "id": "year3",
    "name": "Name 17",
    "position": "Third Year Rep",
    "imageUrl": "/images/placeholder-headshot.png",
    "linkedinUrl": "https://linkedin.com/",
    "section": "yearReps"
  },
  {
    "id": "year4",
    "name": "Name 18",
    "position": "Fourth Year Rep",
    "imageUrl": "/images/placeholder-headshot.png",
    "linkedinUrl": "https://linkedin.com/",
    "section": "yearReps"
  },
];

// Current team members (reference to the default ones)
export const teamMembers = defaultTeamMembers;