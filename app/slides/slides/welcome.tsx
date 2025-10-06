import { SlideDefinition } from '../types';
import { FaLightbulb, FaUsers, FaBookOpen, FaBriefcase, FaHandshake } from 'react-icons/fa';

const supportHighlights = [
  {
    icon: FaBookOpen,
    label: 'Academic Support',
    accent: 'text-[#f7ce46]',
  },
  {
    icon: FaBriefcase,
    label: 'Professional Growth',
    accent: 'text-blue-400',
  },
  {
    icon: FaHandshake,
    label: 'Social Community',
    accent: 'text-purple-400',
  },
];

const welcomeSlide: SlideDefinition = {
  id: 'welcome',
  render: () => (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#1d0040] via-[#420a78] to-[#1d0040]" />
      <div className="absolute inset-0 bg-black/40" />

      <div className="relative z-10 flex w-full max-w-[1300px] flex-col gap-12 px-10 py-12 md:flex-row md:items-center">
        <div className="flex-1 text-white">

          <h1 className="text-5xl font-black uppercase tracking-tight text-white drop-shadow-lg md:text-6xl lg:text-7xl bg-gradient-to-r from-white to-white/80 bg-clip-text">
            Welcome to<br/>
            <span className="bg-gradient-to-r from-[#f7ce46] via-purple-400 to-[#f7ce46] bg-clip-text text-transparent">ECESTORMS</span>
          </h1>

          <p className="mt-6 text-xl font-semibold text-white/90 md:text-2xl">
            Electrical & Computer Engineering Course Union at Toronto Metropolitan University
          </p>

          <div className="mt-10 space-y-5">
            {[ 
              { icon: FaLightbulb, text: 'Course Union for ECE students', color: 'text-yellow-400' },
              { icon: FaUsers, text: 'Supporting 1,200+ ECE students every year', color: 'text-blue-400' }
            ].map(({ icon: Icon, text, color }) => (
              <div key={text} className="flex items-center gap-4 group">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-white/10 backdrop-blur border border-white/20 group-hover:bg-white/20 transition-all duration-300">
                  <Icon className={`text-xl ${color}`} />
                </div>
                <span className="text-lg md:text-xl text-white/90 font-medium">{text}</span>
              </div>
            ))}
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-3">
            {supportHighlights.map(({ icon: Icon, label, accent }) => (
              <div
                key={label}
                className="flex flex-col items-center justify-center rounded-3xl border border-white/20 bg-white/5 px-6 py-8 text-center shadow-[0_20px_40px_-20px_rgba(0,0,0,0.6)] backdrop-blur"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
                  <Icon className={`text-2xl ${accent}`} />
                </div>
                <span className="mt-5 text-sm font-semibold uppercase tracking-wide text-white/90">
                  {label}
                </span>
                <span className="mt-4 h-1 w-12 rounded-full bg-white/25" />
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-1 items-center justify-center">
          <div className="relative w-full max-w-[520px]">
            <div className="absolute -top-10 -right-10 h-48 w-48 rounded-full bg-[#f7ce46]/30 blur-3xl" />
            <div className="absolute -bottom-10 -left-10 h-48 w-48 rounded-full bg-purple-500/30 blur-3xl" />
            <div className="relative overflow-hidden rounded-3xl border-2 border-white/20 bg-gradient-to-br from-white/10 to-white/5 p-8 shadow-2xl backdrop-blur-md">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5" />
              <div className="relative flex items-center justify-center">
                <img
                  src="/images/Logo.png"
                  alt="ECESTORMS Logo"
                  className="h-auto w-72 drop-shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};

export default welcomeSlide;
