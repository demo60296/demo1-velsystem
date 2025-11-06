import { Link } from "react-router-dom";

interface FooterLink {
  to: string;
  label: string;
}

interface PublicFooterProps {
  links?: FooterLink[];
}

export default function PublicFooter({ links }: PublicFooterProps) {
  const defaultLinks: FooterLink[] = [
    { to: "/about", label: "About" },
    { to: "/privacy", label: "Privacy Policy" },
    { to: "/terms", label: "Terms & Conditions" },
  ];

  const footerLinks = links || defaultLinks;

  const handleLinkClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-5 py-8 flex flex-col sm:flex-row justify-center sm:justify-between items-center gap-4">
        <div className="text-xs sm:text-sm text-gray-400 text-center sm:text-left">
          © {new Date().getFullYear()} ExpenseTrace. All rights reserved.
        </div>
        <div className="flex flex-wrap justify-center gap-4 text-sm sm:text-base">
          {footerLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="hover:text-white transition"
              onClick={handleLinkClick}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
