import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Check, Package, User, Building2, Phone, Mail } from 'lucide-react';

import { Button } from './ui/button';
import { Card, CardHeader, CardTitle, CardFooter } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { toast } from 'sonner';
import { getWhatsAppLink } from '../utils/helpers';

type Step = 'welcome' | 'buyer_type' | 'product_interest' | 'quantity' | 'budget' | 'gst' | 'lead-capture' | 'success';

interface ChatMessage {
    id: string;
    type: 'bot' | 'user';
    text: string;
    options?: { label: string; value: string; action?: () => void }[];
    isForm?: boolean;
}

export function ChatBot() {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [currentStep, setCurrentStep] = useState<Step>('welcome');
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isTyping, setIsTyping] = useState(false);
    const [formData, setFormData] = useState({
        inquiryType: '',
        buyerType: '',
        productInterest: [] as string[],
        quantity: '',
        budget: '',
        gst: '',
        leadInfo: {
            name: '',
            company: '', // Maps to Business Name
            mobile: '',
            email: '',
            location: '',
            gstNumber: ''
        }
    });

    const scrollRef = useRef<HTMLDivElement>(null);
    const rawNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '9326347507';

    useEffect(() => {
        const handleOpenChat = () => {
            if (!isOpen) startChat();
        };
        globalThis.addEventListener('open-sakshi-chat', handleOpenChat);
        return () => globalThis.removeEventListener('open-sakshi-chat', handleOpenChat);
    }, [isOpen]);

    const scrollToBottom = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const addMessage = (message: Omit<ChatMessage, 'id'>) => {
        const id = Math.random().toString(36).substring(7);
        setMessages(prev => [...prev, { ...message, id }]);
    };

    const handleWhatsAppRedirect = (customMessage?: string) => {
        const defaultMsg = "Hi, I would like to talk to a  expert about my Ayurvedic and healthcare requirements.";
        const whatsappLink = getWhatsAppLink(rawNumber, customMessage || defaultMsg);
        if (whatsappLink) {
            globalThis.open(whatsappLink, '_blank');
        }
    };

    const startChat = () => {
        setIsOpen(true);
        if (messages.length === 0) {
            setMessages([]);
            setIsTyping(true);
            setTimeout(() => {
                setIsTyping(false);
                addMessage({
                    type: 'bot',
                    text: "🌿 Welcome to Sakshi Enterprise\nEstablished in 2009, we are a trusted name in Ayurvedic and selected healthcare products. We are committed to delivering natural wellness solutions and quality healthcare essentials to customers across India through our online platform.\n\nWe believe in combining the wisdom of Ayurveda with modern distribution efficiency to ensure safe, reliable, and effective products reach every home.",
                    options: [
                        { label: '👉 Explore Products', value: 'continue' },
                        // { label: '👉 Enter Site Directly', value: 'enter', action: () => { navigate('/home'); } },
                        { label: '👉 Talk to an Expert', value: 'expert', action: () => handleWhatsAppRedirect() }
                    ]
                });
            }, 1500);
        }
    };

    const nextStep = (step: Step, prevValue?: string) => {
        setIsTyping(true);
        setCurrentStep(step);

        setTimeout(() => {
            setIsTyping(false);
            switch (step) {
                case 'buyer_type':
                    addMessage({
                        type: 'bot',
                        text: 'Great! What type of buyer are you?',
                        options: [
                            { label: 'Retail Medical Store', value: 'medical_store' },
                            { label: 'Ayurvedic Store', value: 'ayurvedic_store' },
                            { label: 'Distributor / Wholesaler', value: 'distributor' },
                            { label: 'Online Seller', value: 'online_seller' },
                            { label: 'Corporate Buyer', value: 'corporate' },
                            { label: 'Hospital / Clinic', value: 'hospital' }
                        ]
                    });
                    break;
                case 'product_interest':
                    addMessage({
                        type: 'bot',
                        text: 'Which products are you interested in? (You can select multiple)',
                        options: [
                            { label: '🌿 Ayurvedic Kadha', value: 'kadha' },
                            { label: '💆 Ayurvedic Pain Relief Oil', value: 'pain_oil' },
                            { label: '💊 Herbal Immunity Boosters', value: 'immunity' },
                            { label: '🧴 Pain Balm', value: 'balm' },
                            { label: '🩺 Surgical Items', value: 'surgical' },
                            { label: '📦 All Products', value: 'all' },
                            { label: 'Next 👉', value: 'next' }
                        ]
                    });
                    break;
                case 'quantity':
                    addMessage({
                        type: 'bot',
                        text: 'What is your approximate monthly requirement?',
                        options: [
                            { label: '100 – 500 Units', value: '100-500' },
                            { label: '500 – 1000 Units', value: '500-1000' },
                            { label: '1000 – 5000 Units', value: '1000-5000' },
                            { label: '5000+ Units', value: '5000+' }
                        ]
                    });
                    break;
                case 'budget':
                    addMessage({
                        type: 'bot',
                        text: 'To help us filter the best deals for you, what is your expected purchase budget?',
                        options: [
                            { label: '₹25,000 – ₹50,000', value: '25k-50k' },
                            { label: '₹50,000 – ₹1,00,000', value: '50k-100k' },
                            { label: '₹1,00,000+', value: '100k+' }
                        ]
                    });
                    break;
                case 'gst':
                    addMessage({
                        type: 'bot',
                        text: 'Do you have a registered GST Number?',
                        options: [
                            { label: 'Yes', value: 'yes' },
                            { label: 'No', value: 'no' }
                        ]
                    });
                    break;
                case 'lead-capture':
                    addMessage({
                        type: 'bot',
                        text: 'Please share your contact details so our sales team can contact you within 24 hours:',
                        isForm: true
                    });
                    break;
                case 'success':
                    addMessage({
                        type: 'bot',
                        text: '✅ Thank you for sharing your details. Our sales team will contact you within 24 hours.\n\nFor urgent enquiries, you may WhatsApp us directly using the link below.',
                        options: [
                            { label: '👉 Enter Site', value: 'enter', action: () => { navigate('/home'); } },
                            { label: '👉 WhatsApp Us', value: 'expert-now', action: () => { handleWhatsAppRedirect(); } }
                        ]
                    });
                    break;
            }
        }, 800);
    };

    const handleOptionClick = (option: { label: string; value: string; action?: () => void }) => {
        addMessage({ type: 'user', text: option.label });

        if (option.action) {
            option.action();
            if (option.value === 'expert') {
                return;
            }
        }

        switch (currentStep) {
            case 'welcome':
                setFormData(prev => ({ ...prev, inquiryType: option.value }));
                nextStep('buyer_type');
                break;
            case 'buyer_type':
                setFormData(prev => ({ ...prev, buyerType: option.value }));
                nextStep('product_interest');
                break;
            case 'product_interest':
                if (option.value === 'next') {
                    nextStep('quantity');
                } else if (option.value === 'all') {
                    setFormData(prev => ({ ...prev, productInterest: ['All Products'] }));
                    nextStep('quantity');
                } else {
                    setFormData(prev => ({
                        ...prev,
                        productInterest: prev.productInterest.includes(option.value)
                            ? prev.productInterest.filter(p => p !== option.value)
                            : [...prev.productInterest, option.value]
                    }));
                }
                break;
            case 'quantity':
                setFormData(prev => ({ ...prev, quantity: option.value }));
                nextStep('budget');
                break;
            case 'budget':
                setFormData(prev => ({ ...prev, budget: option.value }));
                nextStep('gst');
                break;
            case 'gst':
                setFormData(prev => ({ ...prev, gst: option.value }));
                nextStep('lead-capture');
                break;
        }
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.leadInfo.mobile.length !== 10) {
            alert('Please enter a valid 10-digit mobile number.');
            return;
        }

        // IMMEDIATE ACTIONS: Unlock, Navigate, and Close
        const now = Date.now();
        localStorage.setItem('sakshi_gateway_unlock', now.toString());
        setIsOpen(false);
        navigate('/home');
        toast.success("Welcome! Access granted.");

        // BACKGROUND ACTION: API submission
        const payload = {
            firstName: formData.leadInfo.name.split(' ')[0] || 'Chatbot',
            lastName: formData.leadInfo.name.split(' ').slice(1).join(' ') || 'Lead',
            email: formData.leadInfo.email,
            phone: formData.leadInfo.mobile,
            subject: 'Chatbot Lead - Ayurvedic & Healthcare',
            message: `
--- B2B CHATBOT LEAD ---
Inquiry Type: ${formData.inquiryType}
Buyer Type: ${formData.buyerType}
Product Interest: ${formData.productInterest.join(', ')}
Monthly Quantity: ${formData.quantity}
Budget: ${formData.budget}
Has GST: ${formData.gst}
Location: ${formData.leadInfo.location}
Business Name: ${formData.leadInfo.company}
GST Number: ${formData.leadInfo.gstNumber}
            `.trim()
        };

        // Fire and forget
        const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
        fetch(`${apiBaseUrl}/api/leads`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        }).catch(error => {
            console.error('Chatbot background lead capture error:', error);
        });
    };

    return (
        <>
            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />

                        {/* Modal */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-[600px] h-[85vh] md:h-[660px] pointer-events-auto"
                        >
                            <Card className="shadow-2xl border-primary/20 overflow-hidden flex flex-col h-full bg-white rounded-2xl md:rounded-3xl">
                                <CardHeader className="bg-primary text-white p-4 md:p-5 shrink-0">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 md:gap-3">
                                            <div className="w-9 h-9 md:w-11 md:h-11 bg-secondary rounded-full flex items-center justify-center">
                                                <Package size={18} className="text-primary" />
                                            </div>
                                            <div>
                                                <CardTitle className="text-base md:text-lg font-serif tracking-wide text-white mt-1">Welcome to Sakshi Enterprise</CardTitle>
                                                <div className="flex items-center gap-1.5 leading-none mt-0.5">
                                                    <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-green-500 rounded-full animate-pulse" />
                                                    <span className="text-[8px] md:text-[10px] text-white/70 uppercase tracking-widest font-medium">Always Online</span>
                                                </div>
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="text-white/70 hover:text-white hover:bg-white/10 rounded-full h-9 w-9 md:h-10 md:w-10">
                                            <X size={24} />
                                        </Button>
                                    </div>
                                </CardHeader>

                                <div
                                    ref={scrollRef}
                                    className="flex-1 overflow-y-auto p-4 md:p-6 space-y-5 scroll-smooth"
                                >
                                    <AnimatePresence initial={false}>
                                        {messages.map((msg) => (
                                            <motion.div
                                                key={msg.id}
                                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                transition={{ duration: 0.2 }}
                                                className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                                            >
                                                <div className={`max-w-[90%] md:max-w-[85%] rounded-2xl p-4 md:p-5 text-sm md:text-base shadow-sm ${msg.type === 'user'
                                                    ? 'bg-primary text-primary-foreground rounded-tr-none'
                                                    : 'bg-white border border-border rounded-tl-none'
                                                    }`}>
                                                    <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>

                                                    {msg.isForm && currentStep === 'lead-capture' && (
                                                        <form onSubmit={handleFormSubmit} className="mt-5 space-y-4">
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                <div className="space-y-1.5">
                                                                    <Label className="text-[10px] md:text-xs uppercase tracking-wider opacity-60 flex items-center gap-1.5"><User size={12} /> Name</Label>
                                                                    <Input
                                                                        required
                                                                        autoFocus
                                                                        className="h-10 md:h-12 text-sm md:text-base bg-secondary/10 border-none focus-visible:ring-1 focus-visible:ring-primary"
                                                                        value={formData.leadInfo.name}
                                                                        onChange={e => setFormData(prev => ({ ...prev, leadInfo: { ...prev.leadInfo, name: e.target.value } }))}
                                                                    />
                                                                </div>
                                                                <div className="space-y-1.5">
                                                                    <Label className="text-[10px] md:text-xs uppercase tracking-wider opacity-60 flex items-center gap-1.5"><Building2 size={12} /> Company</Label>
                                                                    <Input
                                                                        required
                                                                        className="h-10 md:h-12 text-sm md:text-base bg-secondary/10 border-none focus-visible:ring-1 focus-visible:ring-primary"
                                                                        value={formData.leadInfo.company}
                                                                        onChange={e => setFormData(prev => ({ ...prev, leadInfo: { ...prev.leadInfo, company: e.target.value } }))}
                                                                    />
                                                                </div>
                                                                <div className="space-y-1.5">
                                                                    <Label className="text-[10px] md:text-xs uppercase tracking-wider opacity-60 flex items-center gap-1.5"><Phone size={12} /> Mobile</Label>
                                                                    <Input
                                                                        required
                                                                        type="tel"
                                                                        maxLength={10}
                                                                        pattern="[0-9]{10}"
                                                                        className="h-10 md:h-12 text-sm md:text-base bg-secondary/10 border-none focus-visible:ring-1 focus-visible:ring-primary"
                                                                        value={formData.leadInfo.mobile}
                                                                        onChange={e => {
                                                                            const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                                                                            setFormData(prev => ({ ...prev, leadInfo: { ...prev.leadInfo, mobile: value } }));
                                                                        }}
                                                                    />
                                                                </div>
                                                                <div className="space-y-1.5">
                                                                    <Label className="text-[10px] md:text-xs uppercase tracking-wider opacity-60 flex items-center gap-1.5"><Mail size={12} /> Email</Label>
                                                                    <Input
                                                                        required
                                                                        type="email"
                                                                        className="h-10 md:h-12 text-sm md:text-base bg-secondary/10 border-none focus-visible:ring-1 focus-visible:ring-primary"
                                                                        value={formData.leadInfo.email}
                                                                        onChange={e => setFormData(prev => ({ ...prev, leadInfo: { ...prev.leadInfo, email: e.target.value } }))}
                                                                    />
                                                                </div>
                                                                <div className="space-y-1.5 md:col-span-2">
                                                                    <Label className="text-[10px] md:text-xs uppercase tracking-wider opacity-60 flex items-center gap-1.5">Delivery Location (City & State)</Label>
                                                                    <Input
                                                                        required
                                                                        className="h-10 md:h-12 text-sm md:text-base bg-secondary/10 border-none focus-visible:ring-1 focus-visible:ring-primary"
                                                                        value={formData.leadInfo.location}
                                                                        onChange={e => setFormData(prev => ({ ...prev, leadInfo: { ...prev.leadInfo, location: e.target.value } }))}
                                                                    />
                                                                </div>
                                                                {formData.gst === 'yes' && (
                                                                    <div className="space-y-1.5 md:col-span-2">
                                                                        <Label className="text-[10px] md:text-xs uppercase tracking-wider opacity-60 flex items-center gap-1.5">GST Number</Label>
                                                                        <Input
                                                                            required
                                                                            className="h-10 md:h-12 text-sm md:text-base bg-secondary/10 border-none focus-visible:ring-1 focus-visible:ring-primary"
                                                                            value={formData.leadInfo.gstNumber}
                                                                            onChange={e => setFormData(prev => ({ ...prev, leadInfo: { ...prev.leadInfo, gstNumber: e.target.value } }))}
                                                                        />
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground gap-2 h-12 md:h-14 text-base md:text-lg font-medium rounded-xl transition-all">
                                                                Submit & Enter Site <Send size={18} />
                                                            </Button>
                                                        </form>
                                                    )}

                                                    {msg.options && !msg.isForm && (
                                                        <div className="mt-4 flex flex-wrap gap-2 md:gap-3">
                                                            {msg.options.map((opt, index) => (
                                                                <button
                                                                    key={`${msg.id}-${opt.value}-${index}`}
                                                                    onClick={() => {
                                                                        if (opt.action) opt.action();
                                                                        handleOptionClick(opt);
                                                                    }}
                                                                    className={`text-xs md:text-sm px-4 md:px-5 py-2 md:py-2.5 rounded-full border transition-all ${formData.productInterest.includes(opt.value) && currentStep === 'product_interest'
                                                                        ? 'bg-primary text-primary-foreground border-primary shadow-md active:scale-95'
                                                                        : 'bg-white border-border hover:border-primary hover:text-primary active:bg-primary/10 shadow-sm'
                                                                        }`}
                                                                >
                                                                    {opt.label}
                                                                    {formData.productInterest.includes(opt.value) && currentStep === 'product_interest' && <Check size={14} className="inline ml-1.5" />}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                    {isTyping && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="flex justify-start"
                                        >
                                            <div className="bg-white border border-border rounded-2xl rounded-tl-none p-4 shadow-sm">
                                                <div className="flex gap-1.5">
                                                    <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1 }} className="w-2.5 h-2.5 bg-primary rounded-full" />
                                                    <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-2.5 h-2.5 bg-primary rounded-full" />
                                                    <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-2.5 h-2.5 bg-primary rounded-full" />
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </div>

                                <CardFooter className="p-4 md:p-5 bg-white border-t shrink-0">
                                    <div className="w-full relative group">
                                        <Input
                                            placeholder="Ask us anything..."
                                            className="pr-14 md:pr-16 bg-secondary/10 border-none h-12 md:h-14 focus-visible:ring-2 focus-visible:ring-primary/30 rounded-xl md:rounded-2xl text-sm md:text-base transition-all"
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    const value = e.currentTarget.value;
                                                    if (value.trim()) {
                                                        const redirectAction = () => handleWhatsAppRedirect(value);
                                                        redirectAction();
                                                        e.currentTarget.value = '';
                                                    }
                                                }
                                            }}
                                        />
                                        <button
                                            onClick={() => {
                                                const input = document.querySelector<HTMLInputElement>('input[placeholder="Ask us anything..."]');
                                                if (input?.value.trim()) {
                                                    const redirectAction = () => handleWhatsAppRedirect(input.value);
                                                    redirectAction();
                                                    input.value = '';
                                                }
                                            }}
                                            className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-11 md:h-11 bg-primary/10 rounded-xl flex items-center justify-center text-primary hover:bg-primary hover:text-white active:scale-90 transition-all"
                                        >
                                            <Send size={20} />
                                        </button>
                                    </div>
                                </CardFooter>
                            </Card>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence >

            <div className="fixed bottom-6 right-6 z-50">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={isOpen ? () => setIsOpen(false) : startChat}
                    className="w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-2xl flex items-center justify-center relative overflow-hidden group border-2 border-white"
                >
                    <AnimatePresence mode="wait">
                        {isOpen ? (
                            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                                <X size={24} />
                            </motion.div>
                        ) : (
                            <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} className="flex flex-col items-center">
                                <MessageCircle size={28} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <div className="absolute inset-0 bg-white/20 translate-y-14 group-hover:translate-y-0 transition-transform duration-300" />
                </motion.button>
            </div>
        </>
    );
}
