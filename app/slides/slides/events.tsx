import { SlideDefinition } from '../types';

const eventsSlide: SlideDefinition = {
  id: 'events',
  render: () => (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
      <img
        src="/images/campus3.jpg"
        alt="Conference room background"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-black/65" />

      <div className="relative z-10 flex w-full max-w-[1100px] flex-col gap-12 px-10 py-12 md:flex-row md:items-center">
        <div className="flex-1 text-white">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white/80">
            Flagship Programs
          </span>
          <h2 className="mt-6 text-4xl font-black uppercase tracking-tight md:text-5xl lg:text-6xl">
            Signature Events
          </h2>
          <p className="mt-6 text-lg text-white/85 md:text-xl">
            High-impact student experiences connecting learners, alumni, and industry partners across the ECE ecosystem.
          </p>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {[
              {
                title: 'Industry Conference',
                description: 'Annual symposium featuring leading tech companies, alumni panels, and keynotes.',
              },
              {
                title: 'Hack The Block',
                description: 'A hybrid hardware/software hackathon with mentorship from industry engineers.',
              },
              {
                title: 'Lightning Talks',
                description: 'Rapid-fire presentations showcasing cutting-edge projects and research.',
              },
              {
                title: 'Skills Accelerator',
                description: 'Hands-on workshops covering embedded systems, AI, entrepreneurship, and more.',
              },
            ].map(({ title, description }) => (
              <div key={title} className="rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur">
                <h3 className="text-xl font-semibold text-[#f7ce46]">{title}</h3>
                <p className="mt-3 text-white/85 text-sm md:text-base">{description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-1 items-center justify-center">
          <div className="relative w-full max-w-[480px] overflow-hidden rounded-[40px] border border-white/10 bg-white/10 shadow-2xl backdrop-blur-md">
            <img
              src="/images/campus2.jpg"
              alt="Students collaborating"
              className="h-full w-full object-cover"
            />
            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-3 rounded-full bg-black/60 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white">
              Experience the energy
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};

export default eventsSlide;
