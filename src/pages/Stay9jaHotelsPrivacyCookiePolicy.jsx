import Navbar from '../components/Navbar/Navbar'
import React, { useState, useMemo, useRef, useEffect } from "react";

/* Inline icons — no external icon-library dependency */
const Icon = ({ children, size = 16, color, className, style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color || "currentColor"}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    style={style}
  >
    {children}
  </svg>
);
const Search = (props) => (
  <Icon {...props}><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></Icon>
);
const Mail = (props) => (
  <Icon {...props}><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 6-10 7L2 6" /></Icon>
);
const MapPin = (props) => (
  <Icon {...props}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></Icon>
);
const ChevronRight = (props) => (
  <Icon {...props}><path d="m9 18 6-6-6-6" /></Icon>
);
const Menu = (props) => (
  <Icon {...props}><path d="M4 12h16M4 6h16M4 18h16" /></Icon>
);
const X = (props) => (
  <Icon {...props}><path d="M18 6 6 18M6 6l12 12" /></Icon>
);
const ShieldCheck = (props) => (
  <Icon {...props}><path d="M12 3 4 6v6c0 5 3.4 8.4 8 9 4.6-.6 8-4 8-9V6Z" /><path d="m9 12 2 2 4-4" /></Icon>
);
const Cookie = (props) => (
  <Icon {...props}><path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5Z" /><circle cx="8.5" cy="12.5" r=".8" fill="currentColor" /><circle cx="12.5" cy="16" r=".8" fill="currentColor" /><circle cx="15" cy="10.5" r=".8" fill="currentColor" /></Icon>
);

