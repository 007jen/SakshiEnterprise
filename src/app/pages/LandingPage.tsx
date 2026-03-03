import { useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { motion } from "framer-motion";
import {
    ArrowRight, Star, Heart, Award, Shield, CheckCircle, Pill, BriefcaseMedical
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Footer } from "../components/Footer";
import GoldenImage from "../../assets/goldenImage.jpg";
import Ganesh from "../../assets/Ganesh.png";


// Component for falling gifts effect
const FallingGifts = () => {
    const colors = ['#2d6a4f', '#40916c', '#52b788', '#74c69d', '#b7e4c7'];

    const giftData = useMemo(() => {
        return Array.from({ length: 25 }).map((_, i) => ({
            id: i,
            color: colors[Math.floor(Math.random() * colors.length)],
            x: Math.random() * 100,
            size: 24 + Math.random() * 50,
            duration: 12 + Math.random() * 15,
            delay: Math.random() * 20
        }));
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-20">
            {giftData.map((gift) => (
                <motion.div
                    key={`gift-${gift.id}`}
                    initial={{
                        y: -100,
                        x: `${gift.x}vw`,
                        rotate: 0,
                        opacity: 0
                    }}
                    animate={{
                        y: '110vh',
                        rotate: 360,
                        opacity: [0, 0.7, 0.7, 0]
                    }}
                    transition={{
                        duration: gift.duration,
                        repeat: Infinity,
                        delay: gift.delay,
                        ease: "linear"
                    }}
                    className="absolute"
                    style={{ color: gift.color }}
                >
                    {/* <Leaf size={gift.size} strokeWidth={1} /> */}
                    <Pill size={gift.size} strokeWidth={1} />
                    <BriefcaseMedical size={gift.size} strokeWidth={1} />
                </motion.div>
            ))}
        </div>
    );
};

export function LandingPage() {
    const { user } = useUser();
    const navigate = useNavigate();

    // Admin detection logic matching App.tsx
    const adminEmail = import.meta.env.VITE_ADMIN_EMAIL || '';
    const adminEmails = adminEmail.split(',').map(e => e.trim().toLowerCase());
    const isAdmin = !!user && adminEmails.includes(user.primaryEmailAddress?.emailAddress?.toLowerCase() || '');

    useEffect(() => {
        const unlockTime = localStorage.getItem('sakshi_gateway_unlock');
        if (unlockTime) {
            const now = Date.now();
            const twentyFourHours = 24 * 60 * 60 * 1000;
            if (now - Number.parseInt(unlockTime) <= twentyFourHours) {
                navigate('/home');
            } else {
                localStorage.removeItem('sakshi_gateway_unlock');
            }
        }
    }, [navigate]);

    const handleBeginJourney = () => {
        // Always trigger the chatbot
        globalThis.dispatchEvent(new CustomEvent('open-sakshi-chat'));
    };

    return (
        <div className="min-h-screen bg-white text-foreground selection:bg-primary/20 selection:text-primary relative">

            {/* Falling Gifts Layer */}
            <FallingGifts />

            {/* Admin Access (Subtle) - Only visible to admins */}
            {isAdmin && (
                <div className="absolute top-4 right-4 z-50">
                    <Link to="/admin">
                        <Button variant="outline" size="sm" className="bg-white/5 backdrop-blur-md hover:bg-white/10 text-primary/60 hover:text-primary gap-2 border border-primary/10 transition-all rounded-full px-4 text-xs">
                            <Shield size={12} />
                            Admin Access
                        </Button>
                    </Link>
                </div>
            )}

            {/* --- INTRODUCTION SECTION --- */}
            <section className="relative pt-8 md:pt-12 pb-24 md:pb-32 bg-secondary/10 text-center overflow-hidden">
                <div className="container mx-auto px-4 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="flex flex-col items-center"
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            className="relative mb-4 group"
                        >
                            <div className="absolute inset-0 bg-primary/10 blur-2xl rounded-full scale-110 group-hover:bg-primary/20 transition-all duration-1000" />
                            <img
                                src={Ganesh}
                                alt="Sakshi Enterprise"
                                className="relative w-24 md:w-32 lg:w-40 grayscale-[0.5] hover:grayscale-0 transition-all"
                            />
                        </motion.div>

                        <motion.h1
                            className="text-7xl sm:text-8xl md:text-9xl lg:text-[10rem] mb-4 font-bold text-primary py-4"
                        >
                            Sakshi Enterprise
                        </motion.h1>

                        <motion.div
                            className="flex items-center justify-center space-x-2 sm:space-x-4 mb-8"
                        >
                            <div className="h-[1px] w-8 sm:w-16 bg-primary/20" />
                            <span className="text-primary tracking-[0.2em] sm:tracking-[0.4em] text-xl sm:text-2lg font-medium uppercase">
                                Authentic Ayurvedic & Healthcare
                            </span>
                            <div className="h-[1px] w-8 sm:w-16 bg-primary/20" />
                        </motion.div>

                        <motion.p
                            className="text-base sm:text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed font-light px-4"
                        >
                            Committed to promoting quality, reliability, and customer satisfaction through genuine Ayurvedic preparations and essential healthcare products.
                        </motion.p>

                        <motion.div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link to="/home">
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="border-primary text-primary hover:bg-primary/5 px-8 sm:px-10 py-6 sm:py-7 text-lg rounded-full transition-all duration-500 hover:scale-105 w-full sm:w-auto"
                                >
                                    Enter Site <ArrowRight className="ml-2" />
                                </Button>
                            </Link>
                        </motion.div>
                    </motion.div>
                </div>

                <div className="mt-16 md:mt-20 flex flex-col items-center gap-2 opacity-60">
                    <span className="text-[10px] tracking-[0.3em] uppercase text-primary">Scroll to Discover</span>
                    <div className="w-[1px] h-10 md:h-12 bg-gradient-to-b from-primary to-transparent" />
                </div>
            </section>

            {/* --- ABOUT SECTION --- */}
            <section className="py-32 relative overflow-hidden bg-white">
                <div className="container mx-auto px-4 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-20 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <h2 className="text-primary tracking-widest uppercase text-sm mb-4 font-semibold">About Us</h2>
                            <h3 className="text-4xl md:text-6xl font-light mb-8 leading-tight text-primary">
                                Promoting Quality  <span className="text-primary italic font-bold capitalize text-5xl md:text-7xl">Products</span>
                            </h3>
                            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                                Sakshi Enterprise is a trusted supplier of Ayurvedic and general medicines products. We specialize in Ayurvedic preparations and selected healthcare essentials for pharmacies, retailers, and distributors.
                            </p>
                            <div className="grid grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <h4 className="text-primary text-2xl font-script tracking-wide italic">Authenticity</h4>
                                    <p className="text-xs text-muted-foreground uppercase tracking-tighter max-w-[150px]">Genuine Ayurvedic and wellness products you can trust.</p>
                                </div>
                                <div className="space-y-2">
                                    <h4 className="text-primary text-2xl font-script tracking-wide italic">Reliability</h4>
                                    <p className="text-xs text-muted-foreground uppercase tracking-tighter max-w-[150px]">Consistent quality and dependable supply for our partners.</p>
                                </div>
                            </div>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1 }}
                            className="relative group"
                        >
                            <div className="absolute -inset-4 bg-primary/5 rounded-2xl blur-2xl group-hover:bg-primary/10 transition-all duration-700" />
                            <img
                                src={GoldenImage}
                                alt="Healthcare Excellence"
                                className="relative rounded-2xl shadow-2xl border border-border transition-all duration-700 grayscale-[0.3] hover:grayscale-0"
                            />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* --- SERVICES SECTION --- */}
            <section className="py-32 bg-transparent">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-20">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-4xl md:text-5xl font-light mb-4 text-primary"
                        >
                            Healthcare Essentials & <span className="text-primary italic font-bold capitalize">Ayurvedic Range</span>
                        </motion.h2>
                        <p className="text-muted-foreground tracking-[0.2em] uppercase text-xs font-semibold">Expertly Sourced Wellness</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Ayurvedic Range */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="group p-12 bg-slate-50 border border-border hover:border-primary/40 rounded-3xl transition-all duration-500 hover:shadow-xl backdrop-blur-sm"
                        >
                            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-primary/20 transition-colors">
                                <Pill className="text-primary" size={32} />
                            </div>
                            <h3 className="text-3xl mb-6 font-light text-primary">Ayurvedic Range</h3>
                            <p className="text-muted-foreground mb-8 leading-relaxed">
                                Traditional Ayurvedic preparations including Kadhas, herbal decoctions, and immunity booster formulations designed for preventive healthcare.
                            </p>
                            <ul className="space-y-4 text-sm text-muted-foreground">
                                <li className="flex items-center gap-3"><CheckCircle size={14} className="text-primary" /> Authentic Herbal Decoctions</li>
                                <li className="flex items-center gap-3"><CheckCircle size={14} className="text-primary" /> Natural Immunity Boosters</li>
                                <li className="flex items-center gap-3"><CheckCircle size={14} className="text-primary" /> Therapeutic Wellness Supplements</li>
                            </ul>
                        </motion.div>

                        {/* Healthcare Essentials */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="group p-12 bg-slate-50 border border-border hover:border-primary/40 rounded-3xl transition-all duration-500 hover:shadow-xl backdrop-blur-sm"
                        >
                            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-primary/20 transition-colors">
                                <Heart className="text-primary" size={32} />
                            </div>
                            <h3 className="text-3xl mb-6 font-light text-primary">Healthcare Essentials</h3>
                            <p className="text-muted-foreground mb-8 leading-relaxed">
                                Selected surgical items, OTC wellness products, and preventive healthcare essentials to support businesses and communities.
                            </p>
                            <ul className="space-y-4 text-sm text-muted-foreground">
                                <li className="flex items-center gap-3"><CheckCircle size={14} className="text-primary" /> Selected Surgical Items</li>
                                <li className="flex items-center gap-3"><CheckCircle size={14} className="text-primary" /> OTC Wellness Products</li>
                                <li className="flex items-center gap-3"><CheckCircle size={14} className="text-primary" /> Pain Relief Balms & Oils</li>
                            </ul>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* --- FEATURES GRID --- */}
            <section className="py-32 bg-secondary/5">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
                        {[
                            { icon: Award, title: "Curated Luxury", desc: "Every piece is vetted for quality and aesthetic appeal." },
                            { icon: Shield, title: "Premium Guarantee", desc: "Secure shipping and quality-approved products only." },
                            { icon: Star, title: "Bespoke Service", desc: "Dedicated support for all your custom requirements." },
                            { icon: ArrowRight, title: "Seamless Flow", desc: "Easy selection, fast customization, on-time arrival." }
                        ].map((f, i) => (
                            <motion.div
                                key={f.title}
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="text-center group"
                            >
                                <div className="mb-6 mx-auto w-12 h-12 flex items-center justify-center text-primary group-hover:text-primary transition-colors">
                                    <f.icon size={32} strokeWidth={1.5} />
                                </div>
                                <h4 className="text-lg mb-3 font-semibold text-primary">{f.title}</h4>
                                <p className="text-sm text-muted-foreground px-4 py-2 leading-relaxed font-light inline-block">
                                    {f.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- FINAL CTA --- */}
            <section className="py-40 relative overflow-hidden bg-primary text-primary-foreground">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-black/10 mix-blend-overlay" />
                </div>

                <div className="container mx-auto px-4 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="text-5xl md:text-7xl mb-8 font-light tracking-tight">
                            Your Partner in <br />
                            <span className="text-white italic font-bold capitalize">Wellness Excellence</span>
                        </h2>
                        <Button
                            onClick={handleBeginJourney}
                            size="lg"
                            className="bg-white hover:bg-slate-100 text-primary px-16 py-8 text-2xl rounded-full transition-all duration-500 hover:scale-105 shadow-2xl"
                        >
                            Get Started
                        </Button>
                    </motion.div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
