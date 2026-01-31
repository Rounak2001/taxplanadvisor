import { Shield, Zap, HeartHandshake, Smile, Headphones, Lock } from "lucide-react";
import { motion } from "framer-motion";

const features = [
    {
        icon: Shield,
        title: "Bank-Grade Security",
        description: "256-bit encryption ensures your financial data stays safe and private.",
    },
    {
        icon: Zap,
        title: "Lightning Fast",
        description: "AI-powered processing reduces filing time from days to minutes.",
    },
    {
        icon: HeartHandshake,
        title: "Trusted Experts",
        description: "Every filing is reviewed by a verified Chartered Accountant.",
    },
    {
        icon: Headphones,
        title: "24/7 Support",
        description: "Get answers to your tax queries anytime via our AI or support team.",
    },
    {
        icon: Smile,
        title: "Hassle-Free",
        description: "No complex forms. Just upload documents and we handle the rest.",
    },
    {
        icon: Lock,
        title: "Data Privacy",
        description: "We never share your data with third parties without your consent.",
    },
];

const Features = () => {
    return (
        <section className="py-24 bg-secondary/20" id="features">
            <div className="container mx-auto px-4 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                        Why Choose <span className="gradient-text">TaxPlan Advisor</span>?
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        We combine technology and expertise to deliver the best tax experience.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.05, duration: 0.4 }}
                            className="flex gap-4 p-6 rounded-2xl bg-background border border-border/50 shadow-sm"
                        >
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                                <feature.icon className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-semibold mb-1">{feature.title}</h3>
                                <p className="text-sm text-muted-foreground">{feature.description}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;
