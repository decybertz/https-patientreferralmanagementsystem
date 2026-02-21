import { Card, CardContent } from "@/components/ui/card";
import { Building2, Clock, FileText, Shield, Users, Zap } from "lucide-react";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: FileText,
    title: "Create Referrals",
    description: "Easily create patient referrals with comprehensive medical information and urgency levels.",
  },
  {
    icon: Building2,
    title: "Hospital Network",
    description: "Connect with verified hospitals in the network for seamless patient transfers.",
  },
  {
    icon: Clock,
    title: "Real-Time Tracking",
    description: "Track referral status in real-time from pending to completed treatment.",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description: "Patient data is protected with role-based access and privacy-focused design.",
  },
  {
    icon: Zap,
    title: "Emergency Alerts",
    description: "Instant notifications for emergency referrals to ensure rapid response.",
  },
  {
    icon: Users,
    title: "Collaborative Care",
    description: "Enable seamless communication between referring and receiving doctors.",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

const FeaturesSection = () => {
  return (
    <section id="features" className="py-20 md:py-28 bg-muted/30 relative overflow-hidden">
      {/* Decorative blurred circles */}
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-primary font-semibold text-sm tracking-widest uppercase mb-3 block">Features</span>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4 tracking-tight">
            Everything You Need
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Hospital Flow provides all the tools healthcare providers need to manage patient referrals efficiently.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div key={index} variants={cardVariants}>
              <Card className="border-border/40 hover:border-primary/40 transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5 bg-card/80 backdrop-blur-sm group h-full">
                <CardContent className="p-7">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                    <feature.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;
