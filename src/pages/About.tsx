import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import LandingNav from "@/components/landing/LandingNav";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Building2,
  FileText,
  Shield,
  Users,
  Clock,
  Zap,
  MessageSquare,
  BarChart3,
  Bell,
  Brain,
  Globe,
  Smartphone,
  AlertTriangle,
  TrendingUp,
  Lightbulb,
  Target,
  Heart,
  CheckCircle2,
} from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
};

const stagger = {
  initial: {},
  whileInView: { transition: { staggerChildren: 0.1 } },
  viewport: { once: true, margin: "-50px" },
};

const features = [
  {
    icon: FileText,
    title: "Digital Referral Management",
    desc: "Create, send, and track patient referrals digitally — replacing paper-based processes with a seamless workflow.",
  },
  {
    icon: Clock,
    title: "Real-Time Status Tracking",
    desc: "Monitor referral progress from pending to completion with live status updates and notifications.",
  },
  {
    icon: MessageSquare,
    title: "Secure Messaging",
    desc: "Built-in communication between referring and receiving doctors for coordination and clinical discussions.",
  },
  {
    icon: Shield,
    title: "Role-Based Access Control",
    desc: "Doctors, admins, and patients each see only what they need — with row-level security on all data.",
  },
  {
    icon: Brain,
    title: "AI Health Assistant",
    desc: "An AI-powered chatbot that educates patients on common diseases, symptoms, and prevention while assisting with referral queries.",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    desc: "Visual insights into referral volumes, turnaround times, acceptance rates, and hospital performance.",
  },
  {
    icon: Bell,
    title: "Notification System",
    desc: "Instant alerts for new referrals, status changes, and messages to keep all parties informed.",
  },
  {
    icon: Users,
    title: "Doctor Directory",
    desc: "Searchable directory of specialists with ratings, availability status, and contact information.",
  },
  {
    icon: Zap,
    title: "Referral Templates",
    desc: "Pre-built and custom templates to standardize referral documentation and reduce administrative burden.",
  },
  {
    icon: Building2,
    title: "Multi-Hospital Support",
    desc: "Designed for inter-hospital transfers, enabling referrals across different healthcare facilities.",
  },
];

const challenges = [
  {
    icon: AlertTriangle,
    title: "Internet Connectivity",
    desc: "Many healthcare facilities, especially in rural areas, have limited or unreliable internet access which can affect system usability.",
  },
  {
    icon: Shield,
    title: "Data Privacy & Compliance",
    desc: "Ensuring patient data confidentiality and meeting regulatory requirements for health information exchange.",
  },
  {
    icon: Users,
    title: "User Adoption & Training",
    desc: "Healthcare workers accustomed to paper-based systems may resist digital transformation without proper onboarding.",
  },
  {
    icon: Globe,
    title: "Interoperability",
    desc: "Integrating with existing hospital information systems (HIS/EMR) that use different data standards.",
  },
  {
    icon: Smartphone,
    title: "Device Accessibility",
    desc: "Not all healthcare providers have access to modern devices capable of running web applications.",
  },
  {
    icon: Clock,
    title: "Real-Time Synchronization",
    desc: "Maintaining data consistency across multiple hospitals when network conditions are unreliable.",
  },
];

