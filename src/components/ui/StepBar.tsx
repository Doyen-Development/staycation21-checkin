'use client'
import { Check, User, Calendar, CreditCard, CheckCircle } from 'lucide-react'
import clsx from 'clsx'

const STEPS = [
  { label: 'Personal',    Icon: User },
  { label: 'Stay',        Icon: Calendar },
  { label: 'Guest IDs',   Icon: CreditCard },
  { label: 'Confirm',     Icon: CheckCircle },
]

export default function StepBar({ current }: { current: number }) {
  const pct = Math.round((current / (STEPS.length - 1)) * 100)
  return (
    <div className="bg-[#0a1830] px-4 py-5 rounded-b-2xl">
      <div className="relative flex justify-between items-start">
        {/* track */}
        <div className="absolute top-[13px] left-[13px] right-[13px] h-px bg-white/10" />
        <div className="absolute top-[13px] left-[13px] h-px bg-white/40 transition-all duration-500" style={{ width: `calc(${pct}% - 26px)` }} />

        {STEPS.map(({ label, Icon }, i) => {
          const done   = i < current
          const active = i === current
          return (
            <div key={label} className="flex flex-col items-center gap-2 z-10">
              <div className={clsx('w-7 h-7 rounded-full border flex items-center justify-center transition-all duration-300', {
                'bg-white border-white text-brand shadow-sm': active,
                'bg-white/15 border-white/40 text-white':    done,
                'bg-transparent border-white/15 text-white/25': !active && !done,
              })}>
                {done ? <Check size={12} strokeWidth={2.5} /> : <Icon size={12} />}
              </div>
              <span className={clsx('text-[10px] whitespace-nowrap transition-colors duration-300', {
                'text-white font-semibold':  active,
                'text-white/40':             done,
                'text-white/20':             !active && !done,
              })}>{label}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
