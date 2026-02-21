import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Activity, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import hospitalHeroBg from "@/assets/hospital-hero-bg.jpg";

const HeroSection = () => {
  return (
    <header className="relative overflow-hidden min-h-[650px] flex items-center">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
        style={{ backgroundImage: `url(${hospitalHeroBg})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/85 to-background/50" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />

      <div className="container mx-auto px-4 py-20 md:py-28 relative z-10">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-primary/15 backdrop-blur-md text-primary px-5 py-2.5 rounded-full mb-8 border border-primary/25 shadow-sm"
          >
            <Activity className="w-4 h-4 animate-pulse" />
            <span className="text-sm font-semibold tracking-wide">Hospital Referral Management</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-[1.1] tracking-tight"
          >
            Streamline Medical Referrals with{" "}
            <span className="text-gradient">Hospital Flow</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl leading-relaxed"
          >
            A comprehensive hospital-to-hospital referral system that enables seamless patient transfers,
            real-time tracking, and secure communication between healthcare providers.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Button asChild size="lg" className="gap-2 shadow-lg text-base px-8 h-12">
              <Link to="/login">
                Get Started
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="backdrop-blur-sm bg-background/50 text-base px-8 h-12">
              <Link to="/login">Sign In</Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </header>
  );
};

export default HeroSection;
