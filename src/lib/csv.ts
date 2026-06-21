export function toCSV(rows: any[]): string {
  const headers = [
    'ID','Status','Submitted At',
    'First Name','Last Name','Email','Phone','City','State',
    'Check-in','Check-out','Booking Source','Booking ID','Purpose','Guests','Special Requests',
    'G1 Name','G1 ID Type','G1 ID Number',
    'G2 Name','G2 ID Type','G2 ID Number',
    'G3 Name','G3 ID Type','G3 ID Number',
    'G4 Name','G4 ID Type','G4 ID Number',
    'G5 Name','G5 ID Type','G5 ID Number',
    'G6 Name','G6 ID Type','G6 ID Number',
  ]
  const csv = rows.map(r => {
    const base = [
      r.id, r.status, r.submittedAt,
      r.firstName, r.lastName, r.email, r.phone, r.city || '', r.state || '',
      r.checkinDate, r.checkoutDate, r.bookingSource || 'airbnb', r.bookingId || '',
      r.purposeOfVisit || '', r.guestCount, r.specialRequests || '',
    ]
    const guests = r.guestIds || []
    for (let i = 0; i < 6; i++) {
      const g = guests[i]
      base.push(g?.guestName || '', g?.idType || '', g?.idNumber || '')
    }
    return base.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')
  })
  return [headers.join(','), ...csv].join('\n')
}

export function downloadCSV(content: string, name: string) {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a')
  a.href = url; a.download = name; a.click()
  URL.revokeObjectURL(url)
}
