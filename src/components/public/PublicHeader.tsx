import { Link } from "react-router-dom";

interface PublicHeaderProps {
  variant?: "default" | "sticky";
}

export default function PublicHeader({ variant = "default" }: PublicHeaderProps) {
  const headerClass = variant === "sticky"
    ? "sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100"
    : "w-full bg-white shadow-sm";

  return (
    <header className={headerClass}>
      <div className="flex w-full px-4 py-3 sm:px-6 sm:py-4 items-center justify-between max-w-7xl mx-auto">
        <Link to="/" className="flex-shrink-0" onClick={() => window.scrollTo(0, 0)}>
          <img
            src="/logo.png"
            alt="ExpenseTrace Logo"
            className="h-7 sm:h-10 lg:h-12 w-auto"
            loading="lazy"
          />
        </Link>

        <Link
          to="/log-in-or-create-account"
          className="px-3 py-1.5 sm:px-5 sm:py-2 bg-blue-600 text-white rounded-full text-sm sm:text-base font-semibold shadow hover:bg-blue-700 transition"
        >
          Sign In
        </Link>
      </div>
    </header>
  );
}
