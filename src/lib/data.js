/* ============================================================
   Miteda — demo duomenys (lietuviškai). Visi fiktyvūs.
   ES module (converted from _shared/data.js IIFE).
   ============================================================ */

const MD = {};

MD.building = { name: "Kalnų Terasos", address: "Kalnų g. 14, Vilnius", apt: "B-12" };
MD.user = { name: "Lukas Petrauskas", email: "lukas.petrauskas@gmail.com", phone: "+370 612 34567", apt: "B-12" };

/* ---- Pranešimai / skelbimų lenta (dashboard) ---- */
MD.notices = [
  { tone: "urgent", cat: "Skubu", catTone: "urgent",
    title: "Karšto vandens atjungimas birželio 12 d.",
    body: "Karštas vanduo bus išjungtas nuo 9:00 iki 14:00 dėl planinės priežiūros.",
    date: "2026 06 10" },
  { tone: "flat", cat: "Taisyklės", catTone: "neutral",
    title: "Priminimas dėl automobilių statymo",
    body: "Kiekvienam savininkui skirta po vieną vietą. Prašome laikytis tvarkos.",
    date: "2026 06 06" },
  { tone: "flat", cat: "Valymas", catTone: "neutral",
    title: "Laiptinės valymas kas penktadienį",
    body: "Laiptinė valoma kiekvieną penktadienį, 8:00–10:00.",
    date: "2026 05 16" },
];

/* ---- Žinutės ---- */
MD.messages = [
  { name: "Greta Janušienė", preview: "Ačiū, kad taip greitai sutaisėte domofoną!", unread: false, time: "9:24" },
  { name: "Tomas Petraitis", preview: "Ar galėtume įrengti dar vieną dviračių stovą?", unread: true, time: "8:05" },
  { name: "Rūta Kazlauskaitė", preview: "Liftas vėl kelia keistą garsą.", unread: true, time: "Vakar" },
  { name: "Pastato administratorius", preview: "Priminimas: vandens atjungimas ketvirtadienį.", unread: false, time: "Pirm." },
];

/* ---- Defektai ---- */
MD.defectStatuses = {
  open: { label: "Atviras", tone: "urgent" },
  progress: { label: "Vykdoma", tone: "event" },
  resolved: { label: "Išspręsta", tone: "success" },
};
MD.defects = [
  { id: "DF-104", room: "Vonios kambarys", title: "Praleidžia vamzdis po kriaukle",
    status: "progress", date: "2026 06 08", apt: "B-12", author: "Lukas Petrauskas",
    desc: "Po praustuvu kaupiasi vanduo, sandariklis atrodo pažeistas.",
    thread: [
      { who: "Lukas Petrauskas", role: "Gyventojas", text: "Užfiksavau pratekėjimą šįryt, pridėjau nuotrauką.", time: "06 08 · 8:10" },
      { who: "Administratorius", role: "Administracija", text: "Ačiū, perdaviau santechnikui Mariui. Atvyks rytoj 10–12 val.", time: "06 08 · 9:30" },
      { who: "Marius (santechnikas)", role: "Meistras", text: "Reikės pakeisti sifoną, detalė užsakyta.", time: "06 09 · 11:05" },
    ] },
  { id: "DF-103", room: "Koridorius", title: "Neužsidaro lauko durys",
    status: "open", date: "2026 06 07", apt: "B-12", author: "Lukas Petrauskas",
    desc: "Durų spyna stringa, reikia pajėgti uždaryti.",
    thread: [ { who: "Lukas Petrauskas", role: "Gyventojas", text: "Durys neužsidaro iki galo.", time: "06 07 · 19:40" } ] },
  { id: "DF-101", room: "Svetainė", title: "Įtrūkimas sienoje prie lango",
    status: "resolved", date: "2026 05 28", apt: "B-12", author: "Lukas Petrauskas",
    desc: "Plonas įtrūkimas tinkę, apie 30 cm.",
    thread: [
      { who: "Lukas Petrauskas", role: "Gyventojas", text: "Pastebėjau įtrūkimą po žiemos.", time: "05 28 · 12:00" },
      { who: "Administratorius", role: "Administracija", text: "Užglaistyta ir nudažyta. Uždarome.", time: "06 02 · 15:20" },
    ] },
];

