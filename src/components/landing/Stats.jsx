import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const stats = [
    { value: 100, suffix: "+", label: "Verified Consultants", color: "primary" },
    { value: 1000, suffix: "+", label: "Filings Completed", color: "accent" },
    { value: 99.5, suffix: "%", label: "Accuracy Rate", color: "primary" },
    { value: 4.8, suffix: "/5", label: "User Rating", color: "accent" },
];

const AnimatedCounter = ({ value, suffix }) => {
    const [displayValue, setDisplayValue] = useState(0);
    const ref = useRef(null);
    const [hasAnimated, setHasAnimated] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasAnimated) {
                    setHasAnimated(true);
                    const duration = 2000;
                    const startTime = Date.now();
                    const isDecimal = value % 1 !== 0;

                    const updateValue = () => {
                        const elapsed = Date.now() - startTime;
                        const progress = Math.min(elapsed / duration, 1);
                        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
                        const current = value * easeOutQuart;

                        setDisplayValue(isDecimal ? parseFloat(current.toFixed(1)) : Math.floor(current));

                        if (progress < 1) {
                            requestAnimationFrame(updateValue);
                        }
                    };

                    updateValue();
                }
            },
            { threshold: 0.5 }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, [value, hasAnimated]);

    const formatNumber = (num) => {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
        if (num >= 1000) return (num / 1000).toFixed(0) + "K";
        return num.toString();
    };

    return (
        <span ref={ref}>
            {value >= 1000 ? formatNumber(displayValue) : displayValue}
            {suffix}
        </span>
    );
};

const Stats = () => {
    return (
        <section className="py-20 relative overflow-hidden">
            <div className="container mx-auto px-4 lg:px-8 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="glass-card p-8 sm:p-12 rounded-3xl"
                >
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1, duration: 0.5 }}
                                className="text-center relative group"
                            >
                                <div
                                    className={`text-4xl sm:text-5xl lg:text-6xl font-bold ${stat.color === 'primary' ? 'gradient-text' : 'gradient-text-accent'} mb-2`}
                                >
                                    <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                                </div>
                                <p className="text-muted-foreground font-medium">{stat.label}</p>

                                <div
                                    className={`h-1 w-12 mx-auto mt-4 rounded-full bg-gradient-to-r ${stat.color === 'primary' ? 'from-primary to-primary/40' : 'from-accent to-accent/40'}`}
                                />
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default Stats;
