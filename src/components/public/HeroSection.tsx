import React from "react";

interface HeroSectionProps {
  title: string | React.ReactNode;
  description: string;
  highlightColor?: "yellow" | "blue";
}

export default function HeroSection({
  title,
  description,
  highlightColor = "yellow"
}: HeroSectionProps) {
  return (
    <section className="py-10 sm:py-20 lg:py-28 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white text-center">
      <div className="max-w-3xl mx-auto px-5">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-5 leading-snug">
          {title}
        </h1>
        <p className={`text-base sm:text-lg lg:text-xl leading-relaxed ${
          highlightColor === "yellow" ? "opacity-90" : ""
        }`}>
          {description}
        </p>
      </div>
    </section>
  );
}
