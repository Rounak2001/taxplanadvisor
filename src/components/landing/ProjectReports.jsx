import { Landmark, TrendingUp, FileSpreadsheet, Check } from "lucide-react";
import { motion } from "framer-motion";

const reportTypes = [
    {
        icon: Landmark,
        title: "Term Loan Reports",
        description: "Bank-ready project reports with projected financials and market analysis.",
    },
    {
        icon: TrendingUp,
        title: "CMA Reports",
        description: "Fund flow, ratio analysis, and working capital assessment for banks.",
    },
    {
        icon: FileSpreadsheet,
        title: "Auto-Generated Financials",
        description: "P&L, Balance Sheets, and Cash Flow auto-generated from your inputs.",
    },
];

const features = [
    "Bank-ready format",
    "Industry templates",
    "Auto ratio calculations",
    "Editable projections",
    "PDF & Excel export",
    "CA review available",
];

const ProjectReports = () => {
    return (
        <section className="relative py-20 overflow-hidden" id="project-reports">
            <div className="container mx-auto px-4 lg:px-8 relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-12"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 mb-4">
                        <Landmark className="w-4 h-4 text-primary" />
                        <span className="text-sm text-primary font-medium">
                            FOR BUSINESS OWNERS
                        </span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
                        Automated{" "}
                        <span className="gradient-text">Project Report</span> Maker
                    </h2>
                    <p className="text-muted-foreground max-w-xl mx-auto">
                        Generate professional project reports for bank loans in minutes.
                        Enter your business details — we handle projections and formatting.
                    </p>
                </motion.div>

                {/* Report Types Grid */}
                <div className="grid md:grid-cols-3 gap-6 mb-10">
                    {reportTypes.map((report, index) => (
                        <motion.div
                            key={report.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: index * 0.1 }}
                            className="glass-card p-6 rounded-2xl border border-border/50 hover:border-primary/30 transition-all group"
                        >
                            <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <report.icon className="w-6 h-6 text-primary" />
                            </div>
                            <h3 className="font-semibold text-foreground mb-2">
                                {report.title}
                            </h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                {report.description}
                            </p>
                        </motion.div>
                    ))}
                </div>

                {/* Features List */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="p-6 rounded-2xl bg-primary/5 border border-primary/10"
                >
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {features.map((feature, index) => (
                            <motion.div
                                key={feature}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.3, delay: 0.4 + index * 0.05 }}
                                className="flex items-center gap-2"
                            >
                                <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                                    <Check className="w-3 h-3 text-primary-foreground" />
                                </div>
                                <span className="text-sm font-medium text-foreground">
                                    {feature}
                                </span>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default ProjectReports;
