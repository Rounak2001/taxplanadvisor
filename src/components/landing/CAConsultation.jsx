import { useState } from "react";
import { Video, ShieldCheck, Calendar, X, ArrowRight, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import api from "@/api/axios";

const features = [
    {
        icon: Video,
        title: "1-on-1 Video Call",
        description: "Connect with verified CAs for personalized advice.",
    },
    {
        icon: ShieldCheck,
        title: "Secure Sharing",
        description: "End-to-end encrypted document sharing.",
    },
    {
        icon: Calendar,
        title: "Flexible Scheduling",
        description: "Book at your convenience, anytime.",
    },
];

const CAConsultation = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        topic: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error' | null

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus(null);

        try {
            await api.post("/bot/send-query/", {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                query: `[CA Consultation] Topic: ${formData.topic || "General consultation"}`,
            });

            setSubmitStatus("success");
            setTimeout(() => {
                setIsOpen(false);
                setFormData({ name: "", email: "", phone: "", topic: "" });
                setSubmitStatus(null);
            }, 2000);
        } catch (error) {
            console.error("Error submitting form:", error);
            setSubmitStatus("error");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="relative py-20 overflow-hidden" id="consultation">
            {/* Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />

            <div className="container mx-auto px-4 lg:px-8 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="glass-card p-8 md:p-12 rounded-3xl border border-primary/20 relative overflow-hidden"
                >
                    <div className="relative z-10">
                        {/* Header */}
                        <div className="text-center mb-10">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-accent/30 bg-accent/10 mb-4">
                                <ShieldCheck className="w-4 h-4 text-accent" />
                                <span className="text-sm text-accent font-medium">
                                    EXPERT SUPPORT
                                </span>
                            </div>
                            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
                                CA-Verified{" "}
                                <span className="gradient-text">Consultation</span>
                            </h2>
                            <p className="text-muted-foreground max-w-xl mx-auto">
                                Get expert advice from ICAI-verified Chartered Accountants for
                                complex tax matters, compliance issues, or financial planning.
                            </p>
                        </div>

                        {/* Features Grid */}
                        <div className="grid md:grid-cols-3 gap-6 mb-10">
                            {features.map((feature, index) => (
                                <motion.div
                                    key={feature.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.4, delay: index * 0.1 }}
                                    className="text-center p-6 rounded-2xl bg-secondary/30 border border-border/50 hover:border-primary/30 transition-colors"
                                >
                                    <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
                                        <feature.icon className="w-6 h-6 text-primary" />
                                    </div>
                                    <h3 className="font-semibold text-foreground mb-2">
                                        {feature.title}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        {feature.description}
                                    </p>
                                </motion.div>
                            ))}
                        </div>

                        {/* CTA Button */}
                        <div className="text-center">
                            <Button
                                size="lg"
                                onClick={() => setIsOpen(true)}
                                className="bg-accent text-accent-foreground hover:bg-accent/90 text-base px-8 py-6 rounded-xl font-medium group"
                            >
                                Book a CA Consultation
                                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Modal */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => !isSubmitting && setIsOpen(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                        />

                        {/* Modal Content */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ duration: 0.2 }}
                            className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
                        >
                            <div className="glass-card rounded-2xl border border-border/50 overflow-hidden w-full max-w-md my-8">
                                {/* Modal Header */}
                                <div className="flex items-center justify-between p-5 border-b border-border/50">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
                                            <Calendar className="w-5 h-5 text-accent" />
                                        </div>
                                        <h3 className="text-xl font-semibold text-foreground">
                                            Book a Consultation
                                        </h3>
                                    </div>
                                    <button
                                        onClick={() => !isSubmitting && setIsOpen(false)}
                                        className="w-8 h-8 rounded-lg bg-secondary/50 flex items-center justify-center hover:bg-secondary transition-colors"
                                    >
                                        <X className="w-4 h-4 text-muted-foreground" />
                                    </button>
                                </div>

                                {/* Success State */}
                                {submitStatus === "success" ? (
                                    <div className="p-8 text-center">
                                        <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                                            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <h4 className="text-lg font-semibold text-foreground mb-2">Request Submitted!</h4>
                                        <p className="text-sm text-muted-foreground">We'll connect you with a verified CA shortly.</p>
                                    </div>
                                ) : (
                                    /* Modal Body */
                                    <form onSubmit={handleSubmit} className="p-5">
                                        <p className="text-sm text-muted-foreground mb-5">
                                            Fill in your details and we'll connect you with a verified CA.
                                        </p>

                                        <div className="space-y-4">
                                            <input
                                                type="text"
                                                name="name"
                                                placeholder="Full Name *"
                                                value={formData.name}
                                                onChange={handleChange}
                                                required
                                                disabled={isSubmitting}
                                                className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border/50 text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/50 transition-colors disabled:opacity-50"
                                            />
                                            <input
                                                type="email"
                                                name="email"
                                                placeholder="Email Address *"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                                disabled={isSubmitting}
                                                className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border/50 text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/50 transition-colors disabled:opacity-50"
                                            />
                                            <input
                                                type="tel"
                                                name="phone"
                                                placeholder="Phone Number *"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                required
                                                disabled={isSubmitting}
                                                className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border/50 text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/50 transition-colors disabled:opacity-50"
                                            />
                                            <textarea
                                                name="topic"
                                                placeholder="Consultation Topic (e.g., GST filing, ITR issues...)"
                                                value={formData.topic}
                                                onChange={handleChange}
                                                rows={3}
                                                disabled={isSubmitting}
                                                className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border/50 text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/50 transition-colors resize-none disabled:opacity-50"
                                            />
                                        </div>

                                        {submitStatus === "error" && (
                                            <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                                                Something went wrong. Please try again.
                                            </div>
                                        )}

                                        <div className="flex gap-3 mt-6">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => !isSubmitting && setIsOpen(false)}
                                                disabled={isSubmitting}
                                                className="flex-1 border-border/50 text-foreground hover:bg-secondary/50"
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                type="submit"
                                                disabled={isSubmitting}
                                                className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90"
                                            >
                                                {isSubmitting ? (
                                                    <>
                                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                        Submitting...
                                                    </>
                                                ) : (
                                                    "Request Consultation"
                                                )}
                                            </Button>
                                        </div>
                                    </form>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </section>
    );
};

export default CAConsultation;
