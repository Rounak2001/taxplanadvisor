import {
    TrendingUp,
    Users,
    Video,
    Star,
    Clock,
    Wallet,
    Rocket
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const createBenefits = (benefitData) => {
    const iconMap = { Users, Star, TrendingUp, Clock, Video, Wallet };
    return benefitData.map(({ icon, title, description }) => ({
        icon: iconMap[icon],
        title,
        description
    }));
};

const benefits = createBenefits([
    { icon: 'Users', title: 'Expand Client Base', description: 'Access thousands of assessees looking for verified CA services.' },
    { icon: 'Star', title: 'Build Reputation', description: 'Earn ratings, reviews, and showcase your expertise through webinars.' },
    { icon: 'TrendingUp', title: 'Performance Rewards', description: 'High-rated CAs automatically receive more incoming job matches.' },
    { icon: 'Clock', title: 'Save Time', description: 'Auto-filing tools and pre-filled forms reduce manual work by 60%.' },
    { icon: 'Video', title: 'Host Webinars', description: 'Conduct educational sessions and attract leads through content.' },
    { icon: 'Wallet', title: 'Transparent Earnings', description: 'Track payments, manage invoices, and grow your practice digitally.' }
]);

const ForCAs = () => {
    return (
        <section id="for-cas" className="py-24 relative overflow-hidden">
            <div className="container mx-auto px-4 lg:px-8 relative z-10">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        {/* Coming Soon Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-accent/20 to-primary/20 border border-accent/30 mb-4">
                            <Rocket className="w-4 h-4 text-accent" />
                            <span className="text-sm font-medium text-accent">Coming Soon</span>
                        </div>

                        <span className="block text-accent font-medium text-sm uppercase tracking-wider">
                            For Chartered Accountants
                        </span>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mt-4 mb-6">
                            Grow Your Practice{" "}
                            <span className="gradient-text-accent">Digitally</span>
                        </h2>
                        <p className="text-lg text-muted-foreground mb-8">
                            Join India's largest network of verified CAs. Get matched with clients,
                            streamline your workflow, and build your brand on our platform.
                        </p>

                        <div className="grid sm:grid-cols-2 gap-6 mb-10">
                            {benefits.map((benefit, index) => (
                                <motion.div
                                    key={benefit.title}
                                    className="flex gap-4 group"
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1, duration: 0.5 }}
                                >
                                    <div
                                        className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center flex-shrink-0"
                                    >
                                        <benefit.icon className="w-5 h-5 text-accent" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-foreground mb-1">
                                            {benefit.title}
                                        </h4>
                                        <p className="text-sm text-muted-foreground">
                                            {benefit.description}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                            <Button
                                size="lg"
                                className="bg-accent text-accent-foreground hover:bg-accent/90 font-medium px-8"
                            >
                                Register as CA
                            </Button>
                        </motion.div>
                    </motion.div>

                    {/* Visual */}
                    <motion.div
                        className="relative"
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <div
                            className="glass-card p-8 rounded-3xl"
                        >
                            {/* CA Profile Card Preview */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <div
                                        className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent to-accent/60"
                                    />
                                    <div>
                                        <div
                                            className="h-5 bg-muted/50 rounded w-32 mb-2"
                                        />
                                        <div className="h-4 bg-muted/30 rounded w-24" />
                                    </div>
                                    <div
                                        className="ml-auto flex items-center gap-1"
                                    >
                                        <Star className="w-4 h-4 text-accent fill-accent" />
                                        <span className="text-foreground font-semibold">4.9</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    {[
                                        { value: "250+", label: "Returns Filed", gradient: "gradient-text" },
                                        { value: "98%", label: "Success Rate", gradient: "gradient-text-accent" },
                                        { value: "12", label: "Years Exp", gradient: "gradient-text" },
                                    ].map((stat, index) => (
                                        <motion.div
                                            key={stat.label}
                                            className="glass-card p-4 text-center"
                                            whileHover={{ scale: 1.05, y: -5 }}
                                            initial={{ opacity: 0, y: 20 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: 0.3 + index * 0.1 }}
                                        >
                                            <div className={`text-2xl font-bold ${stat.gradient}`}>{stat.value}</div>
                                            <div className="text-xs text-muted-foreground">{stat.label}</div>
                                        </motion.div>
                                    ))}
                                </div>

                                <div className="space-y-3">
                                    {[100, 80, 60].map((width, i) => (
                                        <motion.div
                                            key={i}
                                            className="h-4 bg-muted/30 rounded"
                                            style={{ width: `${width}%` }}
                                            initial={{ width: 0 }}
                                            whileInView={{ width: `${width}%` }}
                                            viewport={{ once: true }}
                                            transition={{ delay: 0.5 + i * 0.1, duration: 0.8 }}
                                        />
                                    ))}
                                </div>

                                <motion.div
                                    className="flex gap-2 flex-wrap"
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.8 }}
                                >
                                    {[
                                        { label: "ITR", bg: "bg-primary/20", text: "text-primary" },
                                        { label: "GST", bg: "bg-primary/20", text: "text-primary" },
                                        { label: "Audit", bg: "bg-accent/20", text: "text-accent" },
                                        { label: "+3", bg: "bg-muted/50", text: "text-muted-foreground" },
                                    ].map((tag, i) => (
                                        <motion.span
                                            key={tag.label}
                                            className={`px-3 py-1 ${tag.bg} ${tag.text} text-xs rounded-full`}
                                            whileHover={{ scale: 1.1 }}
                                            initial={{ opacity: 0, scale: 0 }}
                                            whileInView={{ opacity: 1, scale: 1 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: 0.9 + i * 0.1, type: "spring" }}
                                        >
                                            {tag.label}
                                        </motion.span>
                                    ))}
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default ForCAs;
