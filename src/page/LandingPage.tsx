import React from "react";
import { BarChart3, Wallet, PieChart, Shield, Zap } from "lucide-react";
import Layout from "./Layout";
import Button from "../components/public/Button";
import CTASection from "../components/public/CTASection";

type FeatureColor = "blue" | "yellow" | "green";

const LandingPage: React.FC = () => {
  const [openIndex, setOpenIndex] = React.useState<number | null>(null);

  const featureColors = {
    blue: "text-blue-500",
    yellow: "text-yellow-400",
    green: "text-green-500",
  };

  const steps = [
    {
      icon: Wallet,
      title: "Add Accounts & Categories",
      desc: "Create categories and link multiple accounts in seconds.",
    },
    {
      icon: BarChart3,
      title: "Track & Schedule Transactions",
      desc: "Record transactions or let them sync automatically.",
    },
    {
      icon: PieChart,
      title: "Analyze & Manage Debt",
      desc: "Dashboards show spending, budgets, and debt at a glance.",
    },
  ];

  const features = [
    {
      icon: Shield,
      title: "Full Financial Suite",
      desc: "Manage categories, accounts, transactions, debt, and analysis.",
      color: "blue",
    },
    {
      icon: Zap,
      title: "Smart Scheduling",
      desc: "Automate recurring transactions easily.",
      color: "yellow",
    },
    {
      icon: BarChart3,
      title: "Actionable Insights",
      desc: "Understand spending patterns and hit goals faster.",
      color: "green",
    },
  ];

  const faqs = [
    {
      q: "How to create sub-categories?",
      a: "Use Tags to simulate sub-categories. For example, add a 'milk' tag to transactions categorized under Food.",
    },
    {
      q: "How to manage multiple accounts?",
      a: "Use Tags like 'business' or 'personal' to separate accounts. You can filter or analyze by tag easily.",
    },
    {
      q: "What are transfer transactions?",
      a: "They help track transfers between payment modes — for example, credit card bill payments or ATM withdrawals.",
    },
    {
      q: "How to edit or create new categories?",
      a: "The app includes 18 default categories. You can add or modify categories anytime on the Categories page.",
    },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 text-white py-20 sm:py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 flex flex-col items-center text-center space-y-8">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight max-w-3xl">
            Manage & Automate{" "}
            <span className="text-blue-200">All Your Finances</span>
          </h1>

          <p className="text-base sm:text-lg lg:text-xl text-blue-50/90 leading-relaxed max-w-2xl">
            From categories to accounts, transactions, and debt — everything
            you need to stay in control of your money in one powerful app.
          </p>

          <div className="pt-4">
            <Button to="/log-in-or-create-account" variant="secondary">
              Get Started
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 sm:py-24 bg-gradient-to-b from-blue-50 to-white text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-14">
          How It Works in <span className="text-blue-600">3 Easy Steps</span>
        </h2>
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-14 px-5">
          {steps.map((step, i) => (
            <div key={i} className="flex flex-col items-center space-y-3">
              <div className="w-20 h-20 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full">
                <step.icon className="w-10 h-10" />
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900">
                {step.title}
              </h3>
              <p className="text-gray-600 text-base leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-16 sm:py-24 bg-white">
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-14">
          Why Our App Stands Out
        </h2>
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-14 px-5 text-center">
          {features.map((f, i) => (
            <div key={i} className="space-y-3">
              <div className={`flex justify-center ${featureColors[f.color as FeatureColor]}`}>
                <f.icon className="w-16 h-16" />
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900">
                {f.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-3xl mx-auto px-5">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-10">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            {faqs.map((f, i) => (
              <div
                key={i}
                className="pb-4 cursor-pointer"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
                    {f.q}
                  </h3>
                  <span
                    className={`transform transition-transform duration-300 text-gray-500 ${openIndex === i ? "rotate-180" : "rotate-0"
                      }`}
                  >
                    ▼
                  </span>
                </div>

                <div
                  className={`transition-all duration-500 ease-in-out overflow-hidden ${openIndex === i
                    ? "max-h-40 opacity-100 mt-2"
                    : "max-h-0 opacity-0"
                    }`}
                >
                  <p className="text-gray-600 text-base leading-relaxed">
                    {f.a}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      <CTASection
        title="Ready to take control of your finances?"
        description="Join thousands of users already using ExpenseTrace to manage accounts, categories, transactions, debt, and analysis."
        buttonText="Start Free Today"
        buttonLink="/log-in-or-create-account"
      />
    </Layout>
  );
};

export default LandingPage;