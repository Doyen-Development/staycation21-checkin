'use client'
import { useRef, useState } from 'react'
import { Upload, CheckCircle, X, Loader2 } from 'lucide-react'
import clsx from 'clsx'
import { useUploadThing } from '@/lib/uploadthing-client'

interface Props {
  label: string
  hint?: string
  value?: string | null      // uploaded URL
  onChange: (url: string | null) => void
}

export default function FileUpload({ label, hint, value, onChange }: Props) {
  const ref = useRef<HTMLInputElement>(null)
  const [drag, setDrag] = useState(false)
  const [fileName, setFileName] = useState('')

  const { startUpload, isUploading } = useUploadThing('idDocument', {
    onClientUploadComplete: (res) => {
      const url = res?.[0]?.url
      if (url) onChange(url)
      else {
        alert('Upload failed — no file URL returned. Please try again.')
        setFileName('')
      }
    },
    onUploadError: (err) => {
      console.error('Uploadthing error:', err)
      alert(`Upload failed: ${err.message}`)
      setFileName('')
    },
  })

  const handleFile = async (file: File) => {
    if (file.size > 4 * 1024 * 1024) { alert('File too large — max 4 MB'); return }
    setFileName(file.name)
    await startUpload([file])
  }

  return (
    <div>
      <input
        ref={ref} type="file" className="hidden"
        accept="image/jpeg,image/png,image/webp,application/pdf"
        onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])}
      />
      <div
        onClick={() => !value && !isUploading && ref.current?.click()}
        onDragOver={e  => { e.preventDefault(); setDrag(true) }}
        onDragLeave={()  => setDrag(false)}
        onDrop={e => { e.preventDefault(); setDrag(false); e.dataTransfer.files[0] && handleFile(e.dataTransfer.files[0]) }}
        className={clsx('upload-area', {
          'filled':                !!value,
          'border-brand/50 bg-brand/[0.02]': drag,
          'cursor-wait':           isUploading,
        })}
      >
        {isUploading ? (
          <div className="py-2 flex flex-col items-center gap-2">
            <Loader2 size={20} className="text-brand animate-spin" />
            <p className="text-xs text-gray-400">Uploading {fileName}…</p>
          </div>
        ) : value ? (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <CheckCircle size={16} className="text-green-600" />
            </div>
            <div className="flex-1 text-left min-w-0">
              <p className="text-xs font-medium text-gray-800 truncate">{fileName || label}</p>
              <p className="text-[10px] text-green-600 mt-0.5">Uploaded successfully</p>
            </div>
            <button
              type="button"
              onClick={e => { e.stopPropagation(); onChange(null); setFileName(''); if (ref.current) ref.current.value = '' }}
              className="w-6 h-6 rounded-full bg-gray-100 hover:bg-red-100 flex items-center justify-center transition-colors"
            >
              <X size={11} className="text-gray-400" />
            </button>
          </div>
        ) : (
          <div className="py-1">
            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Upload size={14} className="text-gray-400" />
            </div>
            <p className="text-xs font-medium text-gray-700 mb-0.5">{label}</p>
            {hint && <p className="text-[10px] text-gray-400 mb-1.5">{hint}</p>}
            <p className="text-[10px] text-gray-300">JPG · PNG · PDF · max 4 MB</p>
          </div>
        )}
      </div>
    </div>
  )
}