const SECTIONS = [
  {
    id: "01",
    title: "Our Role (Important)",
    icon: "role",
    body: [
      { type: "ul", items: [
        "Stay9jahotels.com acts primarily as a data controller for account, booking, and platform usage data.",
        "For booking fulfilment, Stay9jahotels.com may act as a data processor or joint controller with Hotels, Short Term Rentals and Guest Houses, Flights, Car Rentals, and local attraction operators, depending on the context.",
        "Stay9jahotels.com acts as the operators' payment intermediary/agent, facilitating payments from users and transferring them to operators via our payment provider.",
      ]},
    ],
  },
  {
    id: "02",
    title: "User Information We Collect",
    body: [
      { type: "h", text: "a. Information You Provide" },
      { type: "ul", items: [
        "Full name", "Email address", "Phone number",
        "Booking details (check-in/check-out dates, preferences)",
        "Account login credentials", "Billing and transaction information",
      ]},
      { type: "h", text: "b. Automatically Collected Information" },
      { type: "ul", items: [
        "IP address", "Device type and browser", "Operating system",
        "Pages visited and time spent on the Platform", "Referring URLs",
      ]},
      { type: "h", text: "c. Third-Party Information" },
      { type: "ul", items: [
        "Payment confirmations from our payment gateway provider, Flutterwave",
        "Information from Hotels, Short Term Rentals and Guest Houses, Flights, Car Rentals, and local attraction operators",
      ]},
    ],
  },
  {
    id: "03",
    title: "How We Use Your Information",
    body: [
      { type: "p", text: "Stay9jahotels.com uses your data to:" },
      { type: "ul", items: [
        "Facilitate operator bookings",
        "Process and reconcile payments as an intermediary",
        "Transfer booking and guest details to the relevant operator",
        "Provide customer support",
        "Improve our Platform and services",
        "Communicate booking confirmations and updates",
        "Send marketing communications (where consent is provided)",
        "Prevent fraud and ensure platform security",
        "Comply with legal and regulatory obligations",
      ]},
    ],
  },
  {
    id: "04",
    title: "Legal Basis for Processing (UK GDPR & NDPR)",
    body: [
      { type: "p", text: "Stay9jahotels.com relies on:" },
      { type: "ul", items: [
        "Contractual necessity — to process bookings and payments",
        "Legitimate interests — to improve services, prevent fraud, and manage operations",
        "Consent — for marketing and non-essential cookies",
        "Legal obligation — for compliance with applicable laws",
      ]},
      { type: "p", text: "Under NDPR, processing is conducted in line with lawful basis requirements and data subject rights." },
    ],
  },
  {
    id: "05",
    title: "Payments & Financial Processing",
    body: [
      { type: "p", text: "All payments are processed via our third-party payment gateway provider: Flutterwave (payment processor)." },
      { type: "p", text: "We do not store full card details. Payment data is processed securely by Flutterwave, in accordance with their security and compliance standards.", emphasis: true },
      { type: "h", text: "As a booking intermediary" },
      { type: "ul", items: [
        "We facilitate payment from users.",
        "We remit funds to operators (less any applicable fees).",
        "Operators are responsible for service delivery.",
      ]},
    ],
  },
  {
    id: "06",
    title: "Sharing Your Information",
    body: [
      { type: "p", text: "We may share your data with:" },
      { type: "ul", items: [
        "Hotels, Short Term Rentals and Guest Houses, Flights, Car Rentals, and local attraction operators you book with (to fulfil your reservation)",
        "Payment processors (Flutterwave)",
        "IT, hosting, and cloud service providers",
        "Analytics providers",
        "Regulatory authorities or law enforcement where required",
      ]},
      { type: "p", text: "We ensure appropriate safeguards are in place for all data sharing." },
    ],
  },
  {
    id: "07",
    title: "International Data Transfers",
    body: [
      { type: "p", text: "Your data may be transferred outside the UK or Nigeria. Where this occurs, we implement appropriate safeguards, including:" },
      { type: "ul", items: ["Standard Contractual Clauses (SCCs)", "Adequacy decisions where applicable"] },
    ],
  },
  {
    id: "08",
    title: "Data Retention",
    body: [
      { type: "p", text: "We retain personal data only as long as necessary to:" },
      { type: "ul", items: [
        "Fulfil bookings and transactions",
        "Meet legal, tax, and regulatory obligations",
        "Resolve disputes and enforce agreements",
      ]},
    ],
  },
  {
    id: "09",
    title: "Your Rights",
    body: [
      { type: "h", text: "Under UK GDPR" },
      { type: "ul", items: [
        "Access your data", "Rectify inaccurate data", "Request erasure",
        "Restrict processing", "Data portability", "Object to processing", "Withdraw consent",
      ]},
      { type: "h", text: "Under NDPR" },
      { type: "ul", items: [
        "Be informed about data processing",
        "Access and request correction of your data",
        "Withdraw consent", "Object to processing", "Request deletion of your data",
      ]},
      { type: "p", text: "To exercise your rights, contact: info@Stay9jahotels.com" },
    ],
  },
  {
    id: "10",
    title: "Security",
    body: [
      { type: "p", text: "We implement appropriate technical and organisational measures including:" },
      { type: "ul", items: [
        "Encryption", "Secure payment processing via Flutterwave",
        "Access controls and authentication", "Regular security monitoring",
      ]},
    ],
  },
  {
    id: "11",
    title: "What Are Cookies?",
    kicker: "Cookie Policy",
    body: [
      { type: "p", text: "Cookies are small text files stored on your device to improve functionality, analytics, and user experience." },
    ],
  },
  {
    id: "12",
    title: "Types of Cookies We Use",
    body: [{ type: "cookies" }],
  },
  {
    id: "13",
    title: "Managing Cookies",
    body: [
      { type: "p", text: "You can manage cookies through:" },
      { type: "ul", items: ["Browser settings", "Our cookie consent banner (on first visit)"] },
    ],
  },
  {
    id: "14",
    title: "Third-Party Cookies",
    body: [
      { type: "p", text: "Third parties such as analytics providers may place cookies on your device." },
    ],
  },
  {
    id: "15",
    title: "NDPR Compliance Statement",
    body: [
      { type: "p", text: "Stay9jahotels.com complies with the Nigeria Data Protection Regulation (NDPR) by:" },
      { type: "ul", items: [
        "Processing data lawfully and transparently",
        "Limiting collection to necessary data",
        "Ensuring data security and confidentiality",
        "Respecting user rights",
        "Using third-party processors that meet data protection standards",
      ]},
    ],
  },
  {
    id: "16",
    title: "Updates to This Policy",
    body: [
      { type: "p", text: "We may update this policy periodically. Updates will be posted with a revised effective date." },
    ],
  },
  {
    id: "17",
    title: "Contact Us",
    body: [{ type: "contact" }],
  },
];