/* ---- Nuotraukų albumai ---- */
MD.photoAlbums = [
  { name: "Statybos eiga", count: 24, colors: ["#9bb7a4", "#c2b59b", "#8fa6b8", "#b7a99b"] },
  { name: "Galutinė apžiūra", count: 12, colors: ["#a9b89b", "#b8a99b", "#9ba9b8", "#c2bda0"] },
  { name: "Bendrosios erdvės", count: 18, colors: ["#aeb8a0", "#b6a8a0", "#a0aeb8", "#bdb59c"] },
  { name: "Aplinka ir kiemas", count: 9, colors: ["#9db89f", "#bdb39a", "#9aabb9", "#b3b29d"] },
];

/* ---- Sutartys ---- */
MD.contracts = [
  { svc: "Elektra", provider: "Ignitis", icon: "ph ph-lightning", status: "signed", num: "EL-2026-0142", sum: "€38.20/mėn" },
  { svc: "Vanduo", provider: "Vilniaus vandenys", icon: "ph ph-drop", status: "signed", num: "VV-2026-088", sum: "€21.40/mėn" },
  { svc: "Šildymas", provider: "Vilniaus šilumos tinklai", icon: "ph ph-thermometer", status: "pending", num: "ŠT-2026-0310", sum: "€84.40/mėn" },
  { svc: "Atliekų išvežimas", provider: "Ecoservice", icon: "ph ph-trash", status: "action", num: "—", sum: "€7.90/mėn" },
];
MD.contractStatuses = {
  signed: { label: "Pasirašyta", tone: "success" },
  pending: { label: "Laukiama", tone: "event" },
  action: { label: "Reikia veiksmo", tone: "urgent" },
};

/* ---- Kontaktai ---- */
MD.contactCats = ["Visi", "Administracija", "Santechnika", "Elektra", "Valymas", "Apsauga"];
MD.contacts = [
  { name: "Aistė Vasiliauskienė", role: "Pastato administratorė", company: "Miteda", cat: "Administracija", phone: "+370 600 11223", email: "aiste@miteda.lt", objektai: ["Kalnų Terasos", "Žvejų Namai", "Pušyno Kvartalas", "Saulės Slėnis"] },
  { name: "Marius Stankus", role: "Santechnikas", company: "Akva Servisas", cat: "Santechnika", phone: "+370 611 55667", email: "marius@akva.lt", objektai: ["Kalnų Terasos", "Pušyno Kvartalas"] },
  { name: "Darius Kavaliauskas", role: "Elektrikas", company: "ElektroMB", cat: "Elektra", phone: "+370 622 33445", email: "darius@elektromb.lt", objektai: ["Žvejų Namai", "Saulės Slėnis"] },
  { name: "Jolanta Petkevičienė", role: "Valymo paslaugos", company: "Švara LT", cat: "Valymas", phone: "+370 633 99001", email: "jolanta@svara.lt", objektai: ["Kalnų Terasos", "Saulės Slėnis"] },
  { name: "Tomas Žukauskas", role: "Apsaugos vadovas", company: "Apsaugos partneriai", cat: "Apsauga", phone: "+370 644 22110", email: "tomas@apsauga.lt", objektai: ["Pušyno Kvartalas", "Žvejų Namai"] },
  { name: "Renata Bagdonienė", role: "Buhalterė", company: "Miteda", cat: "Administracija", phone: "+370 655 77889", email: "renata@miteda.lt", objektai: ["Kalnų Terasos", "Žvejų Namai", "Pušyno Kvartalas", "Saulės Slėnis"] },
];

/* ---- Tvarkaraštis / įvykiai ---- */
MD.events = [
  { day: 11, title: "Bendruomenės susirinkimas", time: "18:30", place: "Laiptinė A", cat: "Susirinkimas" },
  { day: 12, title: "Karšto vandens atjungimas", time: "9:00–14:00", place: "Visas pastatas", cat: "Priežiūra" },
  { day: 14, title: "Vejos pjovimas", time: "10:00", place: "Kiemas", cat: "Aplinka" },
  { day: 18, title: "Lifto patikra", time: "11:00", place: "Liftas", cat: "Priežiūra" },
  { day: 23, title: "Gaisrinės saugos inspekcija", time: "13:00", place: "Visas pastatas", cat: "Patikra" },
  { day: 28, title: "Užsakytas BBQ kiemelis №2", time: "17:00", place: "Pastatas C", cat: "Rezervacija" },
];
MD.eventDays = { 11: 1, 12: 1, 14: 1, 18: 1, 23: 2, 28: 1 };

