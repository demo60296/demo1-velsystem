import { Users, Target, ShieldCheck, Github, Linkedin } from "lucide-react";
import PublicHeader from "../components/public/PublicHeader";
import PublicFooter from "../components/public/PublicFooter";
import HeroSection from "../components/public/HeroSection";
import CTASection from "../components/public/CTASection";
import ContentSection from "../components/public/ContentSection";

export default function AboutPage() {
  const values = [
    {
      icon: <Users className="w-12 h-12 text-blue-600 mb-5" />,
      title: "Simplicity",
      text: "We believe financial tools should be intuitive, clear, and easy for everyone to use.",
    },
    {
      icon: <Target className="w-12 h-12 text-green-600 mb-5" />,
      title: "Empowerment",
      text: "We provide insights that help users take control of their money and reach their goals faster.",
    },
    {
      icon: <ShieldCheck className="w-12 h-12 text-blue-600 mb-5" />,
      title: "Trust",
      text: "Security and privacy are at the heart of everything we build. Your data is always safe with us.",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <PublicHeader />

      <main className="flex-grow">
        <HeroSection
          title={
            <>
              About <span className="text-yellow-300">ExpenseTrace</span>
            </>
          }
          description="We're on a mission to make personal finance simple, smart, and stress-free for everyone."
        />

        <ContentSection>
          <div className="max-w-6xl mx-auto px-5">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center text-gray-900 mb-12">
              Our Core Values
            </h2>
            <div className="grid md:grid-cols-3 gap-8 sm:gap-10">
              {values.map((val, idx) => (
                <div
                  key={idx}
                  className="p-6 sm:p-8 bg-gray-50 rounded-2xl shadow-sm hover:shadow-md transition flex flex-col items-center text-center"
                >
                  {val.icon}
                  <h3 className="text-lg sm:text-xl font-semibold mb-3">
                    {val.title}
                  </h3>
                  <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                    {val.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </ContentSection>

        <ContentSection>
          <div className="max-w-4xl mx-auto px-5 text-center">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-8">
              Meet the Developer
            </h2>
            <div className="p-6 sm:p-8 bg-gray-50 rounded-2xl shadow-sm">
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-2">
                Ezhil Selvan P
              </h3>
              <p className="text-gray-600 mb-4">Full-Stack Developer</p>

              <p className="text-gray-700 text-sm sm:text-base mb-4 leading-relaxed">
                🚀 Building <strong>ExpenseTrace</strong> – a personal finance &
                budget tracking app that makes money management simple and
                stress-free.
              </p>

              <p className="text-gray-700 text-sm sm:text-base mb-6">
                Spring · React.js · PostgreSQL · Docker
              </p>

              <div className="flex justify-center gap-6 text-2xl">
                <a
                  href="https://github.com/ezhilselvan1109"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-900 hover:text-gray-700 transition"
                >
                  <Github />
                </a>
                <a
                  href="https://www.linkedin.com/in/ezhilselvan1109"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 transition"
                >
                  <Linkedin />
                </a>
              </div>
            </div>
          </div>
        </ContentSection>

        <CTASection
          title="Join Us on the Journey"
          description="ExpenseTrace is more than just an app — it's a step toward a brighter financial future."
          buttonText="Get Started Free"
          buttonLink="/log-in-or-create-account"
        />
      </main>

      <PublicFooter links={[
        { to: "/privacy", label: "Privacy Policy" },
        { to: "/terms", label: "Terms & Conditions" }
      ]} />
    </div>
  );
}