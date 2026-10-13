"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import {
    ChevronDown,
    Headset,
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
    const [showSuggestions, setShowSuggestions] = useState(true);
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
            inputRef.current?.focus();
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
        setShowSuggestions(true);
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
                        className="fixed bottom-[82px] right-[70px] z-[99] flex max-w-[265px] items-center gap-2 rounded-2xl bg-red-600 px-4 py-3 text-white shadow-lg sm:bottom-[85px] sm:right-[84px]"
                    >
                        <Headset
                            size={18}
                            className="shrink-0"
                        />

                        <button
                            type="button"
                            onClick={() => setIsOpen(true)}
                            className="cursor-pointer text-left text-xs font-semibold leading-relaxed"
                        >
                            Butuh bantuan? Chat dengan Asisten Digital LFA.
                        </button>

                        <button
                            type="button"
                            onClick={() => setShowTip(false)}
                            aria-label="Tutup pesan bantuan"
                            title="Tutup pesan bantuan"
                            className="ml-1 shrink-0 cursor-pointer rounded p-1 transition hover:bg-white/15"
                        >
                            <X size={15} strokeWidth={3} />
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
                className="fixed bottom-5 right-5 z-[100] flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-red-600 text-white shadow-xl transition-all duration-300 hover:scale-105 hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-200 md:bottom-7 md:right-7 md:h-16 md:w-16"
            >
                {isOpen ? (
                    <X size={26} />
                ) : (
                    <MessageSquareText
                        size={25}
                        strokeWidth={2}
                    />
                )}
            </button>

            {/* Jendela percakapan */}
            {isOpen && (
                <section
                    aria-label="Chat Asisten Digital LFA"
                    className="fixed bottom-[88px] right-4 z-[100] flex h-[min(620px,calc(100dvh-120px))] w-[calc(100vw-32px)] max-w-[390px] flex-col overflow-hidden rounded-2xl border border-red-100 bg-white shadow-2xl sm:right-7 md:bottom-[108px]"
                >
                    {/* Header */}
                    <div className="relative overflow-hidden bg-gradient-to-br from-red-700 via-red-600 to-red-500 px-5 py-5 text-white">
                        <div className="pointer-events-none absolute -right-8 -top-10 h-32 w-32 rounded-full bg-white/10" />
                        <div className="pointer-events-none absolute -bottom-12 right-16 h-28 w-28 rounded-full bg-white/5" />

                        <div className="relative flex items-center justify-between gap-3">
                            <div className="flex min-w-0 items-center gap-3">
                                {/* Logo chatbot */}
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/20 bg-white p-1">
                                    <Image
                                        src="/images/logo1.png"
                                        alt="Logo Digital LFA"
                                        width={44}
                                        height={44}
                                        className="h-full w-full object-contain"
                                        priority
                                    />
                                </div>

                                <div className="min-w-0">
                                    <h2 className="text-base font-bold">
                                        Asisten Digital LFA
                                    </h2>

                                    <div className="mt-1 flex items-center gap-1.5">
                                        <span className="h-2 w-2 rounded-full bg-emerald-400" />
                                        <p className="text-xs text-red-50">
                                            Siap membantu Anda
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Tombol hapus dan minimize */}
                            <div className="flex shrink-0 items-center gap-1">
                                <button
                                    type="button"
                                    onClick={resetChat}
                                    aria-label="Hapus percakapan"
                                    title="Hapus percakapan"
                                    className="cursor-pointer rounded-lg p-2 text-white/90 transition hover:bg-white/15 hover:text-white"
                                >
                                    <Trash2 size={19} />
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setIsOpen(false)}
                                    aria-label="Minimalkan chatbot"
                                    title="Minimalkan chatbot"
                                    className="cursor-pointer rounded-lg p-2 text-white/90 transition hover:bg-white/15 hover:text-white"
                                >
                                    <ChevronDown size={22} />
                                </button>
                            </div>
                        </div>

                        <div className="relative mt-4 flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3 py-2">
                            <Sparkles
                                size={15}
                                className="shrink-0 text-red-100"
                            />

                            <p className="text-xs leading-relaxed text-white">
                                Asisten informasi seputar Digital LFA
                            </p>
                        </div>
                    </div>

                    {/* Area percakapan */}
                    <div className="flex-1 space-y-4 overflow-y-auto bg-slate-50 px-4 py-4">
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex items-end gap-2 ${
                                    message.sender === "user"
                                        ? "justify-end"
                                        : "justify-start"
                                }`}
                            >
                                {/* Logo pada pesan chatbot */}
                                {message.sender === "bot" && (
                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-red-100 bg-white p-0.5">
                                        <Image
                                            src="/images/logo1.png"
                                            alt="Asisten Digital LFA"
                                            width={30}
                                            height={30}
                                            className="h-full w-full object-contain"
                                        />
                                    </div>
                                )}

                                <div
                                    className={`max-w-[84%] rounded-2xl px-3.5 py-3 text-sm leading-relaxed ${
                                        message.sender === "user"
                                            ? "rounded-br-md bg-red-600 text-white"
                                            : "rounded-bl-md border border-slate-200 bg-white text-slate-700 shadow-sm"
                                    }`}
                                >
                                    <p className="whitespace-pre-line">
                                        {message.text}
                                    </p>

                                    {/* Jam pesan */}
                                    <p
                                        className={`mt-1 text-right text-[10px] leading-none ${
                                            message.sender === "user"
                                                ? "text-white/75"
                                                : "text-slate-400"
                                        }`}
                                    >
                                        {message.time}
                                    </p>
                                </div>

                                {message.sender === "user" && (
                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-slate-200 text-slate-600">
                                        <User size={17} />
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Pertanyaan yang disarankan */}
                        {showSuggestions && messages.length === 1 && (
                            <div className="ml-10">
                                <p className="mb-2 text-xs font-semibold text-slate-500">
                                    Pertanyaan yang sering diajukan
                                </p>

                                <div className="flex flex-wrap gap-2">
                                    {chatbotData.slice(0, 6).map((item) => (
                                        <button
                                            key={item.question}
                                            type="button"
                                            onClick={() =>
                                                sendMessage(item.question)
                                            }
                                            className="cursor-pointer rounded-full border border-red-200 bg-white px-3 py-2 text-left text-xs font-medium text-red-600 transition hover:border-red-600 hover:bg-red-50"
                                        >
                                            {item.question}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input pesan */}
                    <form
                        onSubmit={(event) => {
                            event.preventDefault();
                            sendMessage(input);
                        }}
                        className="border-t border-slate-200 bg-white p-3"
                    >
                        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 transition focus-within:border-red-400 focus-within:ring-2 focus-within:ring-red-100">
                            <input
                                ref={inputRef}
                                type="text"
                                value={input}
                                onChange={(event) =>
                                    setInput(event.target.value)
                                }
                                placeholder="Tulis pertanyaan..."
                                aria-label="Tulis pertanyaan"
                                className="min-w-0 flex-1 bg-transparent py-1 text-sm text-slate-700 outline-none placeholder:text-slate-400"
                            />

                            <button
                                type="submit"
                                disabled={!input.trim()}
                                aria-label="Kirim pesan"
                                title="Kirim pesan"
                                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-600 text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-slate-300 enabled:cursor-pointer"
                            >
                                <Send size={16} />
                            </button>
                        </div>

                        <div className="mt-2 flex items-center justify-between gap-2">
                            <p className="text-[10px] text-slate-400">
                                Asisten informasi Digital LFA
                            </p>

                            <button
                                type="button"
                                onClick={resetChat}
                                className="cursor-pointer text-[11px] font-medium text-red-600 transition hover:text-red-700"
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