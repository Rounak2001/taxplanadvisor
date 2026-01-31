import { FileCheck, RefreshCw, ClipboardCheck, Building } from "lucide-react";
import { motion } from "framer-motion";

const services = [
    {
        icon: FileCheck,
        title: "GST Registration",
        description: "Get your GSTIN within 3-5 working days. Complete application handling by experts.",
    },
    {
        icon: RefreshCw,
        title: "Return Filing",
        description: "Timely filing of GSTR-1, GSTR-3B, and Annual Returns (GSTR-9) to avoid penalties.",
    },
    {
        icon: ClipboardCheck,
        title: "Reconciliation",
        description: "Automated matching of Purchase Register with GSTR-2A/2B to maximize ITC claims.",
    },
    {
        icon: Building,
        title: "LUT Filing",
        description: "File Letter of Undertaking for zero-rated exports without payment of IGST.",
    },
];

const GSTServices = () => {
    return (
        <section className="py-20 relative overflow-hidden" id="gst-services">
            <div className="absolute inset-0 bg-primary/5 skewed-bg pointer-events-none" />

            <div className="container mx-auto px-4 lg:px-8 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                        End-to-End <span className="gradient-text">GST Compliance</span>
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        From registration to annual audits, we handle everything so you can focus on business.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {services.map((service, index) => (
                        <motion.div
                            key={service.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            className="bg-card border border-border/50 p-6 rounded-2xl hover:border-primary/50 transition-colors group"
                        >
                            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <service.icon className="w-6 h-6 text-primary" />
                            </div>
                            <h3 className="font-semibold text-lg mb-2">{service.title}</h3>
                            <p className="text-sm text-muted-foreground">{service.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default GSTServices;
