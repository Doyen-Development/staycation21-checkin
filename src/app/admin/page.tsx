'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { setAdminToken } from '@/lib/auth'
import { Lock, Eye, EyeOff } from 'lucide-react'

export default function AdminLogin() {
  const [token, setToken] = useState('')
  const [show, setShow]   = useState(false)
  const [err, setErr]     = useState('')
  const [busy, setBusy]   = useState(false)
  const router = useRouter()

  const login = async (e: React.FormEvent) => {
    e.preventDefault(); setBusy(true); setErr('')
    const res = await fetch('/api/admin?range=today&status=all', {
      headers: { 'x-admin-token': token },
    }).catch(() => null)
    if (!res || res.status === 401) { setErr('Incorrect token. Please try again.'); setBusy(false); return }
    setAdminToken(token)
    router.push('/admin/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-brand rounded-xl flex items-center justify-center mx-auto mb-4 shadow-sm">
            <span className="text-white text-sm font-bold">S21</span>
          </div>
          <h1 className="text-xl font-semibold text-gray-900">Admin panel</h1>
          <p className="text-sm text-gray-400 mt-1">Staycation21 · Sonipat, Haryana</p>
        </div>
        <div className="card">
          <form onSubmit={login} className="p-6 space-y-4">
            <div>
              <label className="lbl">Access token</label>
              <div className="relative">
                <Lock size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={show ? 'text' : 'password'}
                  value={token} onChange={e => setToken(e.target.value)}
                  className="inp pl-9 pr-9"
                  placeholder="Enter your admin token"
                  autoComplete="current-password"
                />
                <button type="button" onClick={() => setShow(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {show ? <EyeOff size={13} /> : <Eye size={13} />}
                </button>
              </div>
              {err && <p className="err">{err}</p>}
            </div>
            <button type="submit" disabled={!token || busy} className="btn-brand w-full py-2.5">
              {busy
                ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : 'Sign in'}
            </button>
          </form>
        </div>
        <p className="text-center text-[11px] text-gray-400 mt-5">
          Token set as <code className="bg-white px-1.5 py-0.5 rounded border border-gray-200 text-gray-600">ADMIN_SECRET_TOKEN</code> in Vercel env vars
        </p>
      </div>
    </div>
  )
}