const COOKIE_TYPES = [
  { key: "essential", label: "Essential Cookies", desc: "Required for core platform functions such as booking and login.", locked: true },
  { key: "performance", label: "Performance Cookies", desc: "Used for analytics and performance monitoring.", locked: false },
  { key: "functional", label: "Functional Cookies", desc: "Store user preferences.", locked: false },
  { key: "marketing", label: "Marketing Cookies", desc: "Used for advertising and campaign tracking (only with consent).", locked: false },
];

function highlight(text, query) {
  if (!query) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="s9p-mark">{text.slice(idx, idx + query.length)}</mark>
      {text.slice(idx + query.length)}
    </>
  );
}

function sectionMatches(section, query) {
  if (!query) return true;
  const q = query.toLowerCase();
  if (section.title.toLowerCase().includes(q)) return true;
  return section.body.some((b) => {
    if (b.type === "p" || b.type === "h") return b.text.toLowerCase().includes(q);
    if (b.type === "ul") return b.items.some((i) => i.toLowerCase().includes(q));
    if (b.type === "cookies") return COOKIE_TYPES.some((c) => c.label.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q));
    if (b.type === "contact") return "email address contact info@stay9jahotels.com isolo lagos".includes(q);
    return false;
  });
}

function CookieToggles() {
  const [state, setState] = useState({ essential: true, performance: true, functional: true, marketing: false });
  const toggle = (key) => {
    if (key === "essential") return;
    setState((s) => ({ ...s, [key]: !s[key] }));
  };
  return (
    <div className="s9p-cookies">
      {COOKIE_TYPES.map((c) => (
        <div key={c.key} className="s9p-cookie-row">
          <div className="s9p-cookie-text">
            <b>{c.label}</b>
            <span>{c.desc}</span>
          </div>
          <button
            className={`s9p-switch ${state[c.key] ? "on" : ""} ${c.locked ? "locked" : ""}`}
            onClick={() => toggle(c.key)}
            aria-pressed={state[c.key]}
            aria-label={`Toggle ${c.label}`}
          >
            <span className="s9p-switch-dot" />
          </button>
        </div>
      ))}
      <p className="s9p-cookie-note">Illustrative preview only — actual consent is captured by the cookie banner on first visit.</p>
    </div>
  );
}

