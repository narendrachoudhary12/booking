import Navbar from '../components/Navbar/Navbar'
import React, { useState, useMemo, useRef, useEffect } from "react";

/* Inline icons — avoids an external icon-library dependency */
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
const KeyRound = (props) => (
  <Icon {...props}><path d="M2 18v3c0 .6.4 1 1 1h4v-3h3v-3h2l1.4-1.4a6.5 6.5 0 1 0-4-4Z" /><circle cx="16.5" cy="7.5" r=".5" fill="currentColor" /></Icon>
);

const SECTIONS = [
  {
    id: "01",
    title: "Overview of Services",
    body: [
      { type: "p", text: "Stay9jahotels.com is an online hospitality listing and booking platform that offers a range of services, including:" },
      { type: "ul", items: [
        "Online visual display of Hotels, Short Term Rentals and Guest Houses, Flights, Car Rentals, and local attraction operator listings, features and availability.",
        "Facilitates instant booking services for accommodation with Hotels, Short Term Rentals and Guest Houses, flights, car rentals, and local attraction operators.",
        "Enables secure payments via our payment gateways directly to Hotels, Short Term Rentals and Guest Houses, flights, car rentals, and local attraction operators to hold and confirm bookings.",
      ]},
      { type: "p", text: "Stay9jahotels.com is not a direct provider of advertised services. Hotels, Short Term Rentals and Guest Houses, flight, car rental, and local attraction operators are solely responsible for delivering advertised services.", emphasis: true },
    ],
  },
  {
    id: "02",
    title: "Eligibility",
    body: [
      { type: "p", text: "Users must be at least 18 years old and capable of entering into legally binding agreements to use this Platform." },
    ],
  },
  {
    id: "03",
    title: "Account Registration",
    body: [
      { type: "p", text: "To access certain features, Users may need to create an account. You agree to:" },
      { type: "ul", items: [
        "Provide accurate and complete information",
        "Keep your login credentials secure",
        "Notify us immediately of any unauthorized use",
      ]},
      { type: "p", text: "Stay9jahotels.com reserves the right to suspend or terminate user accounts that violate these Terms." },
    ],
  },
  {
    id: "04",
    title: "Bookings",
    body: [
      { type: "h", text: "4.1 Booking Relationship" },
      { type: "ul", items: [
        "Stay9jahotels.com users enter into a contract directly with the Hotel, Short Term Rental and Guest House, flight, car rental, and local attraction operators.",
        "Stay9jahotels.com acts as an intermediary facilitating the booking and transactions only.",
      ]},
      { type: "h", text: "4.2 Booking Accuracy" },
      { type: "p", text: "Users are responsible for ensuring that all booking details are correct before confirming." },
      { type: "h", text: "4.3 Operator Responsibility" },
      { type: "p", text: "Hotels, Short Term Rentals and Guest Houses, flights, car rentals, and local attraction operators are responsible for:" },
      { type: "ul", items: [
        "Providing accurate listing information",
        "Honouring confirmed bookings",
        "Delivering facilities and services as advertised",
        "Directly handling complaints related to service delivery",
      ]},
    ],
  },
  {
    id: "05",
    title: "Payments",
    body: [
      { type: "h", text: "5.1 Payment Processing" },
      { type: "p", text: "Payments are processed via our secure third-party provider, Flutterwave." },
      { type: "h", text: "5.2 Our Role" },
      { type: "ul", items: [
        "Stay9jahotels.com enables payment as an agent on behalf of the Hotels, Short Term Rentals and Guest Houses, flights, car rentals, and local attraction operators.",
        "We remit funds directly to the Hotel, Short Term Rental and Guest House, flights, car rentals, and local attraction operators (minus applicable fees).",
      ]},
      { type: "h", text: "5.3 Pricing" },
      { type: "p", text: "Prices displayed on the Platform are provided by Hotels, Short Term Rentals and Guest Houses, flights, car rentals, and local attraction operators. We do not guarantee 100% accuracy but strive to keep listings updated as accurately as possible." },
    ],
  },
  {
    id: "06",
    title: "Cancellations, Refunds & Changes",
    body: [
      { type: "h", text: "6.1 Operator Policies" },
      { type: "p", text: "Each Hotels, Short Term Rentals and Guest Houses, flights, car rentals, and local attractions operator sets its own cancellation and refund policies. These will be displayed at the time of booking." },
      { type: "h", text: "6.2 Refund Responsibility" },
      { type: "ul", items: [
        "Each operator is responsible for approving refunds.",
        "Stay9jahotels.com facilitates refund processing where applicable.",
      ]},
      { type: "h", text: "6.3 No Guarantee" },
      { type: "p", text: "Stay9jahotels.com does not guarantee refunds unless required by law or explicitly stated in the booking terms." },
    ],
  },
  {
    id: "07",
    title: "User Conduct",
    body: [
      { type: "p", text: "You agree not to:" },
      { type: "ul", items: [
        "Use the Platform for unlawful purposes",
        "Provide false or misleading information",
        "Interfere with Platform operations",
        "Attempt unauthorized access to systems",
      ]},
      { type: "p", text: "Stay9jahotels.com reserves the right to suspend or terminate access for violations." },
    ],
  },
  {
    id: "08",
    title: "Intellectual Property",
    body: [
      { type: "p", text: "All content on the Stay9jahotels.com platform, including text, logos, and design, is owned by or licensed to EP Hotel Centric Ltd. You may not copy, distribute, or use content without permission." },
    ],
  },
  {
    id: "09",
    title: "Disclaimers",
    body: [
      { type: "ul", items: [
        "Stay9jahotels.com does not guarantee the quality, safety, or suitability of any Hotel, Short Term Rental and Guest House, flight, car rental, and local attraction operator facility.",
        "Listings are provided on an \u201Cas is\u201D basis, based on information from operators.",
        "Stay9jahotels.com is not responsible for service failures of operators.",
      ]},
    ],
  },
  {
    id: "10",
    title: "Limitation of Liability",
    body: [
      { type: "p", text: "To the maximum extent permitted by law:" },
      { type: "ul", items: [
        "Stay9jahotels.com shall not be liable for any indirect, incidental, or consequential damages",
        "Stay9jahotels.com's total liability shall not exceed the amount paid for the booking in question",
      ]},
    ],
  },
  {
    id: "11",
    title: "Indemnification",
    body: [
      { type: "p", text: "The user agrees to indemnify and hold harmless Stay9jahotels.com from any claims arising from:" },
      { type: "ul", items: [
        "User's use of the Platform",
        "User's breach of these Terms",
        "Disputes between users and the Hotel, Short Term Rental and Guest House, flights, car rentals, and local attraction operators",
      ]},
    ],
  },
  {
    id: "12",
    title: "Termination",
    body: [
      { type: "p", text: "Stay9jahotels.com may suspend or terminate user access at any time if the user breaches these Terms or misuses the Platform." },
    ],
  },
  {
    id: "13",
    title: "Governing Law",
    body: [
      { type: "p", text: "These Terms are governed by the laws of:" },
      { type: "ul", items: ["The United Kingdom, and applicable laws of the Federal Republic of Nigeria"] },
    ],
  },
  {
    id: "14",
    title: "Dispute Resolution",
    body: [
      { type: "p", text: "Disputes should first be resolved through good-faith negotiations. If unresolved, disputes may be subject to:" },
      { type: "ul", items: ["Courts of competent jurisdiction in the UK or Nigeria"] },
    ],
  },
  {
    id: "15",
    title: "Changes to These Terms",
    body: [
      { type: "p", text: "We may update these Terms from time to time. Continued use of the Stay9jahotels.com platform constitutes acceptance of the revised Terms." },
    ],
  },
  {
    id: "16",
    title: "Contact Information",
    body: [
      { type: "contact" },
    ],
  },
];

