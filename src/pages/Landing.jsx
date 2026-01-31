import { useState } from "react";
import { Shield, Zap, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import DemoBookingModal from "@/components/landing/DemoBookingModal";
import AICopilot from "@/components/landing/AICopilot";
import GSTServices from "@/components/landing/GSTServices";
import CAConsultation from "@/components/landing/CAConsultation";
import ProjectReports from "@/components/landing/ProjectReports";
import Stats from "@/components/landing/Stats";
import Features from "@/components/landing/Features";
import HowItWorks from "@/components/landing/HowItWorks";
import ForCAs from "@/components/landing/ForCAs";
import Footer from "@/components/landing/Footer";
import Navbar from "@/components/landing/Navbar";

const Landing = () => {
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20">
      <Navbar />

      <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />

        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 mb-8"
            >
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-sm text-primary font-medium">
                India's #1 Tax-Tech Platform
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl sm:text-5xl lg:text-7xl font-bold text-foreground leading-tight mb-6"
            >
              TaxPlan Advisor.{" "}
              <span className="gradient-text">
                AI That Simplifies.
              </span>{" "}
              <span className="gradient-text-accent">Taxes, GST & Business Finance</span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
            >
              Connect with ICAI-verified Chartered Accountants, file taxes with AI-powered
              assistance, and manage all compliance from one intelligent platform.
            </motion.p>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex justify-center mb-16"
            >
              <Button
                size="lg"
                onClick={() => setIsDemoModalOpen(true)}
                className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-8 py-6 rounded-xl font-medium"
              >
                Book a Demo
              </Button>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.8 }}
              className="flex flex-wrap items-center justify-center gap-8"
            >
              {/* {[
                { icon: Shield, text: "Bank-Grade Security" },
                { icon: Users, text: "500+ CAs Registered" },
                { icon: Zap, text: "AI-Powered Matching" },
              ].map((item) => (
                <div
                  key={item.text}
                  className="flex items-center gap-2 text-muted-foreground"
                >
                  <item.icon className="w-5 h-5 text-primary" />
                  <span className="text-sm">{item.text}</span>
                </div>
              ))} */}
            </motion.div>
          </div>
        </div>
      </section>

      <Stats />
      <AICopilot />
      <GSTServices />
      <CAConsultation />
      <ProjectReports />
      <Features />
      <HowItWorks />
      <ForCAs />
      <Footer />

      {/* Demo Booking Modal */}
      <DemoBookingModal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
        title="Book a Demo"
        queryType="Demo Request"
      />
    </div>
  );
};

export default Landing;
