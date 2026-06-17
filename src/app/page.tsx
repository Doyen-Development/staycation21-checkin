import CheckinFlow from '@/components/forms/CheckinFlow'
import { Shield, Wifi, MapPin, Clock } from 'lucide-react'

export default function Page() {
  return (
    <div className="min-h-screen">
      {/* Sticky nav */}
      <header className="bg-brand sticky top-0 z-50 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white/10 border border-white/20 rounded-lg flex items-center justify-center">
              <span className="text-white text-[11px] font-bold tracking-tight">S21</span>
            </div>
            <div>
              <p className="text-white text-sm font-semibold leading-tight">Staycation21</p>
              <p className="text-white/40 text-[10px] leading-tight">Sonipat, Haryana</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-white/40 text-[10px]">
            <Shield size={11} />
            <span>Secure · Encrypted</span>
          </div>
        </div>
      </header>

      {/* Hero */}
      <div className="bg-brand pt-8 pb-10">
        <div className="max-w-2xl mx-auto px-4">
          <div className="flex items-center gap-1.5 mb-3">
            <span className="w-1 h-1 rounded-full bg-white/30 inline-block" />
            <p className="text-white/35 text-[10px] tracking-[0.15em] uppercase font-medium">
              Online guest check-in
            </p>
          </div>
          <h1 className="text-white text-[26px] font-semibold leading-snug mb-2">
            Complete your check-in<br />before you arrive
          </h1>
          <p className="text-white/40 text-[13px] leading-relaxed mb-6 max-w-xs">
            Takes under 3 minutes. Submit once — your welcome instructions are sent immediately.
          </p>
          <div className="flex flex-wrap gap-2">
            {[
              [MapPin, 'Sonipat, Haryana'],
              [Clock,  'Check-in from 2:00 PM'],
              [Wifi,   'Free WiFi'],
            ].map(([Icon, label]: any) => (
              <div key={label} className="flex items-center gap-1.5 px-3 py-1.5 bg-white/[0.07] border border-white/10 rounded-full text-[11px] text-white/45">
                <Icon size={10} />{label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form area */}
      <div className="max-w-2xl mx-auto px-4 -mt-2 pb-20">
        <CheckinFlow />
      </div>

      <footer className="border-t border-gray-200 bg-white py-4">
        <p className="text-center text-[11px] text-gray-400">
          Staycation21 · Sonipat, Haryana · Powered by{' '}
          <span className="text-gray-500 font-medium">Stacklab Technologies</span>
        </p>
      </footer>
    </div>
  )
}