/* ---- Skelbimų lenta ---- */
MD.bulletinCats = ["Visi", "Parduodu", "Paslaugos", "Dovanoju", "Ieškau", "Pranešimai"];
MD.bulletin = [
  { cat: "Parduodu", title: "Parduodu beveik naują dviratį", body: "Miesto dviratis Kross, naudotas vieną sezoną. Kaina derinama.", who: "Tomas P. · B-9", time: "Prieš 2 val.", price: "€180" },
  { cat: "Paslaugos", title: "Siūlau auklės paslaugas", body: "Studentė, turinti patirties, gali prižiūrėti vaikus vakarais.", who: "Eglė V. · A-3", time: "Vakar", price: null },
  { cat: "Dovanoju", title: "Atiduodu knygas", body: "Dėžė grožinės literatūros lietuvių kalba. Pasiimti laiptinėje A.", who: "Rūta K. · A-7", time: "Prieš 2 d.", price: "Nemokamai" },
  { cat: "Ieškau", title: "Ieškau dingusios katės", body: "Pilka katė vardu Tinginys, dingo prie kiemo. Praneškite, jei matėte.", who: "Janina M. · C-2", time: "Prieš 3 d.", price: null },
  { cat: "Pranešimai", title: "Renkamės kiemo tvarkymo talkai", body: "Šeštadienį 10 val. tvarkysime gėlynus. Kviečiame prisidėti!", who: "Administracija", time: "Prieš 4 d.", price: null },
  { cat: "Parduodu", title: "Parduodu vaikišką kėdutę", body: "Maitinimo kėdutė, geros būklės, sulankstoma.", who: "Greta J. · B-4", time: "Prieš 5 d.", price: "€25" },
];

/* ---- Bendruomenė / forumas ---- */
MD.threads = [
  { title: "Priminimas dėl automobilių statymo visiems", cat: "Diskusija", building: "Kalnų Terasos", author: "Tomas Petraitis", replies: 52, likes: 31, views: "3.2 tūkst.", time: "Prieš 3 val.", hot: true,
    body: "Pastebiu, kad svečiai vis dažniau užima gyventojų vietas. Gal verta įrengti aiškesnę ženklinimo sistemą?" },
  { title: "Dviračių laikymas rūsyje", cat: "Pasiūlymas", building: "Žvejų Namai", author: "Eglė Vaitkutė", replies: 18, likes: 12, views: "1.1 tūkst.", time: "Vakar", hot: true,
    body: "Ar būtų galima rūsyje įrengti daugiau dviračių stovų? Dabartiniai visada užimti." },
  { title: "Bendruomenės sodas kieme — kas norėtų?", cat: "Idėja", building: "Pušyno Kvartalas", author: "Rūta Kazlauskaitė", replies: 27, likes: 44, views: "2.0 tūkst.", time: "Prieš 2 d.", hot: false,
    body: "Galvoju apie bendrą daržą prie pietinės pusės. Kas prisidėtų prie priežiūros?" },
  { title: "Interneto tiekėjo rekomendacijos", cat: "Klausimas", building: "Saulės Slėnis", author: "Mantas Šimkus", replies: 9, likes: 5, views: "640", time: "Prieš 4 d.", hot: false,
    body: "Persikrausčiau neseniai. Kokį interneto tiekėją rekomenduotumėte mūsų name?" },
];

/* ---- Remonto darbai (gyventojo butas) ---- */
MD.repair = {
  manager: { name: "Andrius Jankauskas", role: "Darbų vadovas", phone: "+370 677 12345" },
  workers: [
    { name: "Petras Gaidys", role: "Apdailininkas" },
    { name: "Kęstutis Rimša", role: "Plytelių klojėjas" },
    { name: "Vytas Norkus", role: "Pagalbinis darbininkas" },
  ],
  expenses: [
    { item: "Medžiagos (plytelės, klijai)", sum: "€1 240" },
    { item: "Santechnikos darbai", sum: "€680" },
    { item: "Apdailos darbai", sum: "€1 520" },
    { item: "Elektros instaliacija", sum: "€430" },
  ],
  total: "€3 870",
  updates: [
    { who: "Andrius Jankauskas", text: "Vonios plytelės paklotos, džiūsta hidroizoliacija.", time: "Šiandien · 14:20", photos: 2 },
    { who: "Petras Gaidys", text: "Nugruntavome sienas svetainėje, rytoj pradėsime dažyti.", time: "Vakar · 17:00", photos: 1 },
    { who: "Andrius Jankauskas", text: "Atvežtos virtuvės spintelės, montavimas penktadienį.", time: "06 07 · 10:15", photos: 3 },
  ],
};

