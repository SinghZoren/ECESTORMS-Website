import { SlideDefinition } from '../types';
import { FaFileAlt, FaMapMarkedAlt, FaVideo } from 'react-icons/fa';

const pillars = [
  {
    icon: FaFileAlt,
    title: 'Exam & Lab Bank',
    description: 'Curated assessments, lab walkthroughs, and practice packs to help you master every milestone.',
    highlight: 'Master the Fundamentals',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: FaMapMarkedAlt,
    title: 'Course Pathways',
    description: 'Interactive roadmaps and planning guides so every term feels intentional and stress free.',
    highlight: 'Plan Every Term',
    color: 'from-emerald-500 to-green-500',
  },
  {
    icon: FaVideo,
    title: 'Tutorial Series',
    description: 'Upper-year mentors translate complex topics into practical, project-ready walkthroughs.',
    highlight: 'Learn from Peers',
    color: 'from-purple-500 to-pink-500',
  },
];

const resourcesSlide: SlideDefinition = {
  id: 'resources',
  render: () => (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a]" />
      <div className="absolute inset-0 bg-black/50" />

      <div className="relative z-10 w-full max-w-6xl px-10 py-12 text-white">
        <div className="text-center mb-10">
          <h2 className="text-5xl font-black uppercase tracking-tight md:text-6xl lg:text-7xl">
            Academic <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">Resources</span>
          </h2>
          <p className="mx-auto mt-6 max-w-3xl text-xl text-white/90 md:text-2xl font-medium">
            Student-curated materials to help you succeed in ECE courses
          </p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {pillars.map(({ icon: Icon, title, description, highlight, color }) => (
            <div
              key={title}
              className="group relative flex h-full flex-col items-center justify-start gap-5 overflow-hidden rounded-3xl border-2 border-white/20 bg-gradient-to-br from-white/10 to-white/5 p-8 text-center backdrop-blur transition-all duration-300 hover:scale-105 hover:border-white/40"
            >
              <div className={`inline-flex h-18 w-18 items-center justify-center rounded-2xl bg-gradient-to-br ${color} p-5 shadow-xl`}>
                <Icon className="text-3xl text-white" />
              </div>
              <span className="inline-flex min-h-[32px] items-center justify-center rounded-full bg-white/10 px-5 py-1 text-xs font-bold uppercase tracking-wider text-[#f7ce46]">
                {highlight}
              </span>
              <h3 className="text-2xl font-black text-white">{title}</h3>
              <p className="text-base text-white/80 leading-relaxed">{description}</p>
            </div>
          ))}
        </div>

        <p className="mt-12 text-center text-white/70 text-base md:text-lg">
          Visit ecestorms.ca/resources for the full collection.
        </p>
      </div>
    </div>
  ),
};

export default resourcesSlide;
