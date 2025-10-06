import { SlideDefinition } from '../types';

const resourcesSlide: SlideDefinition = {
  id: 'resources',
  render: () => (
    <div className="relative flex h-full w-full items-center justify-center">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a]" />
      <div className="absolute inset-0 bg-black/50" />

      <div className="relative z-10 w-full max-w-5xl px-10 py-12 text-white">
        <div className="grid gap-10 md:grid-cols-[1.2fr_1fr] md:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white/70">
              Study smarter
            </span>
            <h2 className="mt-6 text-4xl font-black uppercase tracking-tight md:text-5xl lg:text-6xl">
              Academic Resources
            </h2>
            <p className="mt-6 text-lg text-white/85 md:text-xl">
              Curated by students, for students. Everything you need to navigate the Electrical and Computer Engineering curriculum at TMU.
            </p>
            <div className="mt-10 space-y-6">
              {[
                {
                  title: 'Exam & Lab Bank',
                  description: 'Access 200+ past assessments, lab solutions, and practice material organized by course.',
                },
                {
                  title: 'Course Pathways',
                  description: 'Interactive prerequisite maps and study guides to help plan every term with confidence.',
                },
                {
                  title: 'Tutorial Series',
                  description: 'Upper-year mentors host deep dives into circuits, embedded systems, software, and more.',
                },
              ].map(({ title, description }) => (
                <div key={title} className="rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur">
                  <h3 className="text-xl font-semibold text-[#f7ce46]">{title}</h3>
                  <p className="mt-3 text-white/85 text-sm md:text-base">{description}</p>
                </div>
              ))}
            </div>
            <div className="mt-10 inline-flex items-center gap-3 rounded-full border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold uppercase tracking-wider shadow-lg backdrop-blur">
              Explore everything at ecestorms.ca/resources
            </div>
          </div>

          <div className="relative">
            <div className="absolute -top-10 right-6 h-32 w-32 rounded-full bg-[#f7ce46]/40 blur-3xl" />
            <div className="absolute bottom-10 left-0 h-32 w-32 rounded-full bg-[#a855f7]/40 blur-3xl" />
            <div className="relative overflow-hidden rounded-[36px] border border-white/10 bg-white/5 shadow-2xl">
              <img
                src="/images/Logo.png"
                alt="ECESTORMS Resources"
                className="h-full w-full object-contain p-10"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};

export default resourcesSlide;
