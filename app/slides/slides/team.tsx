import { SlideDefinition } from '../types';

const teamSlide: SlideDefinition = {
  id: 'team',
  render: () => (
    <div className="relative flex h-full w-full items-center justify-center">
      <div className="absolute inset-0 bg-gradient-to-br from-[#000510] via-[#29104b] to-[#000510]" />
      <div className="absolute inset-0 bg-black/55" />

      <div className="relative z-10 w-full max-w-5xl px-10 py-12 text-white">
        <div className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white/70">
            Leadership
          </span>
          <h2 className="mt-6 text-4xl font-black uppercase tracking-tight md:text-5xl lg:text-6xl">
            Our Team
          </h2>
          <p className="mx-auto mt-6 max-w-3xl text-lg text-white/85 md:text-xl">
            A multidisciplinary executive council, directors, and year representatives powering initiatives across the ECE community.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            {
              title: 'Executive Council',
              description: 'Presidents, VPs, and Advisors setting vision and supporting every portfolio.',
            },
            {
              title: 'Directors & Leads',
              description: 'Operations, outreach, finance, design, and technical leads running day-to-day programs.',
            },
            {
              title: 'Year Representatives',
              description: '20+ advocates ensuring every cohort has a voice and support network.',
            },
          ].map(({ title, description }) => (
            <div key={title} className="rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur">
              <h3 className="text-xl font-semibold text-[#f7ce46]">{title}</h3>
              <p className="mt-3 text-white/85 text-sm md:text-base">{description}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4 text-sm uppercase tracking-widest text-white/60">
          {['Community', 'Innovation', 'Mentorship', 'Support', 'Representation'].map((value) => (
            <span key={value} className="rounded-full border border-white/20 px-4 py-2">
              {value}
            </span>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <a
            href="/our-team"
            className="inline-flex items-center gap-3 rounded-full border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold uppercase tracking-wider text-white shadow-lg backdrop-blur transition hover:bg-white/20"
          >
            Meet the full executive
          </a>
        </div>
      </div>
    </div>
  ),
};

export default teamSlide;
