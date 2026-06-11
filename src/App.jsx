import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './lib/AuthContext.jsx'

// Auth pages
import Login from './auth/Login.jsx'
import Register from './auth/Register.jsx'
import InviteAccept from './auth/InviteAccept.jsx'

// Landing
import Landing from './pages/Landing.jsx'

// Owner pages (gyventojas)
import OwnerPagrindinis from './pages/owner/Pagrindinis.jsx'
import OwnerDefektai from './pages/owner/Defektai.jsx'
import OwnerNuotraukos from './pages/owner/Nuotraukos.jsx'
import OwnerSutartys from './pages/owner/Sutartys.jsx'
import OwnerKontaktai from './pages/owner/Kontaktai.jsx'
import OwnerTvarkarastis from './pages/owner/Tvarkarastis.jsx'
import OwnerSkelbimai from './pages/owner/Skelbimai.jsx'
import OwnerBendruomene from './pages/owner/Bendruomene.jsx'
import OwnerDarbai from './pages/owner/Darbai.jsx'
import OwnerNustatymai from './pages/owner/Nustatymai.jsx'
import OwnerZinutes from './pages/owner/Zinutes.jsx'

// Admin pages
import AdminObjektai from './pages/admin/Objektai.jsx'
import AdminObjektas from './pages/admin/Objektas.jsx'
import AdminDefektai from './pages/admin/Defektai.jsx'
import AdminKontaktai from './pages/admin/Kontaktai.jsx'
import AdminGyventojas from './pages/admin/Gyventojas.jsx'
import AdminSpecialistas from './pages/admin/Specialistas.jsx'
import AdminDarbai from './pages/admin/Darbai.jsx'
import AdminDarbuEiga from './pages/admin/DarbuEiga.jsx'
import AdminZinutes from './pages/admin/Zinutes.jsx'
import AdminBendruomene from './pages/admin/Bendruomene.jsx'

// Statyba pages
import StatybaVadovas from './pages/statyba/Vadovas.jsx'
import StatybaDarbininkas from './pages/statyba/Darbininkas.jsx'

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/invite" element={<InviteAccept />} />

        {/* Owner */}
        <Route path="/owner/pagrindinis" element={<OwnerPagrindinis />} />
        <Route path="/owner/defektai" element={<OwnerDefektai />} />
        <Route path="/owner/nuotraukos" element={<OwnerNuotraukos />} />
        <Route path="/owner/sutartys" element={<OwnerSutartys />} />
        <Route path="/owner/kontaktai" element={<OwnerKontaktai />} />
        <Route path="/owner/tvarkarastis" element={<OwnerTvarkarastis />} />
        <Route path="/owner/skelbimai" element={<OwnerSkelbimai />} />
        <Route path="/owner/bendruomene" element={<OwnerBendruomene />} />
        <Route path="/owner/darbai" element={<OwnerDarbai />} />
        <Route path="/owner/nustatymai" element={<OwnerNustatymai />} />
        <Route path="/owner/zinutes" element={<OwnerZinutes />} />

        {/* Admin */}
        <Route path="/admin/objektai" element={<AdminObjektai />} />
        <Route path="/admin/objektas" element={<AdminObjektas />} />
        <Route path="/admin/defektai" element={<AdminDefektai />} />
        <Route path="/admin/kontaktai" element={<AdminKontaktai />} />
        <Route path="/admin/gyventojas/:slug" element={<AdminGyventojas />} />
        <Route path="/admin/specialistas/:slug" element={<AdminSpecialistas />} />
        <Route path="/admin/darbai" element={<AdminDarbai />} />
        <Route path="/admin/darbu-eiga" element={<AdminDarbuEiga />} />
        <Route path="/admin/zinutes" element={<AdminZinutes />} />
        <Route path="/admin/bendruomene" element={<AdminBendruomene />} />

        {/* Statyba */}
        <Route path="/statyba/vadovas" element={<StatybaVadovas />} />
        <Route path="/statyba/darbininkas" element={<StatybaDarbininkas />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  )
}
