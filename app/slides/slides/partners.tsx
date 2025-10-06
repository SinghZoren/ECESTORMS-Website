'use client';

import { SlideDefinition } from '../types';
import { FaBusAlt, FaUsersCog, FaHandshake, FaGift } from 'react-icons/fa';

const highlights = [
  {
    icon: FaBusAlt,
    title: 'Industry Tours',
    description: 'Guided visits to labs, design houses, and partner offices so students can see engineering in action.',
    badge: 'Site Experiences',
    color: 'from-indigo-500 to-blue-500',
  },
  {
    icon: FaUsersCog,
    title: 'Professional Events',
    description: 'Panels, portfolio showcases, and networking nights that connect members with practicing engineers and recruiters.',
    badge: 'Career Momentum',
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: FaHandshake,
    title: 'Business Collaborations',
    description: 'Exclusive partnerships offer students project support, discounted services, and prototyping resources.',
    badge: 'Member Perks',
    color: 'from-orange-500 to-amber-500',
  },
];

const partnersSlide: SlideDefinition = {
  id: 'partners',
  render: () => (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#040014] via-[#12054b] to-[#040014]" />

      <div className="relative z-10 w-full max-w-6xl px-10 py-12 text-white">
        <div className="text-center mb-10">
          <h2 className="text-5xl font-black uppercase tracking-tight md:text-6xl lg:text-7xl">
            Industry Connections
          </h2>
          <p className="mx-auto mt-6 max-w-3xl text-xl text-white/90 md:text-2xl font-medium">
            Real-world tours, professional events, and collaborations that unlock opportunities for ECE students.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {highlights.map(({ icon: Icon, title, description, badge, color }) => (
            <div
              key={title}
              className="group relative flex h-full flex-col items-center justify-start gap-5 overflow-hidden rounded-3xl border-2 border-white/20 bg-gradient-to-br from-white/10 to-white/5 p-6 text-center backdrop-blur transition-all duration-300 hover:scale-105 hover:border-white/40"
            >
              <div className={`inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${color} shadow-xl`}>
                <Icon className="text-white text-3xl" />
              </div>
              <span className="inline-flex items-center justify-center rounded-full bg-white/15 px-4 py-1 text-xs font-bold uppercase tracking-wider text-white">
                {badge}
              </span>
              <h3 className="text-xl font-black text-white">{title}</h3>
              <p className="text-white/80 text-sm leading-relaxed">{description}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-3xl border-2 border-white/20 bg-gradient-to-br from-white/10 to-white/5 p-8 backdrop-blur">
          <div className="flex flex-col items-center gap-6 md:flex-row md:items-center md:justify-between">
            <div className="text-center md:text-left">
              <h3 className="flex items-center justify-center gap-2 text-2xl font-bold text-white md:justify-start">
                <FaGift className="text-[#f7ce46]" />
                Sponsorships That Invest in Students
              </h3>
              <p className="mt-2 max-w-xl text-sm text-white/75 leading-relaxed">
                From discounted lab rentals to hardware credits and product demos, our partners help students experiment, prototype,
                and launch ambitious projects without the financial barrier.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};

export default partnersSlide;
