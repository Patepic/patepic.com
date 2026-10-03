import { Link } from "react-router-dom";
import { usePageTitle } from "../hooks/usePageTitle";

export default function NotFound() {
  usePageTitle("Page not found");
  return (
    <div className="min-h-[70vh] grid place-items-center px-4">
      <div className="max-w-md text-center">
        <p className="eyebrow justify-center">404</p>
        <h1 className="display-hero mt-3 text-4xl sm:text-5xl text-void">Page not found</h1>
        <p className="mt-4 text-sm sm:text-base text-void/80">
          The page you're looking for doesn't exist or has moved.
        </p>
        <Link to="/" className="pill pill-jade h-12 px-7 text-sm mt-8">
          Back to home
        </Link>
      </div>
    </div>
  );
}