export default function Stay9jaHotelsPrivacyCookiePolicy() {
  const [active, setActive] = useState("01");
  const [query, setQuery] = useState("");
  const [navOpen, setNavOpen] = useState(false);
  const refs = useRef({});
  const containerRef = useRef(null);

  const filtered = useMemo(() => SECTIONS.filter((s) => sectionMatches(s, query)), [query]);

  const scrollTo = (id) => {
    setActive(id);
    setNavOpen(false);
    const el = refs.current[id];
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const onScroll = () => {
      let closest = null;
      let closestDist = Infinity;
      for (const s of filtered) {
        const el = refs.current[s.id];
        if (!el) continue;
        const dist = Math.abs(el.getBoundingClientRect().top - 140);
        if (dist < closestDist) {
          closestDist = dist;
          closest = s.id;
        }
      }
      if (closest) setActive(closest);
    };
    container.addEventListener("scroll", onScroll, { passive: true });
    return () => container.removeEventListener("scroll", onScroll);
  }, [filtered]);

  return (
    <div className="s9p-root">
      <style>{`
        .s9p-root {
          --ink: #16241d;
          --ink-soft: #4a5b52;
          --paper: #faf7ee;
          --panel: #0f3d2e;
          --panel-deep: #0a2e23;
          --gold: #c8a24a;
          --gold-soft: #e4cd8f;
          --line: #dcd4bd;
          --card: #ffffff;
          font-family: "Iowan Old Style", "Palatino Linotype", Georgia, serif;
          color: var(--ink);
          background: var(--paper);
          width: 100%;
          height: 100%;
          min-height: 640px;
          display: flex;
          flex-direction: column;
          border-radius: 14px;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(15,61,46,0.08);
          border: 1px solid var(--line);
        }
        .s9p-topbar {
          background: linear-gradient(135deg, var(--panel) 0%, var(--panel-deep) 100%);
          color: #f4efe0;
          padding: 22px 28px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          flex-shrink: 0;
        }
        .s9p-brand { display: flex; align-items: center; gap: 12px; }
        .s9p-brand-mark {
          width: 40px; height: 40px; border-radius: 10px;
          background: rgba(200,162,74,0.16);
          border: 1px solid var(--gold);
          display: flex; align-items: center; justify-content: center;
          color: var(--gold-soft); flex-shrink: 0;
        }
        .s9p-brand-text h1 {
          font-family: "Playfair Display", "Iowan Old Style", Georgia, serif;
          font-size: 19px; letter-spacing: 0.02em; margin: 0;
          font-weight: 600; color: #fbf7ea;
        }
        .s9p-brand-text p {
          margin: 2px 0 0; font-size: 11.5px; letter-spacing: 0.14em;
          text-transform: uppercase; color: var(--gold-soft); font-family: Georgia, serif;
        }
        .s9p-search {
          display: flex; align-items: center; gap: 8px;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(228,205,143,0.35);
          border-radius: 999px; padding: 8px 14px; min-width: 200px;
        }
        .s9p-search input {
          background: transparent; border: none; outline: none;
          color: #f4efe0; font-size: 13px; font-family: Georgia, serif; width: 100%;
        }
        .s9p-search input::placeholder { color: rgba(244,239,224,0.55); }
        .s9p-menu-btn {
          display: none; background: rgba(255,255,255,0.1);
          border: 1px solid rgba(228,205,143,0.35); color: #f4efe0;
          border-radius: 8px; padding: 8px; cursor: pointer;
        }
        .s9p-body { display: flex; flex: 1; min-height: 0; }
        .s9p-nav {
          width: 264px; flex-shrink: 0; background: #f1ecdc;
          border-right: 1px solid var(--line); overflow-y: auto; padding: 16px 12px;
        }
        .s9p-nav-label {
          font-size: 10.5px; letter-spacing: 0.16em; text-transform: uppercase;
          color: var(--ink-soft); padding: 6px 10px 10px;
        }
        .s9p-nav-kicker {
          font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase;
          color: var(--gold); padding: 12px 10px 4px; font-weight: 700;
        }
        .s9p-key {
          display: flex; align-items: center; gap: 10px; width: 100%; text-align: left;
          border: none; background: transparent; padding: 9px 10px; border-radius: 8px;
          cursor: pointer; font-family: Georgia, serif; color: var(--ink);
          margin-bottom: 2px; transition: background 0.15s ease;
        }
        .s9p-key:hover { background: rgba(200,162,74,0.14); }
        .s9p-key.active { background: var(--panel); color: #f4efe0; }
        .s9p-key-num {
          font-size: 10px; font-weight: 700; letter-spacing: 0.04em;
          width: 26px; height: 26px; border-radius: 6px; border: 1px solid var(--gold);
          display: flex; align-items: center; justify-content: center;
          color: var(--gold); flex-shrink: 0; background: #fff;
        }
        .s9p-key.active .s9p-key-num { background: var(--gold); color: var(--panel-deep); border-color: var(--gold); }
        .s9p-key-title { font-size: 13px; line-height: 1.3; }
        .s9p-nav-empty { padding: 20px 12px; font-size: 13px; color: var(--ink-soft); }
        .s9p-content { flex: 1; overflow-y: auto; padding: 32px 40px 60px; }
        .s9p-intro {
          background: var(--card); border: 1px solid var(--line); border-left: 4px solid var(--gold);
          border-radius: 10px; padding: 18px 22px; margin-bottom: 20px; font-size: 14px;
          line-height: 1.7; color: var(--ink-soft);
        }
        .s9p-intro b { color: var(--ink); }
        .s9p-compliance {
          display: flex; gap: 10px; margin-bottom: 28px; flex-wrap: wrap;
        }
        .s9p-badge {
          display: inline-flex; align-items: center; gap: 6px;
          background: #eef4ee; border: 1px solid #cfe0cf; color: var(--panel);
          font-size: 11.5px; letter-spacing: 0.04em; padding: 6px 12px; border-radius: 999px;
          font-family: Georgia, serif; font-weight: 700;
        }
        .s9p-section { margin-bottom: 30px; scroll-margin-top: 20px; }
        .s9p-section-kicker {
          font-size: 11px; letter-spacing: 0.16em; text-transform: uppercase;
          color: var(--gold); font-weight: 700; margin-bottom: 6px;
        }
        .s9p-section-head {
          display: flex; align-items: baseline; gap: 12px; margin-bottom: 12px;
          padding-bottom: 8px; border-bottom: 1px solid var(--line);
        }
        .s9p-section-num { font-family: "Playfair Display", Georgia, serif; font-size: 15px; color: var(--gold); font-weight: 700; }
        .s9p-section-head h2 { font-family: "Playfair Display", Georgia, serif; font-size: 20px; margin: 0; font-weight: 600; color: var(--ink); }
        .s9p-p { font-size: 14.5px; line-height: 1.75; margin: 0 0 12px; color: var(--ink); }
        .s9p-p.emph { background: #fff7e6; border: 1px solid var(--gold-soft); border-radius: 8px; padding: 12px 14px; font-style: italic; }
        .s9p-h4 { font-size: 12.5px; letter-spacing: 0.06em; text-transform: uppercase; color: var(--panel); margin: 16px 0 8px; font-weight: 700; font-family: Georgia, serif; }
        .s9p-ul { margin: 0 0 14px; padding: 0; list-style: none; }
        .s9p-ul li { display: flex; gap: 10px; font-size: 14.5px; line-height: 1.65; margin-bottom: 8px; color: var(--ink); }
        .s9p-ul li svg { flex-shrink: 0; margin-top: 4px; color: var(--gold); }
        .s9p-mark { background: var(--gold-soft); color: var(--panel-deep); padding: 0 2px; border-radius: 3px; }
        .s9p-contact { display: flex; flex-wrap: wrap; gap: 14px; }
        .s9p-contact-card {
          flex: 1; min-width: 200px; background: var(--card); border: 1px solid var(--line);
          border-radius: 10px; padding: 16px 18px; display: flex; gap: 12px; align-items: flex-start;
        }
        .s9p-contact-card svg { color: var(--gold); flex-shrink: 0; margin-top: 2px; }
        .s9p-contact-card b { display: block; font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: var(--ink-soft); margin-bottom: 3px; }
        .s9p-contact-card span { font-size: 14px; color: var(--ink); }
        .s9p-footer-note { margin-top: 28px; padding-top: 18px; border-top: 1px dashed var(--line); font-size: 13px; color: var(--ink-soft); font-style: italic; text-align: center; }

        .s9p-cookies { display: flex; flex-direction: column; gap: 10px; }
        .s9p-cookie-row {
          display: flex; align-items: center; justify-content: space-between; gap: 16px;
          background: var(--card); border: 1px solid var(--line); border-radius: 10px; padding: 13px 16px;
        }
        .s9p-cookie-text { display: flex; flex-direction: column; gap: 3px; }
        .s9p-cookie-text b { font-size: 13.5px; color: var(--ink); }
        .s9p-cookie-text span { font-size: 12.5px; color: var(--ink-soft); line-height: 1.5; }
        .s9p-switch {
          width: 42px; height: 24px; border-radius: 999px; border: none; cursor: pointer;
          background: #d7cfb6; position: relative; flex-shrink: 0; transition: background 0.15s ease;
          padding: 0;
        }
        .s9p-switch.on { background: var(--panel); }
        .s9p-switch.locked { cursor: default; background: var(--gold); opacity: 0.9; }
        .s9p-switch-dot {
          position: absolute; top: 3px; left: 3px; width: 18px; height: 18px; border-radius: 50%;
          background: #fff; transition: transform 0.15s ease; box-shadow: 0 1px 2px rgba(0,0,0,0.25);
        }
        .s9p-switch.on .s9p-switch-dot { transform: translateX(18px); }
        .s9p-cookie-note { font-size: 12px; color: var(--ink-soft); font-style: italic; margin: 4px 2px 0; }

        @media (max-width: 760px) {
          .s9p-search { min-width: 0; flex: 1; }
          .s9p-brand-text p { display: none; }
          .s9p-menu-btn { display: flex; }
          .s9p-nav {
            position: absolute; z-index: 5; top: 0; left: 0; bottom: 0;
            transform: translateX(-100%); transition: transform 0.2s ease;
            width: 240px; box-shadow: 4px 0 16px rgba(0,0,0,0.18);
          }
          .s9p-nav.open { transform: translateX(0); }
          .s9p-content { padding: 24px 18px 50px; }
          .s9p-cookie-row { flex-direction: column; align-items: flex-start; }
        }
      `}</style>

      {/* <div className="s9p-topbar">
        <div className="s9p-brand">
          <button className="s9p-menu-btn" onClick={() => setNavOpen((o) => !o)} aria-label="Toggle sections">
            {navOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
          <div className="s9p-brand-mark"><ShieldCheck size={19} /></div>
          <div className="s9p-brand-text">
            <h1>Stay9jaHotels.com</h1>
            <p>Privacy Notice &amp; Cookie Policy</p>
          </div>
        </div>
        <div className="s9p-search">
          <Search size={15} color="#e4cd8f" />
          <input placeholder="Search this policy…" value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
      </div> */}

      <Navbar/>

      <div className="s9p-body">
        <nav className={`s9p-nav ${navOpen ? "open" : ""}`}>
          <div className="s9p-nav-label">Privacy Notice</div>
          {filtered.length === 0 && <div className="s9p-nav-empty">No sections match "{query}".</div>}
          {filtered.map((s, i) => {
            const prev = filtered[i - 1];
            const showKicker = s.kicker && (!prev || prev.kicker !== s.kicker);
            return (
              <React.Fragment key={s.id}>
                {showKicker && <div className="s9p-nav-kicker">{s.kicker}</div>}
                <button className={`s9p-key ${active === s.id ? "active" : ""}`} onClick={() => scrollTo(s.id)}>
                  <span className="s9p-key-num">{s.id}</span>
                  <span className="s9p-key-title">{s.title}</span>
                </button>
              </React.Fragment>
            );
          })}
        </nav>

        <div className="s9p-content" ref={containerRef}>
          <div className="s9p-intro">
            <b>EP Hotel Centric Ltd</b> ("we", "our", "us") operates <b>www.stay9jahotels.com</b> (the "Platform"), a
            hospitality listing and booking intermediary. This notice explains how we collect, use, disclose, and
            safeguard your information, in compliance with the <b>UK GDPR</b> and the <b>NDPR</b>.
          </div>
          <div className="s9p-compliance">
            <span className="s9p-badge"><ShieldCheck size={13} /> UK GDPR</span>
            <span className="s9p-badge"><ShieldCheck size={13} /> NDPR (Nigeria)</span>
            <span className="s9p-badge"><Cookie size={13} /> Cookie Policy included</span>
          </div>

          {filtered.length === 0 && query && (
            <p className="s9p-p">Try a different search term, or clear the search to see all sections.</p>
          )}

          {filtered.map((s, i) => {
            const prev = filtered[i - 1];
            const showKicker = s.kicker && (!prev || prev.kicker !== s.kicker);
            return (
              <section key={s.id} className="s9p-section" ref={(el) => (refs.current[s.id] = el)}>
                {showKicker && <div className="s9p-section-kicker">{s.kicker}</div>}
                <div className="s9p-section-head">
                  <span className="s9p-section-num">{s.id}</span>
                  <h2>{highlight(s.title, query)}</h2>
                </div>

                {s.body.map((block, j) => {
                  if (block.type === "p") {
                    return <p key={j} className={`s9p-p ${block.emphasis ? "emph" : ""}`}>{highlight(block.text, query)}</p>;
                  }
                  if (block.type === "h") {
                    return <h4 key={j} className="s9p-h4">{highlight(block.text, query)}</h4>;
                  }
                  if (block.type === "ul") {
                    return (
                      <ul key={j} className="s9p-ul">
                        {block.items.map((item, k) => (
                          <li key={k}><ChevronRight size={14} /><span>{highlight(item, query)}</span></li>
                        ))}
                      </ul>
                    );
                  }
                  if (block.type === "cookies") {
                    return <CookieToggles key={j} />;
                  }
                  if (block.type === "contact") {
                    return (
                      <div key={j} className="s9p-contact">
                        <div className="s9p-contact-card">
                          <Mail size={18} />
                          <div><b>Email</b><span>info@stay9jahotels.com</span></div>
                        </div>
                        <div className="s9p-contact-card">
                          <MapPin size={18} />
                          <div><b>Address</b><span>5 Mabinuori St, Isolo, Lagos, Nigeria</span></div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                })}
              </section>
            );
          })}

          <p className="s9p-footer-note">
            Stay9jahotels.com acts as a trusted intermediary, ensuring your data is handled responsibly while
            enabling seamless hotel bookings.
          </p>
        </div>
      </div>
    </div>
  );
}
