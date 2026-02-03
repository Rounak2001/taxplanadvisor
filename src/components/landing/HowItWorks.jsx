import { UserPlus, Search, FileText, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
    {
        icon: UserPlus,
        step: "01",
        title: "Sign Up",
        description: "Create your account in seconds. Individuals, businesses, or CAs - everyone's welcome.",
        color: "primary" // teal
    },
    {
        icon: Search,
        step: "02",
        title: "Get Matched",
        description: "Our AI analyzes your profile and matches you with the ideal CA for your specific needs.",
        color: "accent" // orange/yellow
    },
    {
        icon: FileText,
        step: "03",
        title: "Upload & File",
        description: "Securely upload documents. Your CA prepares and files with maker-checker verification.",
        color: "primary" // teal
    },
    {
        icon: CheckCircle,
        step: "04",
        title: "Track & Relax",
        description: "Real-time status updates. Get notified at every step until successful filing.",
        color: "accent" // orange/yellow
    }
];

const HowItWorks = () => {
    return (
        <section id="how-it-works" className="py-24 relative overflow-hidden bg-gray-50">
            {/* Subtle glow effects */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />

            <div className="container mx-auto px-4 lg:px-8 relative z-10">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center max-w-3xl mx-auto mb-16"
                >
                    <span className="block text-primary font-medium text-sm uppercase tracking-wider mb-4">
                        How It Works
                    </span>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                        Filing Taxes Made{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-500 italic">Effortless</span>
                    </h2>
                    <p className="text-lg text-gray-600">
                        Four simple steps to complete peace of mind.
                        From signup to successful filing in minutes.
                    </p>
                </motion.div>

                {/* Steps Grid with Connecting Line */}
                <div className="relative">
                    {/* Horizontal connecting line - visible on desktop only */}
                    <div className="hidden lg:block absolute top-[4.5rem] left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-primary via-gray-300 to-amber-500 z-0" />

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
                        {steps.map((step, index) => (
                            <motion.div
                                key={step.step}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ delay: index * 0.15, duration: 0.6 }}
                                className="relative group"
                            >
                                <motion.div
                                    className={`relative bg-white rounded-xl p-6 h-full border-l-4 ${step.color === 'primary'
                                        ? 'border-l-primary'
                                        : 'border-l-amber-500'
                                        } border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300`}
                                    whileHover={{ y: -5, scale: 1.02 }}
                                >
                                    {/* Large Step Number */}
                                    <div
                                        className={`absolute top-4 right-4 text-6xl font-bold ${step.color === 'primary'
                                            ? 'text-primary/15'
                                            : 'text-amber-500/15'
                                            }`}
                                    >
                                        {step.step}
                                    </div>

                                    {/* Icon */}
                                    <div
                                        className={`w-14 h-14 rounded-xl ${step.color === 'primary'
                                            ? 'bg-primary'
                                            : 'bg-amber-500'
                                            } flex items-center justify-center mb-5 relative z-10`}
                                    >
                                        <step.icon className="w-7 h-7 text-white" />
                                    </div>

                                    {/* Content */}
                                    <h3 className="text-xl font-bold text-gray-900 mb-3 relative z-10">
                                        {step.title}
                                    </h3>
                                    <p className="text-gray-600 text-sm leading-relaxed relative z-10">
                                        {step.description}
                                    </p>
                                </motion.div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
