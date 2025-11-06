import { Link } from "react-router-dom";

interface CTASectionProps {
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
}

export default function CTASection({
  title,
  description,
  buttonText,
  buttonLink
}: CTASectionProps) {
  return (
    <section className="py-14 sm:py-24 lg:py-32 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white text-center">
      <div className="max-w-2xl mx-auto px-5">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-5">
          {title}
        </h2>
        <p className="text-base sm:text-lg lg:text-xl mb-8 leading-relaxed opacity-90">
          {description}
        </p>
        <Link
          to={buttonLink}
          className="inline-block px-6 sm:px-8 py-3 sm:py-4 bg-white text-blue-600 rounded-full text-base sm:text-lg font-semibold hover:bg-gray-100 transition shadow-lg"
          onClick={() => window.scrollTo(0, 0)}
        >
          {buttonText}
        </Link>
      </div>
    </section>
  );
}
