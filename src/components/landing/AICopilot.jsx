import { Bot, Globe, Sparkles, Send } from "lucide-react";
import { motion } from "framer-motion";

const features = [
    {
        icon: Bot,
        title: "Trained on Tax Data",
        description: "Latest GST rules, ITR guidelines, and tax laws built-in.",
    },
    {
        icon: Globe,
        title: "Real-Time Updates",
        description: "Web search enabled for latest circulars and notifications.",
    },
    {
        icon: Sparkles,
        title: "Simple Explanations",
        description: "Complex tax concepts explained in everyday language.",
    },
];

const chatMessages = [
    { type: "user", text: "What is the due date for GSTR-3B this month?" },
    {
        type: "ai",
        text: "The GSTR-3B for December 2024 is due on January 20, 2025 for taxpayers with turnover above ₹5 crore. For QRMP taxpayers, it's January 22-24, 2025 based on your state.",
    },
    { type: "user", text: "Can I claim ITC on a hotel stay?" },
    {
        type: "ai",
        text: "Yes, you can claim ITC on hotel stays if used for business purposes and if the invoice contains your GSTIN. The hotel must be registered under GST, and you must have a valid tax invoice.",
    },
];

const AICopilot = () => {
    return (
        <section className="relative py-24 overflow-hidden" id="ai-copilot">
            <div className="container mx-auto px-4 lg:px-8 relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                    {/* Content Side */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 mb-6">
                            <Bot className="w-4 h-4 text-primary" />
                            <span className="text-sm text-primary font-medium">
                                AI ASSISTANT
                            </span>
                        </div>

                        {/* Title */}
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
                            AI Finance{" "}
                            <span className="gradient-text">Copilot</span>
                        </h2>

                        {/* Description */}
                        <p className="text-lg text-muted-foreground mb-8 max-w-lg">
                            Your personal AI assistant for all tax and finance questions. Get
                            instant answers about GST, ITR, investments, and compliance — in
                            simple, easy-to-understand language.
                        </p>

                        {/* Features List */}
                        <div className="space-y-4 mb-8">
                            {features.map((feature, index) => (
                                <motion.div
                                    key={feature.title}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="flex items-start gap-4"
                                >
                                    <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-primary/10 border border-primary/20 flex-shrink-0">
                                        <feature.icon className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="text-base font-semibold text-foreground mb-1">
                                            {feature.title}
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            {feature.description}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Tagline Box */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20"
                        >
                            <Sparkles className="w-4 h-4 text-accent" />
                            <span className="text-sm font-medium text-foreground">
                                AI-assisted. Expert-verified.
                            </span>
                        </motion.div>
                    </motion.div>

                    {/* Chat Preview Side */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <div className="glass-card overflow-hidden rounded-2xl border-2 border-primary/30 shadow-[0_0_60px_rgba(45,212,191,0.15)]">
                            {/* Chat Header */}
                            <div className="bg-gradient-to-r from-secondary to-secondary/80 px-5 py-4 flex items-center gap-4 border-b border-border/50">
                                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                                    <Bot className="w-5 h-5 text-primary-foreground" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-semibold bg-secondary/80 text-white">
                                        TaxPlan AI
                                    </h4>
                                    <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                        <span className="text-xs text-muted-foreground bg-secondary/80 text-white">
                                            Online 
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Chat Messages */}
                            <div className="p-4 space-y-4 min-h-[320px] bg-gradient-to-b from-card/80 to-card/40">
                                {chatMessages.map((msg, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 15 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.5, delay: 0.5 + index * 0.4 }}
                                        className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"
                                            }`}
                                    >
                                        <div
                                            className={`max-w-[85%] p-3 rounded-2xl ${msg.type === "user"
                                                ? "bg-primary text-primary-foreground rounded-br-md"
                                                : "bg-secondary/80 text-white rounded-bl-md border border-border/50"
                                                }`}
                                        >
                                            <p className="text-sm leading-relaxed">{msg.text}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Chat Input */}
                            <div className="p-4 border-t border-border/50 bg-secondary/30">
                                <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-card/60 border border-border/50">
                                    <input
                                        type="text"
                                        placeholder="Ask about GST, ITR, or any tax query..."
                                        className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
                                        disabled
                                    />
                                    <button className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center hover:bg-primary/90 transition-colors">
                                        <Send className="w-4 h-4 text-primary-foreground" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default AICopilot;