function highlight(text, query) {
  if (!query) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="s9j-mark">{text.slice(idx, idx + query.length)}</mark>
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
    if (b.type === "contact") return "email address contact info@stay9jahotels.com isolo lagos".includes(q);
    return false;
  });
}

export default function Stay9jaHotelsTermsOfService() {
  const [active, setActive] = useState("01");
  const [query, setQuery] = useState("");
  const [navOpen, setNavOpen] = useState(false);
  const refs = useRef({});
  const containerRef = useRef(null);

  const filtered = useMemo(
    () => SECTIONS.filter((s) => sectionMatches(s, query)),
    [query]
  );

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
    <div className="s9j-root">
      <style>{`
        .s9j-root {
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
        .s9j-topbar {
          background: linear-gradient(135deg, var(--panel) 0%, var(--panel-deep) 100%);
          color: #f4efe0;
          padding: 22px 28px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          flex-shrink: 0;
        }
        .s9j-brand {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .s9j-brand-mark {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: rgba(200,162,74,0.16);
          border: 1px solid var(--gold);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--gold-soft);
          flex-shrink: 0;
        }
        .s9j-brand-text h1 {
          font-family: "Playfair Display", "Iowan Old Style", Georgia, serif;
          font-size: 19px;
          letter-spacing: 0.02em;
          margin: 0;
          font-weight: 600;
          color: #fbf7ea;
        }
        .s9j-brand-text p {
          margin: 2px 0 0;
          font-size: 11.5px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--gold-soft);
          font-family: Georgia, serif;
        }
        .s9j-search {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(228,205,143,0.35);
          border-radius: 999px;
          padding: 8px 14px;
          min-width: 200px;
        }
        .s9j-search input {
          background: transparent;
          border: none;
          outline: none;
          color: #f4efe0;
          font-size: 13px;
          font-family: Georgia, serif;
          width: 100%;
        }
        .s9j-search input::placeholder { color: rgba(244,239,224,0.55); }
        .s9j-menu-btn {
          display: none;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(228,205,143,0.35);
          color: #f4efe0;
          border-radius: 8px;
          padding: 8px;
          cursor: pointer;
        }
        .s9j-body {
          display: flex;
          flex: 1;
          min-height: 0;
        }
        .s9j-nav {
          width: 258px;
          flex-shrink: 0;
          background: #f1ecdc;
          border-right: 1px solid var(--line);
          overflow-y: auto;
          padding: 16px 12px;
        }
        .s9j-nav-label {
          font-size: 10.5px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--ink-soft);
          padding: 6px 10px 10px;
        }
        .s9j-key {
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
          text-align: left;
          border: none;
          background: transparent;
          padding: 9px 10px;
          border-radius: 8px;
          cursor: pointer;
          font-family: Georgia, serif;
          color: var(--ink);
          margin-bottom: 2px;
          transition: background 0.15s ease;
        }
        .s9j-key:hover { background: rgba(200,162,74,0.14); }
        .s9j-key.active {
          background: var(--panel);
          color: #f4efe0;
        }
        .s9j-key-num {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.04em;
          width: 26px;
          height: 26px;
          border-radius: 6px;
          border: 1px solid var(--gold);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--gold);
          flex-shrink: 0;
          background: #fff;
        }
        .s9j-key.active .s9j-key-num {
          background: var(--gold);
          color: var(--panel-deep);
          border-color: var(--gold);
        }
        .s9j-key-title {
          font-size: 13px;
          line-height: 1.3;
        }
        .s9j-nav-empty {
          padding: 20px 12px;
          font-size: 13px;
          color: var(--ink-soft);
        }
        .s9j-content {
          flex: 1;
          overflow-y: auto;
          padding: 32px 40px 60px;
        }
        .s9j-intro {
          background: var(--card);
          border: 1px solid var(--line);
          border-left: 4px solid var(--gold);
          border-radius: 10px;
          padding: 18px 22px;
          margin-bottom: 28px;
          font-size: 14px;
          line-height: 1.7;
          color: var(--ink-soft);
        }
        .s9j-intro b { color: var(--ink); }
        .s9j-section {
          margin-bottom: 30px;
          scroll-margin-top: 20px;
        }
        .s9j-section-head {
          display: flex;
          align-items: baseline;
          gap: 12px;
          margin-bottom: 12px;
          padding-bottom: 8px;
          border-bottom: 1px solid var(--line);
        }
        .s9j-section-num {
          font-family: "Playfair Display", Georgia, serif;
          font-size: 15px;
          color: var(--gold);
          font-weight: 700;
        }
        .s9j-section-head h2 {
          font-family: "Playfair Display", Georgia, serif;
          font-size: 20px;
          margin: 0;
          font-weight: 600;
          color: var(--ink);
        }
        .s9j-p {
          font-size: 14.5px;
          line-height: 1.75;
          margin: 0 0 12px;
          color: var(--ink);
        }
        .s9j-p.emph {
          background: #fff7e6;
          border: 1px solid var(--gold-soft);
          border-radius: 8px;
          padding: 12px 14px;
          font-style: italic;
        }
        .s9j-h4 {
          font-size: 12.5px;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--panel);
          margin: 16px 0 8px;
          font-weight: 700;
          font-family: Georgia, serif;
        }
        .s9j-ul {
          margin: 0 0 14px;
          padding: 0;
          list-style: none;
        }
        .s9j-ul li {
          display: flex;
          gap: 10px;
          font-size: 14.5px;
          line-height: 1.65;
          margin-bottom: 8px;
          color: var(--ink);
        }
        .s9j-ul li svg { flex-shrink: 0; margin-top: 4px; color: var(--gold); }
        .s9j-mark {
          background: var(--gold-soft);
          color: var(--panel-deep);
          padding: 0 2px;
          border-radius: 3px;
        }
        .s9j-contact {
          display: flex;
          flex-wrap: wrap;
          gap: 14px;
        }
        .s9j-contact-card {
          flex: 1;
          min-width: 200px;
          background: var(--card);
          border: 1px solid var(--line);
          border-radius: 10px;
          padding: 16px 18px;
          display: flex;
          gap: 12px;
          align-items: flex-start;
        }
        .s9j-contact-card svg { color: var(--gold); flex-shrink: 0; margin-top: 2px; }
        .s9j-contact-card b { display: block; font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: var(--ink-soft); margin-bottom: 3px; }
        .s9j-contact-card span { font-size: 14px; color: var(--ink); }
        .s9j-footer-note {
          margin-top: 28px;
          padding-top: 18px;
          border-top: 1px dashed var(--line);
          font-size: 13px;
          color: var(--ink-soft);
          font-style: italic;
          text-align: center;
        }
        @media (max-width: 760px) {
          .s9j-search { min-width: 0; flex: 1; }
          .s9j-brand-text p { display: none; }
          .s9j-menu-btn { display: flex; }
          .s9j-nav {
            position: absolute;
            z-index: 5;
            top: 0; left: 0; bottom: 0;
            transform: translateX(-100%);
            transition: transform 0.2s ease;
            width: 240px;
            box-shadow: 4px 0 16px rgba(0,0,0,0.18);
          }
          .s9j-nav.open { transform: translateX(0); }
          .s9j-content { padding: 24px 18px 50px; }
        }
      `}</style>

      {/* <<div className="s9j-topbar">
        <div className="s9j-brand">
          <button className="s9j-menu-btn" onClick={() => setNavOpen((o) => !o)} aria-label="Toggle sections">
            {navOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
          <div className="s9j-brand-mark">
            <KeyRound size={19} />
          </div>
          <div className="s9j-brand-text">
            <h1>Stay9jaHotels.com</h1>
            <p>Terms of Service</p>
          </div>
        </div>
        <div className="s9j-search">
          <Search size={15} color="#e4cd8f" />
          <input
            placeholder="Search these terms…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>> */}
    <Navbar/>
      <div className="s9j-body">
        <nav className={`s9j-nav ${navOpen ? "open" : ""}`}>
          <div className="s9j-nav-label">Directory · 16 Sections</div>
          {filtered.length === 0 && (
            <div className="s9j-nav-empty">No sections match "{query}".</div>
          )}
          {filtered.map((s) => (
            <button
              key={s.id}
              className={`s9j-key ${active === s.id ? "active" : ""}`}
              onClick={() => scrollTo(s.id)}
            >
              <span className="s9j-key-num">{s.id}</span>
              <span className="s9j-key-title">{s.title}</span>
            </button>
          ))}
        </nav>

        <div className="s9j-content" ref={containerRef}>
          <div className="s9j-intro">
            These Terms of Service (<b>"Terms"</b>) govern your access to and use of{" "}
            <b>www.stay9jahotels.com</b> (the "Platform"), operated by <b>EP Hotel Centric Ltd</b> ("we", "our",
            "us"). By using the Platform, you agree to be bound by these Terms.
          </div>

          {filtered.length === 0 && query && (
            <p className="s9j-p">Try a different search term, or clear the search to see all sections.</p>
          )}

          {filtered.map((s) => (
            <section
              key={s.id}
              className="s9j-section"
              ref={(el) => (refs.current[s.id] = el)}
            >
              <div className="s9j-section-head">
                <span className="s9j-section-num">{s.id}</span>
                <h2>{highlight(s.title, query)}</h2>
              </div>

              {s.body.map((block, i) => {
                if (block.type === "p") {
                  return (
                    <p key={i} className={`s9j-p ${block.emphasis ? "emph" : ""}`}>
                      {highlight(block.text, query)}
                    </p>
                  );
                }
                if (block.type === "h") {
                  return <h4 key={i} className="s9j-h4">{highlight(block.text, query)}</h4>;
                }
                if (block.type === "ul") {
                  return (
                    <ul key={i} className="s9j-ul">
                      {block.items.map((item, j) => (
                        <li key={j}>
                          <ChevronRight size={14} />
                          <span>{highlight(item, query)}</span>
                        </li>
                      ))}
                    </ul>
                  );
                }
                if (block.type === "contact") {
                  return (
                    <div key={i} className="s9j-contact">
                      <div className="s9j-contact-card">
                        <Mail size={18} />
                        <div>
                          <b>Email</b>
                          <span>info@stay9jahotels.com</span>
                        </div>
                      </div>
                      <div className="s9j-contact-card">
                        <MapPin size={18} />
                        <div>
                          <b>Address</b>
                          <span>5 Mabinuori Street, Isolo, Lagos, Nigeria</span>
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              })}
            </section>
          ))}

          <p className="s9j-footer-note">
            By using Stay9jahotels.com, you acknowledge that you understand and agree to these Terms of Service.
          </p>
        </div>
      </div>
    </div>
  );
}
