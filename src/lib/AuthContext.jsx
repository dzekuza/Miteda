import React, { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

// Demo user — replace with real Supabase auth when backend is wired
const DEMO_USER = {
  id: 'demo-user-1',
  name: 'Lukas Petrauskas',
  email: 'lukas.petrauskas@gmail.com',
  role: 'gyventojas', // gyventojas | admin | statyba
  organization_id: 'demo-org-1',
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(DEMO_USER)
  const [loading] = useState(false)

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