const futureAdvancements = [
  {
    icon: Brain,
    title: "AI-Powered Triage & Routing",
    desc: "Machine learning algorithms to automatically suggest the best receiving hospital and specialist based on patient condition, hospital capacity, and proximity.",
  },
  {
    icon: Smartphone,
    title: "Mobile Application",
    desc: "Dedicated native mobile apps for Android and iOS to improve accessibility for healthcare workers on the go.",
  },
  {
    icon: Globe,
    title: "HL7 FHIR Integration",
    desc: "Full compliance with international health data exchange standards for seamless interoperability with EMR/EHR systems.",
  },
  {
    icon: TrendingUp,
    title: "Predictive Analytics",
    desc: "Forecasting referral volumes, identifying bottlenecks, and optimizing resource allocation using historical data.",
  },
  {
    icon: Heart,
    title: "Telemedicine Integration",
    desc: "Video consultations between referring and receiving doctors, reducing unnecessary physical transfers.",
  },
  {
    icon: Target,
    title: "Outcome Tracking & Research",
    desc: "Long-term patient outcome monitoring to build evidence-based referral pathways and improve care quality.",
  },
];

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <LandingNav />

      {/* Hero */}
      <section className="pt-24 pb-16 md:pt-32 md:pb-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div {...fadeUp} transition={{ duration: 0.6 }} className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6 border border-primary/20">
              <Lightbulb className="w-4 h-4" />
              <span className="text-sm font-semibold">Concept Note</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight tracking-tight">
              About <span className="text-primary">Hospital Flow</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              A comprehensive Hospital-to-Hospital Patient Referral Management System designed to digitize, 
              streamline, and improve the patient referral process across healthcare facilities.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="py-16 md:py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div {...fadeUp} transition={{ duration: 0.6 }} className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6 text-center">The Problem</h2>
            <Card className="border-destructive/20 bg-destructive/5">
              <CardContent className="p-8">
                <p className="text-muted-foreground leading-relaxed text-lg">
                  In many healthcare systems, patient referrals between hospitals are handled through paper forms, 
                  phone calls, and manual record-keeping. This leads to <strong className="text-foreground">delayed transfers</strong>, 
                  <strong className="text-foreground"> lost documentation</strong>, <strong className="text-foreground">poor communication</strong> between 
                  healthcare providers, and ultimately <strong className="text-foreground">compromised patient outcomes</strong>. 
                  There is no centralized system for tracking referral status, and patients often lack visibility 
                  into where their case stands in the transfer process.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Solution / What Hospital Flow Does */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <motion.div {...fadeUp} transition={{ duration: 0.6 }} className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Our Solution</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
               Hospital Flow is a web-based platform that replaces fragmented, manual referral workflows with a 
               unified digital system connecting hospitals, doctors, and patients.
            </p>
          </motion.div>

          <div className="max-w-5xl mx-auto grid gap-4">
            {[
              "Doctors create and submit referrals digitally with all relevant patient information and medical history.",
              "Receiving hospitals get instant notifications and can accept, request more info, or decline referrals.",
              "Both parties communicate securely within the platform, keeping all discussions linked to the referral.",
              "Patients can track their referral status using a unique referral code — no login required.",
              "Administrators have full visibility into referral flows, performance metrics, and system activity.",
              "An AI assistant provides health education to patients and helps navigate the referral process.",
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="flex items-start gap-3 p-4 rounded-xl bg-muted/40 border border-border/50"
              >
                <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <p className="text-muted-foreground">{item}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* System Features */}
      <section className="py-16 md:py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div {...fadeUp} transition={{ duration: 0.6 }} className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">System Features</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              A comprehensive set of tools designed for modern healthcare referral management.
            </p>
          </motion.div>

          <motion.div {...stagger} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
            {features.map((f, i) => (
              <motion.div key={i} variants={{ initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 } }} transition={{ duration: 0.4 }}>
                <Card className="h-full hover:shadow-lg transition-shadow border-border/50 hover:border-primary/30">
                  <CardContent className="p-6">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <f.icon className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">{f.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Challenges */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <motion.div {...fadeUp} transition={{ duration: 0.6 }} className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Challenges</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Key obstacles and considerations in deploying a digital referral management system.
            </p>
          </motion.div>

          <motion.div {...stagger} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
            {challenges.map((c, i) => (
              <motion.div key={i} variants={{ initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 } }} transition={{ duration: 0.4 }}>
                <Card className="h-full border-destructive/15 hover:border-destructive/30 hover:shadow-lg transition-all">
                  <CardContent className="p-6">
                    <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center mb-4">
                      <c.icon className="w-5 h-5 text-destructive" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">{c.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{c.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Future Advancements */}
      <section className="py-16 md:py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div {...fadeUp} transition={{ duration: 0.6 }} className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Future Advancements</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              The roadmap for evolving Hospital Flow into a world-class healthcare referral ecosystem.
            </p>
          </motion.div>

          <motion.div {...stagger} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
            {futureAdvancements.map((f, i) => (
              <motion.div key={i} variants={{ initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 } }} transition={{ duration: 0.4 }}>
                <Card className="h-full border-primary/15 hover:border-primary/30 hover:shadow-lg transition-all">
                  <CardContent className="p-6">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <f.icon className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">{f.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.div {...fadeUp} transition={{ duration: 0.6 }}>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Ready to Transform Referrals?</h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
              Join Hospital Flow and experience a modern, efficient, and secure patient referral system.
            </p>
            <div className="flex justify-center gap-4">
              <Button asChild size="lg">
                <Link to="/login">Get Started</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <footer className="py-8 border-t border-border bg-card">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
          <p>© {new Date().getFullYear()} Hospital Flow. Hospital Referral Management System.</p>
        </div>
      </footer>
    </div>
  );
};

export default About;
