import { motion } from 'framer-motion';
import { Target, Shield, Users, Award, Heart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';

const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
};

const staggerContainer = {
    animate: { transition: { staggerChildren: 0.1 } }
};

export default function AboutUs() {
    return (
        <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20">
            <Navbar />

            {/* Hero Section */}
            <section className="relative pt-20 pb-20 lg:pt-32 lg:pb-32 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background pointer-events-none" />
                <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[100px]" />

                <div className="container mx-auto px-4 relative z-10">
                    <motion.div
                        initial="initial"
                        animate="animate"
                        variants={staggerContainer}
                        className="text-center max-w-4xl mx-auto"
                    >
                        <motion.div variants={fadeInUp}>
                            <Badge variant="outline" className="mb-6 px-4 py-1">About Us</Badge>
                        </motion.div>
                        <motion.h1 variants={fadeInUp} className="text-4xl md:text-6xl font-bold tracking-tight mb-8">
                            We Are <span className="text-primary">TaxPlan Advisor</span>
                        </motion.h1>
                        <motion.p variants={fadeInUp} className="text-xl text-muted-foreground leading-relaxed">
                            India's first AI-native financial marketplace. Bridging the gap between advanced technology and human expertise to democratize elite financial services.
                        </motion.p>
                    </motion.div>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="py-16 bg-muted/30">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                        <Card className="bg-background border-none shadow-lg">
                            <CardContent className="p-8">
                                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                                    <Target className="w-6 h-6 text-primary" />
                                </div>
                                <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    To simplify financial complexities for every Indian business and individual through AI-driven insights and verified expert consultation.
                                </p>
                            </CardContent>
                        </Card>
                        <Card className="bg-background border-none shadow-lg">
                            <CardContent className="p-8">
                                <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-6">
                                    <Shield className="w-6 h-6 text-blue-500" />
                                </div>
                                <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    To become the most trusted financial ecosystem where compliance is automated, accuracy is guaranteed, and expert help is just a click away.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Corporate Values */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold mb-4">Core Values</h2>
                        <p className="text-muted-foreground">The principles that drive every decision we make.</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {[
                            { icon: Award, title: "Excellence", desc: "We aim for 100% accuracy in every calculation and filing." },
                            { icon: Users, title: "Client First", desc: "Your financial health is our top priority." },
                            { icon: Heart, title: "Transparency", desc: "No hidden fees, no jargon. Just clear financial advice." }
                        ].map((item, i) => (
                            <div key={i} className="text-center p-6 border rounded-2xl bg-muted/10">
                                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4">
                                    <item.icon className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                                <p className="text-muted-foreground text-sm">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Founders Section */}
            <section className="py-20 bg-secondary/5 border-y">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Meet The Founders</h2>

                        <div className="grid md:grid-cols-2 gap-8">
                            {/* Founder 1 */}
                            <Card className="overflow-hidden hover:shadow-xl transition-all duration-300">
                                <div className="h-24 bg-gradient-to-r from-primary/20 to-blue-500/20" />
                                <CardContent className="px-8 pb-8 pt-0 relative">
                                    <div className="w-24 h-24 rounded-full bg-background border-4 border-background -mt-12 mb-4 flex items-center justify-center text-4xl shadow-sm">
                                        👨‍💼
                                    </div>
                                    <h3 className="text-2xl font-bold mb-1">Rounak Patel</h3>
                                    <p className="text-primary font-medium mb-4">Founder & CEO</p>
                                    <p className="text-muted-foreground text-sm mb-6">
                                        Visionary leader with over a decade of experience in FinTech and Taxation. Passionate about building tools that empower businesses to scale.
                                    </p>
                                    <div className="flex gap-2">
                                        <Badge variant="secondary">FinTech</Badge>
                                        <Badge variant="secondary">Strategy</Badge>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Founder 2 (Placeholder) */}
                            <Card className="overflow-hidden hover:shadow-xl transition-all duration-300">
                                <div className="h-24 bg-gradient-to-r from-purple-500/20 to-pink-500/20" />
                                <CardContent className="px-8 pb-8 pt-0 relative">
                                    <div className="w-24 h-24 rounded-full bg-background border-4 border-background -mt-12 mb-4 flex items-center justify-center text-4xl shadow-sm">
                                        👩‍💼
                                    </div>
                                    <h3 className="text-2xl font-bold mb-1">Co-Founder Name</h3>
                                    <p className="text-primary font-medium mb-4">Co-Founder & CTO</p>
                                    <p className="text-muted-foreground text-sm mb-6">
                                        The technical architect behind our AI engine. Expert in Machine Learning and secure financial systems.
                                    </p>
                                    <div className="flex gap-2">
                                        <Badge variant="secondary">AI/ML</Badge>
                                        <Badge variant="secondary">Security</Badge>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
