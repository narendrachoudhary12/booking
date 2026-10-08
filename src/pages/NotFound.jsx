import { Link } from "react-router-dom";
import PageMeta from "../components/common/PageMeta";
import Navbar from "../components/Navbar/Navbar";
import "./NotFound.css";

export default function NotFound() {
  return (
    <>
      <PageMeta
        title="Page not found | Stay9ja Hotels"
        description="The page you are looking for could not be found."
      />
      <Navbar />
      <main className="nf-wrap">
        <p className="nf-code">404</p>
        <h1 className="nf-title">We can’t find that page</h1>
        <p className="nf-text">
          The link may be broken, or the page may have been moved.
        </p>
        <Link to="/" className="nf-btn">
          Back to home
        </Link>
      </main>
    </>
  );
}
