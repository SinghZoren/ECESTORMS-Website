import { SlideDefinition } from '../types';

const partnersSlide: SlideDefinition = {
  id: 'partners',
  render: () => (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
      <img
        src="/images/partners/1745044402286-TMU-rgb.png"
        alt="Partner highlight background"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-[#040014]/90 via-[#12054b]/85 to-[#040014]/90" />

      <div className="relative z-10 flex w-full max-w-5xl flex-col gap-12 px-10 py-12 md:flex-row md:items-center">
        <div className="flex-1 text-white">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white/80">
            Industry & Partners
          </span>
          <h2 className="mt-6 text-4xl font-black uppercase tracking-tight md:text-5xl lg:text-6xl">
            Bridging Academia & Industry
          </h2>
          <p className="mt-6 text-lg text-white/85 md:text-xl">
            Together with faculty, alumni, and corporate partners, we create meaningful experiential learning and
            professional opportunities for ECE students.
          </p>
          <div className="mt-10 space-y-6">
            {[
              {
                title: 'Faculty Collaborations',
                description: 'Joint initiatives with TMU FEAS and MUES delivering interdisciplinary programming.',
              },
              {
                title: 'Corporate Partnerships',
                description: 'Technical workshops, sponsorships, and recruiting events with leading tech companies.',
              },
              {
                title: 'Support for Projects',
                description: 'Funding and mentorship for competition teams, capstone projects, and student ventures.',
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
          <div className="grid w-full max-w-[420px] gap-4 rounded-[36px] border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-md">
            {[
              '/images/partners/1745044402286-TMU-rgb.png',
              '/images/partners/1745044435876-TMU-FEAS-rgb-(1).png',
              '/images/partners/1745044465880-MUES_Horizontal_Purple.png',
              '/images/partners/1745291473484-tmu-logo-full-colour.jpg',
            ].map((logo) => (
              <div key={logo} className="flex items-center justify-center rounded-2xl bg-white/80 p-4">
                <img src={logo} alt="Partner logo" className="max-h-16 w-auto object-contain" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  ),
};

export default partnersSlide;
