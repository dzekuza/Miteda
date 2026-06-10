/* ============================================================
   Miteda — data access layer (the backend seam).
   ES module (converted from _shared/repo.js IIFE).
   Flip BACKEND to "supabase" when the real backend is wired.
   ============================================================ */
import MD from './data.js'

const ok = (v) => Promise.resolve(v)
const clone = (v) => JSON.parse(JSON.stringify(v))

/* -------- DEMO adapter (in-memory; mutations persist for the session) -------- */
const demo = {
  // generic read: repo.list("defects")
  list: (name) => ok(clone(MD[name] || [])),
  get: (name, key, val) => ok(clone((MD[name] || []).find((x) => x[key] === val) || null)),

  // --- Defektai ---
  listDefects: () => ok(clone(MD.defects)),
  addDefect: ({ room, title, desc, apt, author }) => {
    const id = "DF-" + (105 + MD.defects.filter((d) => d.id.startsWith("DF-1")).length)
    const nd = { id, room, title, status: "open", date: "2026 06 10",
      apt: apt || MD.user.apt, author: author || MD.user.name, desc: desc || "—",
      thread: [{ who: author || MD.user.name, role: "Gyventojas", text: desc || title, time: "06 10 · dabar" }] }
    MD.defects.unshift(nd)
    return ok(clone(nd))
  },
  addDefectReply: (id, text, who = MD.user.name, role = "Gyventojas") => {
    const d = MD.defects.find((x) => x.id === id)
    if (d) d.thread.push({ who, role, text, time: "06 10 · dabar" })
    return ok(d ? clone(d) : null)
  },
  setDefectStatus: (id, status) => {
    const d = MD.defects.find((x) => x.id === id)
    if (d) d.status = status
    return ok(d ? clone(d) : null)
  },

  // --- Sutartys ---
  listContracts: () => ok(clone(MD.contracts)),
  signContract: (svc) => {
    const c = MD.contracts.find((x) => x.svc === svc)
    if (c) c.status = "signed"
    return ok(c ? clone(c) : null)
  },

  // --- Skelbimai / Bendruomenė ---
  listBulletin: () => ok(clone(MD.bulletin)),
  addBulletin: (n) => {
    const item = { ...n, who: MD.user.name + " · " + MD.user.apt, time: "Ką tik" }
    MD.bulletin.unshift(item)
    return ok(clone(item))
  },
  listThreads: () => ok(clone(MD.threads)),

  // --- Objektai (admin) ---
  listProperties: () => ok(clone(MD.properties)),
  addProperty: (p) => { MD.properties.push(p); return ok(clone(p)) },
  listAdminDefects: () => ok(clone(MD.adminDefects)),

  // --- Kontaktai ---
  listContacts: () => ok(clone(MD.contacts)),
  saveContact: (c, index) => {
    if (index == null) MD.contacts.push(c); else MD.contacts[index] = c
    return ok(clone(c))
  },

  // --- Darbų eiga / atnaujinimai ---
  listBroadcasts: () => ok(clone(MD.broadcasts)),
  addBroadcast: (b) => { MD.broadcasts.unshift(b); return ok(clone(b)) },
  listRepairUpdates: () => ok(clone(MD.repair.updates)),
  addRepairUpdate: (u) => { MD.repair.updates.unshift(u); return ok(clone(u)) },
  getRepair: () => ok(clone(MD.repair)),

  // --- Projektai (admin) ---
  listProjects: () => ok(clone(MD.projects)),

  // --- Statyba: darbininko pokalbis ---
  listWorkerChat: () => ok(clone(MD.workerChat)),
  addWorkerMessage: (m) => { MD.workerChat.push(m); return ok(clone(m)) },

  // --- session/profile ---
  currentUser: () => ok(clone(MD.user)),
  currentRole: () => ok("gyventojas"),
  building: () => ok(clone(MD.building)),
  saveProfile: (patch) => { Object.assign(MD.user, patch); return ok(clone(MD.user)) },
}

/* -------- SUPABASE adapter (stub — implement when wiring backend) -------- */
const supabaseAdapter = new Proxy({}, {
  get: (_, name) => () => Promise.reject(
    new Error(`repo.${String(name)}: Supabase adapter not implemented — see BACKEND.md`)
  ),
})

const BACKEND = 'demo' // 'demo' | 'supabase'
export default BACKEND === 'supabase' ? supabaseAdapter : demo
