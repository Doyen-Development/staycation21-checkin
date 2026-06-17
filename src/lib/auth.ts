export const getAdminToken  = () => typeof window !== 'undefined' ? localStorage.getItem('s21_admin') : null
export const setAdminToken  = (t: string) => localStorage.setItem('s21_admin', t)
export const clearAdminToken = () => localStorage.removeItem('s21_admin')
