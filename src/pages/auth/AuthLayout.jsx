import { Link } from "react-router-dom";
import { FiArrowLeft, FiCheck } from "react-icons/fi";
import PageMeta from "../../components/common/PageMeta";
import "./Auth.css";

const PERKS = [
  "Best-rate hotels across Nigeria",
  "Secure payments and instant confirmation",
  "Manage every booking from one account",
];

// Shared shell for /login, /signup and /forgot-password:
// brand panel on the left, the page's form card on the right.
export default function AuthLayout({ metaTitle, title, subtitle, children, footer }) {
  return (
    <>
      <PageMeta
        title={`${metaTitle} | Stay9ja Hotels`}
        description="Sign in or create your Stay9ja Hotels account to book hotels."
      />

      <div className="auth-page">
        <aside className="auth-brand">
          <Link to="/" className="auth-wordmark">
            Stay9ja <span>Hotels</span>
          </Link>

          <div className="auth-brand-body">
            <h2 className="auth-brand-title">
              Your next stay, <em>booked in minutes.</em>
            </h2>
            <ul className="auth-perks">
              {PERKS.map((perk) => (
                <li key={perk}>
                  <FiCheck aria-hidden="true" />
                  {perk}
                </li>
              ))}
            </ul>
          </div>

          <p className="auth-brand-foot">
            © {new Date().getFullYear()} Stay9ja Hotels
          </p>
        </aside>

        <main className="auth-main">
          <Link to="/" className="auth-back">
            <FiArrowLeft aria-hidden="true" /> Back to home
          </Link>

          <div className="auth-card">
            <Link to="/" className="auth-wordmark auth-wordmark--mobile">
              Stay9ja <span>Hotels</span>
            </Link>

            <h1 className="auth-title">{title}</h1>
            {subtitle && <p className="auth-subtitle">{subtitle}</p>}

            {children}

            {footer && <p className="auth-footer">{footer}</p>}
          </div>
        </main>
      </div>
    </>
  );
}
