"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Sparkles,
    X,
    Send,
    User,
    Bot,
    ChevronRight,
    ShoppingBag,
    Loader2,
    RefreshCw,
    ArrowLeft,
} from "lucide-react";
import axios from "axios";
import { useCartStore } from "@/stores/cart-store";
import toast from "react-hot-toast";

// Types matching backend
interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    images: string[];
}

interface StylistRecommendation {
    product: Product;
    reason: string;
}

interface StylistResponse {
    message: string;
    recommendations: StylistRecommendation[];
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const QUESTIONS = [
    {
        id: "gender",
        question: "Who are we styling for today?",
        options: ["Male", "Female", "Unisex"],
    },
    {
        id: "age_group",
        question: "What's the age group?",
        options: ["Teen", "Adult", "Senior"],
    },
    {
        id: "occasion",
        question: "What's the special occasion?",
        options: ["Wedding", "Office", "Casual", "Eid", "Party", "Date Night"],
    },
    {
        id: "budget",
        question: "What's your budget range (PKR)?",
        options: ["0-3000", "3000-7000", "7000-15000", "15000+"],
    },
];

export default function AIStylist() {
    const [isOpen, setIsOpen] = useState(false);
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState<any>({});
    const [isThinking, setIsThinking] = useState(false);
    const [messages, setMessages] = useState<any[]>([
        { role: "ai", text: "Hello! I am your Hanzla AI Stylist. Let's find your perfect look together." }
    ]);
    const [results, setResults] = useState<StylistResponse | null>(null);
    const chatEndRef = useRef<HTMLDivElement>(null);
    const addToCart = useCartStore((state) => state.addToCart);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isOpen && messages.length === 1 && step === 0) {
            // Trigger first question after a small delay
            setTimeout(() => {
                setMessages(prev => [...prev, { role: "ai", text: QUESTIONS[0].question, type: "question", id: QUESTIONS[0].id }]);
            }, 600);
        }
    }, [isOpen]);

    useEffect(() => {
        scrollToBottom();
    }, [messages, isThinking]);

    const handleAnswer = async (questionId: string, value: string) => {
        const newAnswers = { ...answers, [questionId]: value };
        setAnswers(newAnswers);

        // Add user response to chat
        setMessages(prev => [...prev, { role: "user", text: value }]);

        if (step < QUESTIONS.length - 1) {
            const nextStep = step + 1;
            setStep(nextStep);
            setIsThinking(true);
            setTimeout(() => {
                setIsThinking(false);
                setMessages(prev => [...prev, {
                    role: "ai",
                    text: QUESTIONS[nextStep].question,
                    type: "question",
                    id: QUESTIONS[nextStep].id
                }]);
            }, 1000);
        } else {
            // Final step - call API
            setIsThinking(true);
            try {
                // Parse budget
                const budgetParts = newAnswers.budget.replace("+", "").split("-");
                const bMin = parseFloat(budgetParts[0]);
                const bMax = budgetParts[1] ? parseFloat(budgetParts[1]) : 50000;

                const response = await axios.post(`${API_URL}/api/v1/ai/stylist`, {
                    gender: newAnswers.gender.toLowerCase(),
                    age_group: newAnswers.age_group.toLowerCase(),
                    occasion: newAnswers.occasion,
                    budget_min: bMin,
                    budget_max: bMax,
                    colors: [],
                    body_type: ""
                });

                setResults(response.data);
                setIsThinking(false);
                setMessages(prev => [...prev, {
                    role: "ai",
                    text: response.data.message,
                    type: "recommendations"
                }]);
            } catch (error) {
                console.error("AI Stylist Error:", error);
                setIsThinking(false);
                setMessages(prev => [...prev, {
                    role: "ai",
                    text: "I'm having a little trouble connecting to my fashion database. But don't worry, you can always browse our latest collections!"
                }]);
            }
        }
    };

    const handleAddToCart = (product: Product) => {
        addToCart({
            product_id: product.id,
            name: product.name,
            price: product.price,
            image: product.images[0],
            quantity: 1
        });
        toast.success(`${product.name} added to cart!`);
    };

    const handleReset = () => {
        setStep(0);
        setAnswers({});
        setResults(null);
        setMessages([
            { role: "ai", text: "Hello! I am your Hanzla AI Stylist. Let's find your perfect look together." },
            { role: "ai", text: QUESTIONS[0].question, type: "question", id: QUESTIONS[0].id }
        ]);
        toast.success("Chat reset successfully.");
    };

    const handleBack = () => {
        if (step > 0) {
            const prevStep = step - 1;
            setStep(prevStep);
            // Remove the last two messages (user answer and the next AI question)
            setMessages(prev => prev.slice(0, -2));
            // Add the previous question back
            setMessages(prev => [...prev, {
                role: "ai",
                text: QUESTIONS[prevStep].question,
                type: "question",
                id: QUESTIONS[prevStep].id
            }]);
        }
    };

    return (
        <>
            {/* Floating Button */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className={`fixed bottom-6 right-6 z-[60] flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-gold to-gold-dark text-black shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all ${isOpen ? "rotate-90" : ""}`}
            >
                {isOpen ? <X className="h-7 w-7" /> : <Sparkles className="h-7 w-7 text-black animate-pulse" />}
                <span className="absolute -inset-1 rounded-full bg-gold/20 animate-ping pointer-events-none" />
            </motion.button>

            {/* Chat Modal */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 100, scale: 0.8, x: 20 }}
                        animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
                        exit={{ opacity: 0, y: 100, scale: 0.8, x: 20 }}
                        className="fixed bottom-24 right-6 z-[60] flex h-[600px] w-[90vw] max-w-[400px] flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#0A0A0A]/95 shadow-2xl backdrop-blur-xl"
                    >
                        {/* Header */}
                        <div className="flex items-center gap-3 bg-gradient-to-r from-gold/20 to-transparent p-5 border-b border-white/5">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold text-black shadow-lg">
                                <Bot className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-sm font-bold text-white">Hanzla AI Stylist</h3>
                                <div className="flex items-center gap-1.5">
                                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="text-[10px] font-semibold text-emerald-500/80 uppercase tracking-widest">Online</span>
                                </div>
                            </div>
                            <button
                                onClick={handleReset}
                                title="Reset Chat"
                                className="p-2 text-white/40 hover:text-gold transition-colors"
                            >
                                <RefreshCw className="h-4 w-4" />
                            </button>
                        </div>

                        {/* Chat Body */}
                        <div className="flex-1 overflow-y-auto p-5 scrollbar-hide space-y-4">
                            {messages.map((msg, i) => (
                                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                                    <div className={`flex max-w-[85%] flex-col gap-2 ${msg.role === "user" ? "items-end" : "items-start"}`}>
                                        <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${msg.role === "user"
                                            ? "bg-teal text-white rounded-tr-none"
                                            : "bg-white/5 text-white/90 border border-white/5 rounded-tl-none"
                                            }`}>
                                            {msg.text}
                                        </div>

                                        {/* Specific rendering for questions */}
                                        {msg.type === "question" && (
                                            <div className="space-y-3 mt-2">
                                                <div className="flex flex-wrap gap-2">
                                                    {QUESTIONS.find(q => q.id === msg.id)?.options.map(opt => (
                                                        <button
                                                            key={opt}
                                                            onClick={() => handleAnswer(msg.id, opt)}
                                                            className="rounded-full border border-gold/40 bg-gold/10 px-4 py-2 text-xs font-semibold text-gold transition-all hover:bg-gold hover:text-black"
                                                        >
                                                            {opt}
                                                        </button>
                                                    ))}
                                                </div>
                                                {step > 0 && i === messages.length - 1 && (
                                                    <button
                                                        onClick={handleBack}
                                                        className="flex items-center gap-1 text-[10px] font-bold text-white/40 hover:text-white transition-colors"
                                                    >
                                                        <ArrowLeft className="h-3 w-3" />
                                                        Go Back
                                                    </button>
                                                )}
                                            </div>
                                        )}

                                        {/* Specific rendering for recommendations */}
                                        {msg.type === "recommendations" && results && (
                                            <div className="grid gap-4 mt-4 w-full">
                                                {results.recommendations.map((rec, idx) => (
                                                    <motion.div
                                                        initial={{ opacity: 0, x: -20 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: idx * 0.2 }}
                                                        key={idx}
                                                        className="rounded-2xl bg-white/5 border border-white/10 p-4 space-y-3"
                                                    >
                                                        <div className="flex gap-3">
                                                            <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl">
                                                                <img src={rec.product.images[0]} alt={rec.product.name} className="h-full w-full object-cover" />
                                                            </div>
                                                            <div className="space-y-1">
                                                                <h4 className="text-xs font-bold text-white line-clamp-1">{rec.product.name}</h4>
                                                                <p className="text-[11px] text-gold font-bold">PKR {rec.product.price.toLocaleString()}</p>
                                                                <p className="text-[10px] text-white/50 leading-tight line-clamp-2">{rec.reason}</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() => handleAddToCart(rec.product)}
                                                                className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-gold py-2 text-[10px] font-bold text-black transition-transform hover:scale-[1.02]"
                                                            >
                                                                <ShoppingBag className="h-3 w-3" />
                                                                Add to Cart
                                                            </button>
                                                            <a
                                                                href={`/products/${rec.product.id}`}
                                                                className="flex items-center justify-center rounded-xl bg-white/10 px-4 py-2 text-[10px] font-bold text-white hover:bg-white/20"
                                                            >
                                                                Details
                                                            </a>
                                                        </div>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}

                            {isThinking && (
                                <div className="flex justify-start">
                                    <div className="rounded-2xl bg-white/5 px-4 py-3 text-white/50 border border-white/5 rounded-tl-none">
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    </div>
                                </div>
                            )}
                            <div ref={chatEndRef} />
                        </div>

                        {/* Footer Info */}
                        <div className="p-4 text-center border-t border-white/5">
                            <p className="text-[10px] text-white/30 italic">
                                Powered by Gemini Flash AI • Hanzla Outlet Premium
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
