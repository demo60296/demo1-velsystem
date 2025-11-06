import PublicHeader from "../components/public/PublicHeader";
import PublicFooter from "../components/public/PublicFooter";
import HeroSection from "../components/public/HeroSection";
import CTASection from "../components/public/CTASection";
import ContentSection from "../components/public/ContentSection";

export default function PrivacyPolicyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <PublicHeader />

      <main className="flex-grow">
        <HeroSection
          title="Privacy Policy"
          description="Your privacy is important to us. Learn how we collect, use, and protect your information."
        />

        <ContentSection>
          <div className="max-w-4xl mx-auto px-5 text-gray-700 space-y-10">
            {[
              {
                title: "1. Information We Collect",
                text: "We may collect personal details such as your name, email address, and financial data you provide while using ExpenseTrace. This information helps us deliver services like expense tracking and budget insights."
              },
              {
                title: "2. How We Use Your Information",
                text: "We use your data to improve your financial management experience, provide insights, and ensure a personalized service. We never sell your data to third parties."
              },
              {
                title: "3. Data Security",
                text: "Protecting your information is our top priority. We use industry standard security practices to safeguard your data against unauthorized access, alteration, or disclosure."
              },
              {
                title: "4. Third-Party Services",
                text: "ExpenseTrace may integrate with trusted third-party services to enhance your experience. These services follow their own privacy policies, which we encourage you to review."
              },
              {
                title: "5. Your Rights",
                text: "You have the right to access, update, or delete your personal information at any time. Contact us if you wish to exercise these rights or have any privacy-related concerns."
              },
              {
                title: "6. Changes to This Policy",
                text: "We may update this Privacy Policy from time to time. Updates will be reflected on this page with a revised effective date."
              }
            ].map((item, i) => (
              <div key={i}>
                <h2 className="text-lg sm:text-2xl font-semibold text-gray-900 mb-3">
                  {item.title}
                </h2>
                <p className="text-base sm:text-lg leading-relaxed sm:leading-loose">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </ContentSection>

        <CTASection
          title="Have Questions?"
          description="If you have any concerns about your privacy, feel free to reach out to our support team anytime."
          buttonText="Contact Us"
          buttonLink="/about"
        />
      </main>

      <PublicFooter links={[
        { to: "/terms", label: "Terms & Conditions" },
        { to: "/about", label: "About" }
      ]} />
    </div>
  );
}