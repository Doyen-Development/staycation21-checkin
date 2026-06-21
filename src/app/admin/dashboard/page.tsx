'use client'
import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { getAdminToken, clearAdminToken } from '@/lib/auth'
import { toCSV, downloadCSV } from '@/lib/csv'
import { STATUS_CONFIG, ID_LABELS, CheckinStatus, BOOKING_SOURCE_LABELS, BookingSource } from '@/types'
import { format } from 'date-fns'
import clsx from 'clsx'
import {
  LogOut, Download, Search, RefreshCw,
  Users, Calendar, CheckCircle, Clock,
  Eye, X, ExternalLink, TrendingUp, ChevronRight,
} from 'lucide-react'

export default function AdminDashboard() {
  const router  = useRouter()
  const [data,   setData]   = useState<any[]>([])
  const [busy,   setBusy]   = useState(true)
  const [search, setSearch] = useState('')
  const [range,  setRange]  = useState('all')
  const [status, setStatus] = useState('all')
  const [sel,    setSel]    = useState<any>(null)
  const [updId,  setUpdId]  = useState<string|null>(null)

  const token = typeof window !== 'undefined' ? getAdminToken() : null

  const load = useCallback(async () => {
    if (!token) { router.push('/admin'); return }
    setBusy(true)
    const p = new URLSearchParams({ range, status, search })
    const r = await fetch(`/api/admin?${p}`, { headers: { 'x-admin-token': token } })
    if (r.status === 401) { clearAdminToken(); router.push('/admin'); return }
    const j = await r.json()
    setData(j.data || [])
    setBusy(false)
  }, [token, range, status, search, router])

  useEffect(() => { load() }, [load])

  const patch = async (id: string, s: CheckinStatus) => {
    setUpdId(id)
    await fetch('/api/admin', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'x-admin-token': token! },
      body: JSON.stringify({ id, status: s }),
    })
    setUpdId(null)
    if (sel?.id === id) setSel((p: any) => ({ ...p, status: s }))
    load()
  }

  const exportCsv = () => {
    const label = range === 'today' ? format(new Date(), 'yyyy-MM-dd') : range
    downloadCSV(toCSV(data), `staycation21_${label}_${Date.now()}.csv`)
  }

  const stats = {
    total:    data.length,
    pending:  data.filter(d => d.status === 'pending').length,
    inHouse:  data.filter(d => d.status === 'checked_in').length,
    upcoming: data.filter(d => new Date(d.checkinDate) >= new Date()).length,
  }

  return (
    <div className="min-h-screen bg-[#EEF0F6]">
      {/* Nav */}
      <header className="bg-brand sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 bg-white/10 border border-white/20 rounded-lg flex items-center justify-center">
              <span className="text-white text-[10px] font-bold">S21</span>
            </div>
            <div>
              <p className="text-white text-sm font-semibold">Staycation21</p>
              <p className="text-white/35 text-[10px]">Admin dashboard</p>
            </div>
          </div>
          <button onClick={() => { clearAdminToken(); router.push('/admin') }}
            className="flex items-center gap-1.5 text-white/40 hover:text-white/70 text-xs transition-colors">
            <LogOut size={12} /> Sign out
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-5 space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Total check-ins', value: stats.total,    Icon: Users,        col: 'text-brand' },
            { label: 'Pending review',  value: stats.pending,  Icon: Clock,        col: 'text-amber-500' },
            { label: 'In-house now',    value: stats.inHouse,  Icon: CheckCircle,  col: 'text-green-500' },
            { label: 'Upcoming',        value: stats.upcoming, Icon: TrendingUp,   col: 'text-blue-500' },
          ].map(({ label, value, Icon, col }) => (
            <div key={label} className="card px-5 py-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">{label}</p>
                <Icon size={14} className={col} />
              </div>
              <p className="text-2xl font-semibold text-gray-900">{value}</p>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="card px-4 py-3 flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="relative flex-1 max-w-xs">
            <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Name, email, booking ID…"
              className="inp pl-8 py-2 text-sm"
            />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {/* Date range tabs */}
            <div className="flex bg-gray-100 rounded-lg p-1 gap-0.5">
              {[['all','All'],['today','Today'],['week','Week'],['month','Month']].map(([v,l]) => (
                <button key={v} onClick={() => setRange(v)}
                  className={clsx('px-3 py-1 rounded-md text-xs font-medium transition-all', {
                    'bg-white text-gray-900 shadow-sm': range === v,
                    'text-gray-500 hover:text-gray-700': range !== v,
                  })}>{l}</button>
              ))}
            </div>
            <select value={status} onChange={e => setStatus(e.target.value)}
              className="inp py-1.5 text-xs w-auto">
              <option value="all">All status</option>
              {Object.entries(STATUS_CONFIG).map(([v, c]) => (
                <option key={v} value={v}>{c.label}</option>
              ))}
            </select>
            <button onClick={load} className="btn-ghost py-1.5 text-xs"><RefreshCw size={12} /></button>
            <button onClick={exportCsv} disabled={!data.length}
              className="btn-brand py-1.5 text-xs px-3">
              <Download size={12} /> Export CSV
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {['Guest','Booking ID','Check-in','Check-out','Guests','Status','Submitted',''].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {busy ? (
                  <tr><td colSpan={8} className="px-4 py-12 text-center">
                    <RefreshCw size={18} className="animate-spin mx-auto mb-2 text-gray-300" />
                    <p className="text-sm text-gray-400">Loading…</p>
                  </td></tr>
                ) : data.length === 0 ? (
                  <tr><td colSpan={8} className="px-4 py-12 text-center text-sm text-gray-400">No check-ins found</td></tr>
                ) : data.map((row: any) => (
                  <tr key={row.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">{row.firstName} {row.lastName}</p>
                      <p className="text-[11px] text-gray-400">{row.email}</p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[9px] font-semibold uppercase tracking-wide text-gray-400 bg-gray-50 border border-gray-100 px-1.5 py-0.5 rounded">
                          {BOOKING_SOURCE_LABELS[row.bookingSource as BookingSource] || 'Airbnb'}
                        </span>
                      </div>
                      <span className="font-mono text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded mt-1 inline-block">{row.bookingId || '—'}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">{row.checkinDate}</td>
                    <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">{row.checkoutDate}</td>
                    <td className="px-4 py-3 text-center font-semibold text-gray-800">{row.guestCount}</td>
                    <td className="px-4 py-3">
                      <select
                        value={row.status}
                        disabled={updId === row.id}
                        onChange={e => patch(row.id, e.target.value as CheckinStatus)}
                        className={clsx('text-xs font-semibold px-2.5 py-1 rounded-full border-0 outline-none cursor-pointer', STATUS_CONFIG[row.status as CheckinStatus]?.cls)}
                      >
                        {Object.entries(STATUS_CONFIG).map(([v, c]) => (
                          <option key={v} value={v}>{c.label}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-[11px] text-gray-400 whitespace-nowrap">
                      {row.submittedAt ? format(new Date(row.submittedAt), 'dd MMM, HH:mm') : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => setSel(row)}
                        className="flex items-center gap-1 text-xs text-brand hover:underline">
                        <Eye size={12} /> View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Detail slide-over */}
      {sel && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/30 backdrop-blur-[2px]" onClick={() => setSel(null)} />
          <div className="w-full max-w-sm bg-white shadow-xl overflow-y-auto">
            {/* Drawer header */}
            <div className="sticky top-0 bg-white border-b border-gray-100 px-5 py-4 flex items-center justify-between z-10">
              <div>
                <p className="font-semibold text-gray-900">{sel.firstName} {sel.lastName}</p>
                <p className="text-[11px] text-gray-400 mt-0.5 font-mono">
                  {BOOKING_SOURCE_LABELS[sel.bookingSource as BookingSource] || 'Airbnb'} · {sel.bookingId || '—'}
                </p>
              </div>
              <button onClick={() => setSel(null)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
                <X size={14} />
              </button>
            </div>

            <div className="p-5 space-y-5">
              {/* Status switcher */}
              <div>
                <p className="lbl mb-2">Status</p>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(STATUS_CONFIG).map(([v, c]) => (
                    <button key={v}
                      onClick={() => patch(sel.id, v as CheckinStatus)}
                      className={clsx('px-3 py-1.5 rounded-full text-xs font-semibold border transition-all', {
                        [c.cls + ' border-transparent']: sel.status === v,
                        'border-gray-200 text-gray-500 hover:border-gray-300 bg-white': sel.status !== v,
                      })}>{c.label}</button>
                  ))}
                </div>
              </div>

              <Sec title="Contact">
                <Row l="Email"  v={sel.email} />
                <Row l="Phone"  v={sel.phone} />
                <Row l="From"   v={[sel.city, sel.state].filter(Boolean).join(', ') || '—'} />
              </Sec>

              <Sec title="Stay">
                <Row l="Check-in"  v={sel.checkinDate} />
                <Row l="Check-out" v={sel.checkoutDate} />
                <Row l="Guests"    v={String(sel.guestCount)} />
                <Row l="Purpose"   v={sel.purposeOfVisit || '—'} />
                {sel.specialRequests && <Row l="Requests" v={sel.specialRequests} />}
              </Sec>

              {/* Guest IDs */}
              <div>
                <p className="lbl mb-2">Guest identities</p>
                <div className="space-y-2.5">
                  {(sel.guestIds || []).map((g: any, i: number) => (
                    <div key={i} className="border border-gray-100 rounded-xl overflow-hidden">
                      <div className="flex items-center gap-2.5 px-4 py-3 bg-gray-50">
                        <div className="w-5 h-5 rounded-full bg-brand/10 flex items-center justify-center text-[9px] font-bold text-brand">{i+1}</div>
                        <p className="text-sm font-medium text-gray-900">{g.guestName}</p>
                        {g.isPrimary && <span className="text-[9px] bg-brand/10 text-brand px-1.5 py-0.5 rounded-full font-semibold ml-auto">Primary</span>}
                      </div>
                      <div className="px-4 py-3 space-y-1.5">
                        <div className="flex justify-between text-[11px]">
                          <span className="text-gray-400">Type</span>
                          <span className="font-medium text-gray-700">{g.idType ? ID_LABELS[g.idType as keyof typeof ID_LABELS] : '—'}</span>
                        </div>
                        <div className="flex justify-between text-[11px]">
                          <span className="text-gray-400">Number</span>
                          <span className="font-mono font-medium text-gray-700">{g.idNumber}</span>
                        </div>
                        {(g.idFrontUrl || g.idBackUrl) && (
                          <div className="flex gap-2 pt-1">
                            {g.idFrontUrl && (
                              <a href={g.idFrontUrl} target="_blank" rel="noreferrer"
                                className="flex items-center gap-1 text-[11px] text-brand border border-brand/20 px-2.5 py-1 rounded-lg hover:bg-brand/5 transition-colors">
                                <ExternalLink size={10} /> Front
                              </a>
                            )}
                            {g.idBackUrl && (
                              <a href={g.idBackUrl} target="_blank" rel="noreferrer"
                                className="flex items-center gap-1 text-[11px] text-brand border border-brand/20 px-2.5 py-1 rounded-lg hover:bg-brand/5 transition-colors">
                                <ExternalLink size={10} /> Back
                              </a>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <p className="text-center text-[10px] text-gray-300">
                Submitted {sel.submittedAt ? format(new Date(sel.submittedAt), "dd MMM yyyy 'at' HH:mm") : '—'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function Sec({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="lbl mb-2">{title}</p>
      <div className="bg-gray-50 rounded-xl divide-y divide-gray-100 border border-gray-100">{children}</div>
    </div>
  )
}
function Row({ l, v }: { l: string; v: string }) {
  return (
    <div className="flex justify-between items-start px-4 py-2.5 gap-4">
      <span className="text-[11px] text-gray-400 flex-shrink-0">{l}</span>
      <span className="text-[11px] font-medium text-gray-700 text-right break-all">{v}</span>
    </div>
  )
}
