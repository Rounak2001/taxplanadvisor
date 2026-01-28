import { FileText, ArrowRight, Download, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const gstFeatures = [
    {
        title: "GSTR-2B vs Books",
        desc: "Reconcile purchase data with your books",
        href: "/gstr2b-books-reconciliation",
        icon: FileText,
    },
    {
        title: "Comprehensive Reconciliation",
        desc: "Three-way check of 1, 3B & 2B",
        href: "/gstr-reconciliation",
        icon: CheckCircle,
    },
    {
        title: "GSTR-3B vs Books",
        desc: "Match 3B with your accounting data",
        href: "/gstr3b-books-reconciliation",
        icon: FileText,
    },
    {
        title: "Download GSTR Data",
        desc: "Fetch 2B, R1 & 3B from portal",
        href: "/get2b",
        icon: Download,
    },
];

const GSTServices = () => {
    return (
        <section className="relative py-20 overflow-hidden" id="gst-services">
            <div className="container mx-auto px-4 lg:px-8 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 mb-4">
                        <FileText className="w-4 h-4 text-primary" />
                        <span className="text-sm text-primary font-medium">GST TOOLS</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
                        GST <span className="gradient-text">Reconciliation</span>
                    </h2>
                    <p className="text-muted-foreground max-w-xl mx-auto">
                        Automate GST reconciliation and identify mismatches instantly
                    </p>
                </motion.div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {gstFeatures.map((feature, index) => (
                        <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: index * 0.1 }}
                        >
                            <Link
                                to={feature.href}
                                className="glass-card p-5 rounded-2xl block group hover:border-primary/50 transition-all"
                            >
                                <div className="w-11 h-11 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center mb-4">
                                    <feature.icon className="w-5 h-5 text-primary" />
                                </div>
                                <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                                    {feature.title}
                                </h3>
                                <p className="text-sm text-muted-foreground mb-3">
                                    {feature.desc}
                                </p>
                                <span className="text-sm text-primary flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    Try Now <ArrowRight className="w-4 h-4" />
                                </span>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default GSTServices;
