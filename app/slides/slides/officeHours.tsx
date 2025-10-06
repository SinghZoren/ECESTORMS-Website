import { SlideDefinition } from '../types';

const officeHoursSlide: SlideDefinition = {
  id: 'office-hours',
  render: () => (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
      <img
        src="/images/campus.jpg"
        alt="ECE office space"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-[#0b1120]/90 via-[#1d3666]/80 to-[#0b1120]/90" />

      <div className="relative z-10 flex w-full max-w-5xl flex-col gap-12 px-10 py-12 md:flex-row md:items-center">
        <div className="flex-1 text-white">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white/70">
            Hangout hub
          </span>
          <h2 className="mt-6 text-4xl font-black uppercase tracking-tight md:text-5xl lg:text-6xl">
            Office Hours & Space
          </h2>
          <p className="mt-6 text-lg text-white/85 md:text-xl">
            Drop by, recharge, collaborate. Our campus space and community are here to support every step of your ECE journey.
          </p>
          <div className="mt-10 space-y-6">
            {[
              {
                title: 'Mentorship on Demand',
                description: 'Executive team members and mentors ready to help with academics, career, or project questions.',
              },
              {
                title: 'Hardware Playground',
                description: 'Access microcontrollers, soldering stations, and lab equipment to prototype your ideas.',
              },
              {
                title: 'Community Lounge',
                description: 'Group study zones, snacks, and collaborative vibes open to all ECE students.',
              },
            ].map(({ title, description }) => (
              <div key={title} className="rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur">
                <h3 className="text-xl font-semibold text-[#f7ce46]">{title}</h3>
                <p className="mt-3 text-white/85 text-sm md:text-base">{description}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 inline-flex items-center gap-3 rounded-full border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold uppercase tracking-wider shadow-lg backdrop-blur">
            Located in KHE 040-G • Open daily 10AM - 6PM
          </div>
        </div>

        <div className="flex flex-1 items-center justify-center">
          <div className="relative w-full max-w-[420px] overflow-hidden rounded-[36px] border border-white/10 bg-white/5 shadow-2xl backdrop-blur-md">
            <img
              src="/images/campus2.jpg"
              alt="Students collaborating during office hours"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  ),
};

export default officeHoursSlide;
