import { SlideDefinition } from '../types';
import { FaGraduationCap, FaHandsHelping, FaGlobe, FaHeart, FaChalkboardTeacher, FaUsers } from 'react-icons/fa';

const communitySlide: SlideDefinition = {
  id: 'community',
  render: () => (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#050f2c] via-[#102347] to-[#000915]" />
      <div className="absolute inset-0 bg-black/55" />

      <div className="relative z-10 max-w-6xl px-10 py-12 text-white">
        <div className="text-center">
          <h2 className="text-5xl font-black uppercase tracking-tight md:text-6xl bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Community & Support
          </h2>
          <p className="mx-auto mt-6 max-w-3xl text-xl text-white/85 md:text-2xl font-medium">
            A student-run community fostering mentorship, collaboration, and inclusion
          </p>
        </div>

        <div className="mt-12 grid gap-6 text-left md:grid-cols-3">
          {[{
              icon: FaChalkboardTeacher,
              title: 'Study Halls & Mock Midterms',
              description: 'Collaborative prep spaces with peers walking through practice problems and exam strategies together.',
              highlight: 'Focused Preparation',
              color: 'from-blue-500 to-cyan-500'
            },
            {
              icon: FaHandsHelping,
              title: 'Professional Events',
              description: 'Workshops and panels centered on building your portfolio, resume, and interview confidence with alumni support.',
              highlight: 'Career Building',
              color: 'from-purple-500 to-pink-500'
            },
            {
              icon: FaGlobe,
              title: 'Social Events & Support',
              description: 'Meet new friends, find mentors, and recharge through relaxed hangouts, wellness nights, and team traditions.',
              highlight: 'Community Connections',
              color: 'from-pink-500 to-rose-500'
            }
          ].map(({ icon: Icon, title, description, highlight, color }) => (
            <div key={title} className="relative overflow-hidden rounded-3xl border border-white/20 bg-gradient-to-br from-white/10 to-white/5 p-6 backdrop-blur">
              <div className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${color} mb-4 shadow-lg`}>
                <Icon className="text-white text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
              <p className="text-white/75 text-sm md:text-base leading-relaxed mb-4">{description}</p>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-[#f7ce46]">
                {highlight}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[{
              icon: FaHeart,
              label: 'Academic Momentum',
              subtitle: 'Peer-led study halls and exam prep support.'
            },
            {
              icon: FaGraduationCap,
              label: 'Career Readiness',
              subtitle: 'Portfolio-building events with industry guidance.'
            },
            {
              icon: FaUsers,
              label: 'Community & Wellness',
              subtitle: 'Spaces to connect, recharge, and support one another.'
            }
          ].map(({ icon: Icon, label, subtitle }) => (
            <div key={label} className="rounded-2xl border border-white/20 bg-white/5 backdrop-blur p-6 text-center">
              <Icon className="text-3xl text-[#f7ce46] mx-auto mb-3" />
              <div className="text-lg font-semibold uppercase tracking-wide text-white">{label}</div>
              <p className="mt-2 text-sm text-white/70 leading-relaxed">{subtitle}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
};

export default communitySlide;
