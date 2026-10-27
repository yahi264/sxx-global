/* ==========================================================================
   SXX Global — sourcing, expediting & inspection. Structure shared by every
   language. Identity anonymised for the proposal: name, phone and email are
   placeholders. Texts live in assets/lang/<code>.js and load on demand.
   ========================================================================== */
const CO = {
  name: 'SXX Global', since: 'two decades',
  phone: '+90 500 000 00 00', phoneHref: 'tel:+905000000000',
  whatsapp: 'https://wa.me/905000000000',
  email: 'info@sxxglobal.com.tr', address: 'Türkiye',
  maps: 'https://www.google.com/maps/search/?api=1&query=T%C3%BCrkiye',
  social: { linkedin: 'https://www.linkedin.com/', instagram: 'https://www.instagram.com/' },
};

const LANGS = [
  { code: 'en', name: 'English', intl: 'en-GB', dir: 'ltr' },
  { code: 'tr', name: 'Türkçe', intl: 'tr-TR', dir: 'ltr' },
  { code: 'de', name: 'Deutsch', intl: 'de-DE', dir: 'ltr' },
  { code: 'fr', name: 'Français', intl: 'fr-FR', dir: 'ltr' },
  { code: 'ar', name: 'العربية', intl: 'ar', dir: 'rtl' },
];
const FLAGS = {
  en: '<svg class="flag" viewBox="0 0 60 30" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><rect width="60" height="30" fill="#012169"/><path d="M0 0l60 30M60 0L0 30" stroke="#fff" stroke-width="6"/><path d="M0 0l60 30M60 0L0 30" stroke="#C8102E" stroke-width="2.5"/><path d="M30 0v30M0 15h60" stroke="#fff" stroke-width="10"/><path d="M30 0v30M0 15h60" stroke="#C8102E" stroke-width="6"/></svg>',
  tr: '<svg class="flag" viewBox="0 0 30 20" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><rect width="30" height="20" fill="#E30A17"/><circle cx="11" cy="10" r="5" fill="#fff"/><circle cx="12.25" cy="10" r="4" fill="#E30A17"/><polygon fill="#fff" points="13.20,10.00 14.83,9.44 14.86,7.72 15.89,9.10 17.54,8.59 16.55,10.00 17.54,11.41 15.89,10.90 14.86,12.28 14.83,10.56"/></svg>',
  de: '<svg class="flag" viewBox="0 0 30 18" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><rect width="30" height="6" fill="#000"/><rect y="6" width="30" height="6" fill="#DD0000"/><rect y="12" width="30" height="6" fill="#FFCE00"/></svg>',
  fr: '<svg class="flag" viewBox="0 0 30 20" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><rect width="10" height="20" fill="#002395"/><rect x="10" width="10" height="20" fill="#fff"/><rect x="20" width="10" height="20" fill="#ED2939"/></svg>',
  ar: '<svg class="flag" viewBox="0 0 30 18" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><rect width="30" height="6" fill="#00732F"/><rect y="6" width="30" height="6" fill="#fff"/><rect y="12" width="30" height="6" fill="#000"/><rect width="9" height="18" fill="#FF0000"/></svg>',
};

/* the three core services */
const SERVICES = [
  { id: 'sourcing', icon: 'globe', img: 'sourcing.jpg' },
  { id: 'expediting', icon: 'gauge', img: 'expediting.jpg' },
  { id: 'inspection', icon: 'shield', img: 'inspection.jpg' },
];

/* commodities sourced through the supplier network */
const COMMODITIES = [
  { id: 'heavy', icon: 'beam', img: 'heavy.jpg' },
  { id: 'light', icon: 'frame', img: 'light.jpg' },
  { id: 'machining', icon: 'gear', img: 'machining.jpg' },
  { id: 'sheet', icon: 'layers', img: 'sheet.jpg' },
  { id: 'forging', icon: 'hammer', img: 'forging.jpg' },
  { id: 'casting', icon: 'drop', img: 'casting.jpg' },
];

/* sectors served */
const SECTORS = [
  { id: 'oilgas', icon: 'flame', img: 'oilgas.jpg' },
  { id: 'energy', icon: 'bolt', img: 'energy.jpg' },
  { id: 'process', icon: 'factory', img: 'process.jpg' },
  { id: 'vessels', icon: 'tank', img: 'vessel.jpg' },
  { id: 'defence', icon: 'shield', img: 'defence.jpg' },
  { id: 'railway', icon: 'train', img: 'railway.jpg' },
];

/* order journey: each stage tagged with the service(s) that cover it */
const JOURNEY = [
  { id: 'rfq', icon: 'search', s: ['sourcing'] },
  { id: 'supplier', icon: 'users', s: ['sourcing', 'inspection'] },
  { id: 'kickoff', icon: 'cal', s: ['expediting'] },
  { id: 'material', icon: 'layers', s: ['expediting', 'inspection'] },
  { id: 'fab', icon: 'spark', s: ['expediting', 'inspection'] },
  { id: 'ndt', icon: 'wave', s: ['inspection'] },
  { id: 'paint', icon: 'brush', s: ['inspection'] },
  { id: 'ship', icon: 'box', s: ['expediting', 'inspection'] },
];

/* NDT methods shown in the explorer */
const NDT = ['ut', 'rt', 'mt', 'pt'];

/* RFQ builder options */
const RFQ = {
  extras: ['ndt', 'pwht', 'mach', 'paint', 'heat', 'pack'],
  levels: ['review', 'witness', 'hold'],
};
