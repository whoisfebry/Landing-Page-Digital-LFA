"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import {
    ChevronDown,
    Headset,
    List,
    MessageSquareText,
    Send,
    Sparkles,
    User,
    X,
    Trash2,
} from "lucide-react";

import {
    chatbotData,
    getChatbotAnswer,
} from "@/constants/chatbotData";

type Message = {
    id: number;
    text: string;
    sender: "bot" | "user";
    time: string;
};

function getCurrentTime() {
    return new Date().toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    });
}

const initialMessage: Message = {
    id: 1,
    sender: "bot",
    text: "Halo! 👋 Selamat datang di Digital LFA. Saya Asisten Digital LFA, siap membantu menjawab pertanyaan seputar sistem ini. Silakan pilih pertanyaan yang tersedia atau tuliskan pertanyaanmu.",
    time: getCurrentTime(),
};

export default function AIChatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [showTip, setShowTip] = useState(false);
    const [hasReachedFooter, setHasReachedFooter] = useState(false);
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState<Message[]>([
        initialMessage,
    ]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [nextId, setNextId] = useState(2);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const shouldReduceMotion = useReducedMotion();

    // Tampilkan notifikasi hanya ketika Footer terlihat.
    useEffect(() => {
        const footer =
            document.getElementById("footer") ??
            document.querySelector("footer");

        if (!footer) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                const isFooterVisible = entry.isIntersecting;

                if (isFooterVisible) {
                    setHasReachedFooter(true);
                }

                setShowTip(
                    isFooterVisible && !isOpen
                );
            },
            {
                threshold: 0.1,
            }
        );

        observer.observe(footer);

        return () => observer.disconnect();
    }, [isOpen]);

    // Gulir otomatis ke pesan terbaru.
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "end",
        });
    }, [messages, isOpen]);

    // Fokuskan input ketika chatbot dibuka.
    useEffect(() => {
        if (isOpen) {
            setShowTip(false);
        } else if (hasReachedFooter) {
            // Setelah Footer pernah dicapai, tombol chatbot
            // tetap dapat dibuka tanpa memunculkan tip terus-menerus.
            setShowTip(false);
        }
    }, [isOpen, hasReachedFooter]);

    function sendMessage(text: string) {
        const trimmedText = text.trim();

        if (!trimmedText) return;

        const userMessage: Message = {
            id: nextId,
            text: trimmedText,
            sender: "user",
            time: getCurrentTime(),
        };

        const botMessage: Message = {
            id: nextId + 1,
            text: getChatbotAnswer(trimmedText),
            sender: "bot",
            time: getCurrentTime(),
        };

        setMessages((previous) => [
            ...previous,
            userMessage,
            botMessage,
        ]);

        setNextId((previous) => previous + 2);
        setInput("");
        setShowSuggestions(false);
    }

    function resetChat() {
        setMessages([
            {
                ...initialMessage,
                time: getCurrentTime(),
            },
        ]);

        setInput("");
        setShowSuggestions(false);
        setNextId(2);
    }

    return (
        <>
            {/* Balon bantuan: muncul saat Footer terlihat */}
            <AnimatePresence>
                {!isOpen && showTip && (
                    <motion.div
                        key="chatbot-tip"
                        initial={{
                            opacity: 0,
                            y: shouldReduceMotion ? 0 : 12,
                            scale: shouldReduceMotion ? 1 : 0.96,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                            scale: 1,
                        }}
                        exit={{
                            opacity: 0,
                            y: shouldReduceMotion ? 0 : 8,
                            scale: shouldReduceMotion ? 1 : 0.98,
                        }}
                        transition={{
                            duration: shouldReduceMotion ? 0 : 0.3,
                            ease: "easeOut",
                        }}
                        className="fixed bottom-[60px] right-[54px] z-[99] flex max-w-[190px] items-center gap-1.5 rounded-xl bg-red-600 px-3 py-2 text-white shadow-lg sm:bottom-[72px] sm:right-[72px] sm:max-w-[220px] sm:rounded-xl sm:px-3 sm:py-2.5"
                    >
                        <Headset
                            size={15}
                            className="shrink-0 sm:h-[18px] sm:w-[18px]"
                        />

                        <button
                            type="button"
                            onClick={() => setIsOpen(true)}
                            className="cursor-pointer text-left text-[10px] font-semibold leading-snug sm:text-xs sm:leading-relaxed"
                        >
                            Butuh bantuan? Chat dengan kami.
                        </button>

                        <button
                            type="button"
                            onClick={() => setShowTip(false)}
                            aria-label="Tutup pesan bantuan"
                            title="Tutup pesan bantuan"
                            className="ml-1 shrink-0 cursor-pointer rounded p-1 transition hover:bg-white/15"
                        >
                            <X size={13} strokeWidth={3} />
                        </button>

                        {/* Ekor balon */}
                        <span className="pointer-events-none absolute -bottom-[6px] right-5 h-3 w-3 rotate-45 bg-red-600 sm:-right-[6px] sm:bottom-4" />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Tombol chatbot mengambang */}
            <button
                type="button"
                onClick={() => setIsOpen((previous) => !previous)}
                aria-label={
                    isOpen
                        ? "Tutup Asisten Digital LFA"
                        : "Buka Asisten Digital LFA"
                }
                title={
                    isOpen
                        ? "Tutup chatbot"
                        : "Buka Asisten Digital LFA"
                }
                className="fixed bottom-4 right-4 z-[100] flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-red-600 text-white shadow-xl transition-all duration-300 hover:scale-105 hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-200 sm:bottom-5 sm:right-5 sm:h-13 sm:w-13 md:bottom-6 md:right-6 md:h-14 md:w-14"
            >
                {isOpen ? (
                    <X size={21} />
                ) : (
                    <MessageSquareText
                        size={25}
                        strokeWidth={2}
                        className="h-[20px] w-[20px] sm:h-[21px] sm:w-[21px]"
                    />
                )}
            </button>

            {/* Jendela percakapan */}
            {isOpen && (
                <section
                    aria-label="Chat Asisten Digital LFA"
                    className="fixed bottom-[76px] right-2.5 z-[100] flex h-[min(430px,calc(100dvh-118px))] w-[calc(100vw-64px)] max-w-[300px] flex-col overflow-hidden rounded-xl border border-red-100 bg-white shadow-2xl sm:bottom-[76px] sm:right-5 sm:h-[min(500px,calc(100dvh-88px))] sm:w-[min(340px,calc(100vw-40px))] sm:max-w-[340px] sm:rounded-xl md:bottom-[88px] md:right-6"
                >
                    {/* Header */}
                    <div className="relative overflow-hidden bg-gradient-to-br from-red-700 via-red-600 to-red-500 px-3 py-3 text-white sm:px-4 sm:py-3.5">
                        <div className="pointer-events-none absolute -right-6 -top-7 h-20 w-20 rounded-full bg-white/10 sm:-right-7 sm:-top-8 sm:h-24 sm:w-24" />
                        <div className="pointer-events-none absolute -bottom-8 right-12 h-20 w-20 rounded-full bg-white/5 sm:-bottom-9 sm:right-12 sm:h-20 sm:w-20" />

                        <div className="relative flex items-center justify-between gap-2">
                            <div className="flex min-w-0 items-center gap-2 sm:gap-2.5">
                                {/* Logo chatbot */}
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-white/20 bg-white p-1">
                                    <Image
                                        src="/images/logo1.png"
                                        alt="Logo Digital LFA"
                                        width={36}
                                        height={36}
                                        className="h-full w-full object-contain"
                                        priority
                                    />
                                </div>

                                <div className="min-w-0">
                                    <h2 className="text-[12px] font-bold leading-tight sm:text-sm">
                                        Asisten Digital LFA
                                    </h2>

                                    <div className="mt-1 flex items-center gap-1.5">
                                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                                        <p className="text-[10px] text-red-50 sm:text-[11px]">
                                            Siap membantu Anda
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Tombol daftar pertanyaan, hapus, dan minimize */}
                            <div className="flex shrink-0 items-center gap-1">
                                <button
                                    type="button"
                                    onClick={() => setShowSuggestions((previous) => !previous)}
                                    aria-label="Pertanyaan yang sering diajukan"
                                    aria-expanded={showSuggestions}
                                    title="Pertanyaan yang sering diajukan"
                                    className={`cursor-pointer rounded-lg p-1.5 text-white/90 transition hover:bg-white/15 hover:text-white ${showSuggestions ? "bg-white/20" : ""}`}
                                >
                                    <List size={17} />
                                </button>

                                <button
                                    type="button"
                                    onClick={resetChat}
                                    aria-label="Hapus percakapan"
                                    title="Hapus percakapan"
                                    className="cursor-pointer rounded-lg p-1.5 text-white/90 transition hover:bg-white/15 hover:text-white"
                                >
                                    <Trash2 size={16} />
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setIsOpen(false)}
                                    aria-label="Minimalkan chatbot"
                                    title="Minimalkan chatbot"
                                    className="cursor-pointer rounded-lg p-1.5 text-white/90 transition hover:bg-white/15 hover:text-white"
                                >
                                    <ChevronDown size={18} />
                                </button>
                            </div>
                        </div>

                        <div className="relative mt-2.5 flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/10 px-2.5 py-1.5 sm:mt-3 sm:gap-2 sm:rounded-lg sm:px-2.5 sm:py-1.5">
                            <Sparkles
                                size={13}
                                className="shrink-0 text-red-100"
                            />

                            <p className="text-[10px] leading-snug text-white sm:text-[11px] sm:leading-relaxed">
                                Asisten informasi seputar Digital LFA
                            </p>
                        </div>
                    </div>

                    {/* Area percakapan */}
                    <div className="flex-1 space-y-2.5 overflow-y-auto bg-slate-50 px-2.5 py-2.5 sm:space-y-3 sm:px-3 sm:py-3">
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex items-end gap-2 ${message.sender === "user"
                                        ? "justify-end"
                                        : "justify-start"
                                    }`}
                            >
                                {/* Logo pada pesan chatbot */}
                                {message.sender === "bot" && (
                                    <div className="flex h-6 w-6 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-red-100 bg-white p-0.5 sm:h-7 sm:w-7 sm:rounded-lg">
                                        <Image
                                            src="/images/logo1.png"
                                            alt="Asisten Digital LFA"
                                            width={26}
                                            height={26}
                                            className="h-full w-full object-contain"
                                        />
                                    </div>
                                )}

                                <div
                                    className={`max-w-[88%] rounded-xl px-2.5 py-2 text-[11px] leading-relaxed sm:max-w-[86%] sm:rounded-xl sm:px-3 sm:py-2.5 sm:text-xs ${message.sender === "user"
                                            ? "rounded-br-md bg-red-600 text-white"
                                            : "rounded-bl-md border border-slate-200 bg-white text-slate-700 shadow-sm"
                                        }`}
                                >
                                    <p className="whitespace-pre-line">
                                        {message.text}
                                    </p>

                                    {/* Jam pesan */}
                                    <p
                                        className={`mt-1 text-right text-[10px] leading-none ${message.sender === "user"
                                                ? "text-white/75"
                                                : "text-slate-400"
                                            }`}
                                    >
                                        {message.time}
                                    </p>
                                </div>

                                {message.sender === "user" && (
                                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-slate-200 text-slate-600 sm:h-7 sm:w-7 sm:rounded-lg">
                                        <User size={15} />
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Panel pertanyaan yang dibuka melalui ikon daftar */}
                        <AnimatePresence initial={false}>
                            {showSuggestions && (
                                <motion.div
                                    initial={shouldReduceMotion ? false : { opacity: 0, y: -6, scale: 0.98 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={shouldReduceMotion ? undefined : { opacity: 0, y: -4, scale: 0.98 }}
                                    transition={{ duration: shouldReduceMotion ? 0 : 0.18 }}
                                    className="ml-8 max-w-[calc(100%-2rem)] rounded-xl border border-red-100 bg-white p-2 shadow-md sm:ml-9 sm:max-w-[calc(100%-2.25rem)] sm:p-2.5"
                                >
                                    <div className="mb-2 flex items-center gap-1.5">
                                        <List size={13} className="shrink-0 text-red-600" />
                                        <p className="text-[10px] font-semibold text-slate-700 sm:text-[11px]">
                                            Pertanyaan yang sering diajukan
                                        </p>
                                    </div>

                                    <div className="flex flex-col gap-1">
                                        {chatbotData.slice(0, 6).map((item) => (
                                            <button
                                                key={item.question}
                                                type="button"
                                                onClick={() => sendMessage(item.question)}
                                                className="w-full cursor-pointer rounded-lg border border-transparent px-2 py-1.5 text-left text-[10px] leading-snug text-slate-700 transition hover:border-red-100 hover:bg-red-50 hover:text-red-600 sm:text-[11px]"
                                            >
                                                {item.question}
                                            </button>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input pesan */}
                    <form
                        onSubmit={(event) => {
                            event.preventDefault();
                            sendMessage(input);
                        }}
                        className="border-t border-slate-200 bg-white p-2 sm:p-2.5"
                    >
                        <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 transition focus-within:border-red-400 focus-within:ring-2 focus-within:ring-red-100 sm:gap-2 sm:rounded-lg sm:px-2.5 sm:py-1.5">
                            <input
                                ref={inputRef}
                                type="text"
                                value={input}
                                onChange={(event) => setInput(event.target.value)}
                                placeholder="Tulis pertanyaan..."
                                aria-label="Tulis pertanyaan"
                                className="min-w-0 flex-1 bg-transparent py-1 text-base text-slate-700 outline-none placeholder:text-slate-400 sm:text-xs"
                            />

                            <button
                                type="submit"
                                disabled={!input.trim()}
                                aria-label="Kirim pesan"
                                title="Kirim pesan"
                                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-red-600 text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-slate-300 enabled:cursor-pointer sm:h-8 sm:w-8 sm:rounded-md"
                            >
                                <Send size={14} />
                            </button>
                        </div>

                        <div className="mt-1.5 flex items-center justify-between gap-2 sm:mt-2">
                            <p className="text-[8px] text-slate-400 sm:text-[9px]">
                                Asisten informasi Digital LFA
                            </p>

                            <button
                                type="button"
                                onClick={resetChat}
                                className="cursor-pointer text-[9px] font-medium text-red-600 transition hover:text-red-700 sm:text-[10px]"
                            >
                                Mulai ulang
                            </button>
                        </div>
                    </form>
                </section>
            )}
        </>
    );
}