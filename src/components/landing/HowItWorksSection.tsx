import { motion } from "framer-motion";

const steps = [
  {
    step: "1",
    title: "Create a Referral",
    description: "Enter patient details, medical summary, select receiving hospital, and set urgency level.",
  },
  {
    step: "2",
    title: "Hospital Review",
    description: "The receiving hospital reviews and accepts, requests more info, or provides feedback.",
  },
  {
    step: "3",
    title: "Treatment & Updates",
    description: "Track treatment progress with real-time status updates and activity logs.",
  },
  {
    step: "4",
    title: "Completion & Code",
    description: "Upon completion, a unique patient code is generated for future reference access.",
  },
];

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="py-20 md:py-28 bg-background relative overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-primary font-semibold text-sm tracking-widest uppercase mb-3 block">Process</span>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4 tracking-tight">
            How It Works
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            A simple 4-step process to manage patient referrals from start to finish.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Connecting line (desktop) */}
          <div className="hidden lg:block absolute top-12 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-primary/30 via-primary/50 to-primary/30" />

          {steps.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="text-center relative"
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="w-20 h-20 rounded-2xl bg-primary text-primary-foreground text-2xl font-bold flex items-center justify-center mx-auto mb-5 shadow-lg relative z-10"
              >
                {item.step}
              </motion.div>
              <h3 className="text-lg font-bold text-foreground mb-2">{item.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-[250px] mx-auto">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
