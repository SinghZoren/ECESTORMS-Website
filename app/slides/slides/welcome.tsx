import { SlideDefinition } from '../types';

const welcomeSlide: SlideDefinition = {
  id: 'welcome',
  render: () => (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#1d0040] via-[#420a78] to-[#1d0040]" />
      <div className="absolute inset-0 bg-black/40" />

      <div className="relative z-10 flex w-full max-w-[1200px] flex-col gap-12 px-10 py-12 md:flex-row md:items-center">
        <div className="flex-1 text-white">
          <h1 className="text-4xl font-black uppercase tracking-tight text-white drop-shadow-lg md:text-5xl lg:text-6xl">
            Welcome to ECESTORMS
          </h1>
          <p className="mt-6 text-lg font-medium text-white/90 md:text-xl">
            Electrical & Computer Engineering Course Union
          </p>
          <ul className="mt-8 space-y-4 text-lg text-white/85 md:text-xl">
            {[ 
              'Student-led leadership & innovation',
              'Empowering over 1,200 TMU ECE students',
              'Collaborative culture for engineering excellence'
            ].map(point => (
              <li key={point} className="flex items-start gap-3">
                <span className="mt-1 h-2.5 w-2.5 flex-shrink-0 rounded-full bg-[#f7ce46] shadow-lg" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-1 items-center justify-center">
          <div className="relative w-full max-w-[520px] overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-md">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5" />
            <div className="relative flex items-center justify-center">
              <img
                src="/images/Logo.png"
                alt="ECESTORMS Logo"
                className="h-auto w-64"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};

export default welcomeSlide;
