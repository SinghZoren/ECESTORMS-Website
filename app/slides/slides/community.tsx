import { SlideDefinition } from '../types';

const communitySlide: SlideDefinition = {
  id: 'community',
  render: () => (
    <div className="relative flex h-full w-full items-center justify-center">
      <div className="absolute inset-0 bg-gradient-to-br from-[#050f2c] via-[#102347] to-[#000915]" />
      <div className="absolute inset-0 bg-black/55" />

      <div className="relative z-10 max-w-4xl px-10 py-12 text-center text-white">
        <h2 className="text-4xl font-black uppercase tracking-tight md:text-5xl">
          Community & Support
        </h2>
        <p className="mx-auto mt-6 max-w-3xl text-lg text-white/85 md:text-xl">
          We foster a vibrant engineering community built on mentorship, collaboration, and inclusion.
        </p>
        <div className="mt-10 grid gap-6 text-left md:grid-cols-3">
          {[
            {
              title: 'Workshops & Study Sessions',
              description: '50+ academic and technical workshops tailored to every year of study.',
            },
            {
              title: 'Mentorship Network',
              description: 'Peer-to-peer mentoring to help you thrive academically and professionally.',
            },
            {
              title: 'Inclusive Programming',
              description: 'Events and resources for transfer, international, and first-year students.',
            },
          ].map(({ title, description }) => (
            <div key={title} className="rounded-2xl border border-white/10 bg-white/10 p-6 backdrop-blur">
              <h3 className="text-xl font-semibold text-[#f7ce46]">{title}</h3>
              <p className="mt-3 text-white/85 text-sm md:text-base">{description}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 inline-flex items-center gap-3 rounded-full border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold uppercase tracking-wider shadow-lg backdrop-blur">
          Building connections that last beyond graduation
        </div>
      </div>
    </div>
  ),
};

export default communitySlide;
