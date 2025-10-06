import { SlideDefinition } from '../types';
import { FaInstagram, FaDiscord, FaEnvelope } from 'react-icons/fa';

const getInvolvedSlide: SlideDefinition = {
  id: 'get-involved',
  render: () => (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#000915] via-[#183b7a] to-[#000915]" />
      <div className="absolute inset-0 bg-black/50" />

      <div className="relative z-10 w-full max-w-6xl px-10 py-12 text-white">
        <div className="text-center mb-10">
          <h2 className="text-5xl font-black uppercase tracking-tight md:text-6xl lg:text-7xl">
            Follow <span className="bg-gradient-to-r from-green-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent">ECESTORMS</span>
          </h2>
          <p className="mx-auto mt-6 max-w-3xl text-xl text-white/90 md:text-2xl font-medium">
            Stay updated with events, resources, and opportunities — scan to connect!
          </p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {[{ icon: FaInstagram, label: '@ecestorms', sublabel: 'Instagram', color: 'from-pink-500 to-rose-500', href: 'https://instagram.com/ecestorms' },
            { icon: FaDiscord, label: 'Discord Server', sublabel: '500+ Students', color: 'from-indigo-500 to-blue-500', href: 'https://discord.gg/Bv9AZRcDJN' },
            { icon: FaEnvelope, label: 'ecestorms@torontomu.ca', sublabel: 'Email', color: 'from-green-500 to-emerald-500', href: 'mailto:ecestorms@torontomu.ca' }
          ].map(({ icon: Icon, label, sublabel, color, href }) => (
            <div
              key={label}
              className="relative flex flex-col items-center overflow-hidden rounded-3xl border-2 border-white/20 bg-gradient-to-br from-white/10 to-white/5 p-8 text-center backdrop-blur"
            >
              <div className={`inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${color} shadow-xl`}>
                <Icon className="text-white text-3xl" />
              </div>

              <div className="mt-6 mx-auto h-48 w-48 overflow-hidden rounded-2xl bg-white p-4 shadow-2xl">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(href)}`}
                  alt={`QR code for ${label}`}
                  className="h-full w-full object-contain"
                />
              </div>

              <h4 className="mt-4 text-lg font-black text-white">{label}</h4>
              <p className="text-sm text-white/70 uppercase tracking-wide">{sublabel}</p>
            </div>
          ))}
        </div>

        <p className="mt-12 text-center text-white/70 text-base md:text-lg">
          Scan any QR code above to connect with ECESTORMS online.
        </p>
      </div>
    </div>
  ),
};

export default getInvolvedSlide;