/* ---- ADMIN: objektai ---- */
MD.properties = [
  { name: "Kalnų Terasos", address: "Kalnų g. 14, Vilnius", units: 48, sold: 41, coverImage: "/covers/cover-1.jpg" },
  { name: "Žvejų Namai", address: "Žvejų g. 7, Klaipėda", units: 32, sold: 18, coverImage: "/covers/cover-2.jpg" },
  { name: "Pušyno Kvartalas", address: "Pušyno al. 22, Kaunas", units: 64, sold: 60, coverImage: "/covers/cover-3.jpg" },
  { name: "Saulės Slėnis", address: "Saulės g. 3, Vilnius", units: 24, sold: 9, coverImage: "/covers/cover-1.jpg" },
];

/* ---- ADMIN: visi defektai ---- */
MD.adminDefects = [
  { id: "DF-104", building: "Kalnų Terasos", apt: "B-12", title: "Praleidžia vamzdis po kriaukle", status: "progress", author: "Lukas Petrauskas", date: "2026 06 08" },
  { id: "DF-103", building: "Kalnų Terasos", apt: "B-12", title: "Neužsidaro lauko durys", status: "open", author: "Lukas Petrauskas", date: "2026 06 07" },
  { id: "DF-098", building: "Žvejų Namai", apt: "A-4", title: "Nešyla radiatorius miegamajame", status: "open", author: "Greta Janušienė", date: "2026 06 06" },
  { id: "DF-095", building: "Pušyno Kvartalas", apt: "C-21", title: "Sugedęs domofono mygtukas", status: "progress", author: "Mantas Šimkus", date: "2026 06 04" },
  { id: "DF-101", building: "Kalnų Terasos", apt: "B-12", title: "Įtrūkimas sienoje prie lango", status: "resolved", author: "Lukas Petrauskas", date: "2026 05 28" },
  { id: "DF-090", building: "Saulės Slėnis", apt: "A-2", title: "Nesandari balkono durų tarpinė", status: "resolved", author: "Eglė Vaitkutė", date: "2026 05 22" },
];

/* ---- ADMIN: darbų eiga (transliacijos) ---- */
MD.broadcasts = [
  { title: "Vonios plytelės paklotos", date: "2026 06 10", recipients: ["B-12 · L. Petrauskas"], photos: 2,
    body: "Užbaigtas plytelių klojimas, pradedama apdaila." },
  { title: "Virtuvės spintelių montavimas", date: "2026 06 07", recipients: ["B-12 · L. Petrauskas", "A-4 · G. Janušienė"], photos: 3,
    body: "Atvežtos ir sumontuotos virtuvės spintelės." },
  { title: "Bendro koridoriaus dažymas", date: "2026 06 03", recipients: ["Visi · Kalnų Terasos"], photos: 1,
    body: "Perdažyti bendrojo naudojimo koridoriai 1–3 aukštuose." },
];

/* ---- Skaitmeniniai raktai ---- */
MD.keys = [
  { icon: "ph ph-key", label: "Laiptinės kodas", value: "#1234#" },
  { icon: "ph ph-car-profile", label: "Parkavimo kodas", value: "#5678#" },
  { icon: "ph ph-wifi-high", label: "Wi-Fi (bendros erdvės)", value: "kalnu2024" },
];

/* ---- ADMIN: visi remonto projektai ---- */
MD.projects = [
  { building: "Kalnų Terasos", apt: "B-12", manager: "Andrius Jankauskas", workers: 3, total: "€3 870", progress: 68, phase: "Apdaila" },
  { building: "Žvejų Namai", apt: "A-4", manager: "Rolandas Mažeika", workers: 2, total: "€2 410", progress: 35, phase: "Santechnika" },
  { building: "Pušyno Kvartalas", apt: "C-21", manager: "Andrius Jankauskas", workers: 4, total: "€5 120", progress: 82, phase: "Baigiamieji" },
  { building: "Saulės Slėnis", apt: "A-2", manager: "Rolandas Mažeika", workers: 2, total: "€1 760", progress: 15, phase: "Demontavimas" },
];

/* ---- STATYBA: darbininko pokalbio žurnalas ---- */
MD.workerChat = [
  { who: "Andrius (vadovas)", side: "them", text: "Petrai, kaip sekasi su vonios plytelėmis?", time: "8:40" },
  { who: null, side: "me", text: "Labas! Jau baigiu klijuoti, liko viena siena.", time: "8:52" },
  { who: "Kęstutis", side: "them", text: "Atvežiau papildomų klijų, palikau koridoriuje.", time: "9:15" },
  { who: null, side: "me", kind: "photo", photos: 2, text: "Štai dabartinė būklė.", time: "9:20" },
  { who: "Andrius (vadovas)", side: "them", text: "Puiku, atrodo tvarkingai. Nepamiršk nuotraukų kvito už klijus.", time: "9:24" },
];

export default MD;
