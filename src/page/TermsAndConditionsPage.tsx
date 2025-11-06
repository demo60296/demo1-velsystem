import PublicHeader from "../components/public/PublicHeader";
import PublicFooter from "../components/public/PublicFooter";
import HeroSection from "../components/public/HeroSection";
import CTASection from "../components/public/CTASection";
import ContentSection from "../components/public/ContentSection";

export default function TermsAndConditionsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <PublicHeader />

      <main className="flex-grow">
        <HeroSection
          title="Terms & Conditions"
          description="Please read these terms carefully before using ExpenseTrace."
        />

        <ContentSection>
          <div className="max-w-4xl mx-auto px-5 text-gray-700 space-y-10">
            {[
              {
                title: "1. Acceptance of Terms",
                text: "By accessing or using ExpenseTrace, you agree to comply with these Terms & Conditions. If you do not agree, please do not use our services.",
              },
              {
                title: "2. Use of Services",
                text: "ExpenseTrace provides tools to track income, expenses, and budgets. You agree to use the platform for lawful purposes and not misuse or disrupt the service in any way.",
              },
              {
                title: "3. User Responsibilities",
                text: "You are responsible for maintaining the confidentiality of your account and ensuring the accuracy of the information you provide within ExpenseTrace.",
              },
              {
                title: "4. Intellectual Property",
                text: "All content, trademarks, and intellectual property on ExpenseTrace belong to us or our licensors. You may not copy, distribute, or exploit them without permission.",
              },
              {
                title: "5. Limitation of Liability",
                text: 'ExpenseTrace is provided on an "as-is" basis. We are not liable for any losses or damages resulting from the use of our platform.',
              },
              {
                title: "6. Changes to Terms",
                text: "We may update these Terms & Conditions from time to time. The latest version will always be available on this page with a revised effective date.",
              },
            ].map((section, idx) => (
              <div key={idx}>
                <h2 className="text-lg sm:text-2xl font-semibold text-gray-900 mb-3">
                  {section.title}
                </h2>
                <p className="text-base sm:text-lg leading-relaxed sm:leading-loose">
                  {section.text}
                </p>
              </div>
            ))}
          </div>
        </ContentSection>

        <CTASection
          title="Need Assistance?"
          description="If you have questions about these Terms & Conditions, feel free to reach out to our support team."
          buttonText="Contact Us"
          buttonLink="/about"
        />
      </main>

      <PublicFooter links={[
        { to: "/privacy", label: "Privacy Policy" },
        { to: "/about", label: "About" }
      ]} />
    </div>
  );
}