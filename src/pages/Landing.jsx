import { useState } from "react";
import { Shield, Zap, Users, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import DemoBookingModal from "@/components/landing/DemoBookingModal";
import AICopilot from "@/components/landing/AICopilot";
import GSTServices from "@/components/landing/GSTServices";
import CAConsultation from "@/components/landing/CAConsultation";
import ProjectReports from "@/components/landing/ProjectReports";
import Stats from "@/components/landing/Stats";
import FeaturedServices from "@/components/landing/FeaturedServices";
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

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-5 overflow-hidden">
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />

        {/* Background Elements */}
        <div className="absolute top-20 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-50 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl opacity-50 pointer-events-none" />

        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex justify-center mb-8"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10">
                <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                <span className="text-sm text-primary font-medium">
                  India's #1 Tax-Tech Platform
                </span>
              </div>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl sm:text-5xl lg:text-7xl font-bold text-foreground leading-tight mb-6"
            >
              TaxPlan Advisor.{" "}<br />
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
              Connect with verified Tax Consultants, file taxes with AI-powered
              assistance, and manage all compliance from one Intelligent platform.
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
          </div>
        </div>

      </section>
      <FeaturedServices />
      <Stats />
      <HowItWorks />
      {/* <GSTServices /> */}
      <AICopilot />
      <CAConsultation />
      {/* <ProjectReports /> */}
      <ForCAs />
      <Features />
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
