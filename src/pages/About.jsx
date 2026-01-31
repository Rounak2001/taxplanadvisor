import { Users, Target, Award, TrendingUp, Shield, Heart, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/landing/Navbar.jsx";
import Footer from "@/components/landing/Footer.jsx";

const About = () => {
    return (
        <>
            <Navbar />
            {/* Main Container with corrected top margin for transparent navbar overlay */}
            <div className="min-h-screen bg-[#020410] text-foreground -mt-20">

                {/* Dynamic Background Effects */}
                <div className="fixed inset-0 z-0 pointer-events-none">
                    <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[120px]" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/10 blur-[120px]" />
                </div>

                {/* Hero Section */}
                <div className="relative z-10 pt-40 pb-20 px-4 overflow-hidden">
                    <div className="max-w-7xl mx-auto text-center relative">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent opacity-30 blur-3xl -z-10" />

                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 backdrop-blur-sm mb-8 animate-fade-in">
                            <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
                            Redefining Financial Advisory
                        </div>

                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight tracking-tight animate-fade-in">
                            Empowering Your <br className="hidden md:block" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-400 to-purple-500">Financial Future</span>
                        </h1>

                        <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-12 animate-fade-in delay-100">
                            Where artificial intelligence meets expert wisdom to provide unrivaled financial clarity and strategic growth for your business.
                        </p>
                    </div>
                </div>

                {/* Mission & Vision Cards - Floating Style */}
                <div className="relative z-10 max-w-7xl mx-auto px-4 pb-24">
                    <div className="grid md:grid-cols-2 gap-8">
                        <Card className="group relative overflow-hidden bg-white/5 backdrop-blur-xl border border-white/10 hover:border-primary/50 transition-all duration-500 hover:-translate-y-2">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <CardContent className="p-10 relative z-10">
                                <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mb-6 text-3xl shadow-lg shadow-primary/10">🎯</div>
                                <h2 className="text-3xl font-bold mb-4 text-white">Our Mission</h2>
                                <p className="text-gray-400 text-lg leading-relaxed">
                                    To demystify complex financial landscapes by delivering precise, AI-driven insights and actionable strategies that propel businesses towards sustainable growth and compliance.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="group relative overflow-hidden bg-white/5 backdrop-blur-xl border border-white/10 hover:border-blue-500/50 transition-all duration-500 hover:-translate-y-2">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <CardContent className="p-10 relative z-10">
                                <div className="w-16 h-16 rounded-2xl bg-blue-500/20 flex items-center justify-center mb-6 text-3xl shadow-lg shadow-blue-500/10">🚀</div>
                                <h2 className="text-3xl font-bold mb-4 text-white">Our Vision</h2>
                                <p className="text-gray-400 text-lg leading-relaxed">
                                    To become the beacon of trust and innovation in India's financial ecosystem, democratizing access to elite advisory services through the synergy of human expertise and advanced technology.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Stats Section - Ribbon Style */}
                <div className="relative z-10 bg-white/5 border-y border-white/5 backdrop-blur-sm py-16 mb-24 overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                    <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 md:divide-x divide-white/10 relative">
                        {[
                            { value: "500+", label: "Happy Clients" },
                            { value: "1200+", label: "Projects Delivered" },
                            { value: "98%", label: "Satisfaction Rate" },
                            { value: "24/7", label: "Expert Support" }
                        ].map((stat, i) => (
                            <div key={i} className="text-center group p-4">
                                <div className="text-4xl md:text-5xl font-bold text-white mb-2 group-hover:text-primary transition-colors duration-300">{stat.value}</div>
                                <div className="text-sm font-medium uppercase tracking-widest text-gray-500 group-hover:text-gray-300 transition-colors">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Core Values - Masonry Grid */}
                <div className="relative z-10 max-w-7xl mx-auto px-4 mb-24">
                    <div className="text-center mb-16">
                        <h2 className="text-sm font-bold text-primary uppercase tracking-widest mb-3">Our DNA</h2>
                        <h3 className="text-3xl md:text-4xl font-bold text-white">Core Values That Drive Us</h3>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            { icon: Shield, title: "Integrity First", desc: "Unwavering honesty and transparency constitute the bedrock of our client relationships." },
                            { icon: TrendingUp, title: "Relentless Excellence", desc: "We don't just meet standards; we set them with precision, quality, and rigorous attention to detail." },
                            { icon: Heart, title: "Client obsessed", desc: "Your goals are our compass. We tailor every strategy to fit your unique financial narrative." }
                        ].map((item, i) => (
                            <div key={i} className="bg-[#0A0F2C] border border-white/5 p-8 rounded-2xl hover:bg-white/5 transition-all duration-300 group">
                                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-all duration-300 text-primary">
                                    <item.icon className="w-6 h-6" />
                                </div>
                                <h4 className="text-xl font-bold text-white mb-3">{item.title}</h4>
                                <p className="text-gray-400 leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* What We Offer - Split Section */}
                <div className="relative z-10 max-w-7xl mx-auto px-4 mb-24">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-8">
                            <div>
                                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Cutting-Edge Tools & <br /> Expert Human Advisory</h2>
                                <p className="text-gray-400 text-lg">We combine the speed of AI with the depth of human experience to deliver a comprehensive financial ecosystem.</p>
                            </div>

                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-full bg-blue-500/10 flex-shrink-0 flex items-center justify-center text-blue-400">
                                        <Users className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold text-white mb-1">Human Expertise</h4>
                                        <p className="text-gray-400 text-sm">Tax planning, legal compliance, and strategic business consulting led by industry veterans.</p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-full bg-purple-500/10 flex-shrink-0 flex items-center justify-center text-purple-400">
                                        <Target className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold text-white mb-1">AI-Powered Precision</h4>
                                        <p className="text-gray-400 text-sm">Real-time market analysis, automated reconciliations, and instant financial calculators.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="absolute -inset-4 bg-gradient-to-r from-primary to-blue-600 opacity-20 blur-2xl rounded-3xl" />
                            <div className="relative grid gap-4">
                                <div className="p-6 bg-[#0F163A] border border-white/10 rounded-2xl flex items-center gap-4 hover:translate-x-2 transition-transform">
                                    <CheckCircle2 className="text-green-400 w-6 h-6" />
                                    <span className="text-white font-medium">Automated GSTR Reconciliation</span>
                                </div>
                                <div className="p-6 bg-[#0F163A] border border-white/10 rounded-2xl flex items-center gap-4 hover:translate-x-2 transition-transform delay-75">
                                    <CheckCircle2 className="text-green-400 w-6 h-6" />
                                    <span className="text-white font-medium">Smart Investment Advisory</span>
                                </div>
                                <div className="p-6 bg-[#0F163A] border border-white/10 rounded-2xl flex items-center gap-4 hover:translate-x-2 transition-transform delay-100">
                                    <CheckCircle2 className="text-green-400 w-6 h-6" />
                                    <span className="text-white font-medium">Advanced Tax Planning</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Why Choose Us - Large Cards */}
                <div className="relative z-10 max-w-7xl mx-auto px-4 pb-32">
                    <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-16">Why Industry Leaders Trust Us</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { emoji: "🧠", title: "AI-Native", desc: "Built from the ground up with AI integration for superior speed and accuracy." },
                            { emoji: "🛡️", title: "Bank-Grade Security", desc: "Your sensitive financial data is fortified with enterprise-level encryption and security protocols." },
                            { emoji: "⚡", title: "Proactive Advisory", desc: "We don't just solve problems; we anticipate them to keep you ahead of the curve." }
                        ].map((item, i) => (
                            <div key={i} className="bg-gradient-to-b from-white/5 to-transparent border border-white/10 p-8 rounded-3xl text-center hover:bg-white/10 transition-colors">
                                <div className="text-5xl mb-6">{item.emoji}</div>
                                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                                <p className="text-gray-400">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
            <Footer />
        </>
    );
};

export default About;
