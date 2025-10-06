import { SlideDefinition } from '../types';

const getInvolvedSlide: SlideDefinition = {
  id: 'get-involved',
  render: () => (
    <div className="relative flex h-full w-full items-center justify-center">
      <div className="absolute inset-0 bg-gradient-to-br from-[#000915] via-[#183b7a] to-[#000915]" />
      <div className="absolute inset-0 bg-black/50" />

      <div className="relative z-10 w-full max-w-5xl px-10 py-12 text-white">
        <div className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white/70">
            Join the movement
          </span>
          <h2 className="mt-6 text-4xl font-black uppercase tracking-tight md:text-5xl lg:text-6xl">
            Get Involved
          </h2>
          <p className="mx-auto mt-6 max-w-3xl text-lg text-white/85 md:text-xl">
            Whether you want to volunteer, lead, or launch something new, there’s a place for you at ECESTORMS.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            {
              title: 'Volunteer Squad',
              description: 'Support large-scale events, conference operations, and campus activations.',
            },
            {
              title: 'Mentor & Lead',
              description: 'Host workshops, mentor underclassmen, or spearhead an initiative that matters to you.',
            },
            {
              title: 'Pitch a Project',
              description: 'Bring forward ideas for hardware builds, competitions, or outreach programs and get support.',
            },
          ].map(({ title, description }) => (
            <div key={title} className="rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur">
              <h3 className="text-xl font-semibold text-[#f7ce46]">{title}</h3>
              <p className="mt-3 text-white/85 text-sm md:text-base">{description}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          {[
            {
              label: 'DM @ecestorms',
              href: 'https://instagram.com/ecestorms',
            },
            {
              label: 'Join our Discord',
              href: 'https://discord.gg/Bv9AZRcDJN',
            },
            {
              label: 'Email ecestorms@torontomu.ca',
              href: 'mailto:ecestorms@torontomu.ca',
            },
          ].map(({ label, href }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold uppercase tracking-wider text-white shadow-lg backdrop-blur transition hover:bg-white/20"
            >
              {label}
            </a>
          ))}
        </div>
      </div>
    </div>
  ),
};

export default getInvolvedSlide;
