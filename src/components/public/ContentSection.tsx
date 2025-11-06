import React from "react";

interface ContentSectionProps {
  children: React.ReactNode;
  className?: string;
}

export default function ContentSection({ children, className = "" }: ContentSectionProps) {
  return (
    <section className={`py-12 sm:py-20 lg:py-24 bg-white ${className}`}>
      {children}
    </section>
  );
}
