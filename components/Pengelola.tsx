"use client";

import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";

const slides = [
    {
        image: "/images/seragaman.webp",
        alt: "Dokumentasi petugas di wilayah kerja hulu minyak dan gas bumi",
        caption: "Dokumentasi petugas di wilayah kerja hulu migas",
    },
    {
        image: "/images/umkm.webp",
        alt: "Dokumentasi kegiatan pengembangan usaha mikro, kecil, dan menengah",
        caption: "Kegiatan pengembangan masyarakat melalui UMKM",
    },
    {
        image: "/images/anjungan.webp",
        alt: "Anjungan di wilayah kerja hulu minyak dan gas bumi",
        caption: "Anjungan di wilayah kerja hulu migas",
    },
];

export default function Pengelola() {
    const reduceMotion = useReducedMotion();
    const [activeSlide, setActiveSlide] = useState(0);

    const currentSlide = slides[activeSlide];

    const handlePrevious = () => {
        setActiveSlide((current) =>
            current === 0 ? slides.length - 1 : current - 1
        );
    };

    const handleNext = () => {
        setActiveSlide((current) =>
            current === slides.length - 1 ? 0 : current + 1
        );
    };

    return (
        <section
            id="pengelola"
            aria-labelledby="pengelola-title"
            className="relative isolate overflow-hidden bg-white scroll-mt-15 px-6 py-14 sm:px-10 sm:py-16 lg:px-16 lg:py-20"
        >
            <div className="mx-auto w-full max-w-7xl">
                {/* WRAPPER CARD DAN OUTLINE */}
                <motion.div
                    initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                    whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.55, ease: "easeOut" }}
                    className="relative mr-1 mb-1 sm:mr-1.5 sm:mb-1.5"
                >
                    {/* OUTLINE HITAM TIPIS DI BELAKANG CARD */}
                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 translate-x-1 translate-y-1 rounded-2xl border border-black bg-black sm:translate-x-1.5 sm:translate-y-1.5"
                    />

                    {/* CARD UTAMA */}
                    <div className="relative isolate grid min-h-[300px] overflow-hidden rounded-2xl border border-black bg-[#f5f2ec] shadow-[0_3px_8px_rgba(0,0,0,0.04)] sm:min-h-[330px] md:grid-cols-[1.05fr_0.95fr] lg:min-h-[360px]">
                        {/* KIRI: INFORMASI PENGELOLA */}
                        <div className="relative z-10 flex flex-col items-start justify-center px-6 py-7 sm:px-8 sm:py-9 lg:px-12 lg:py-10">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-red-600 sm:text-[11px]">
                                Pengelola
                            </p>

                            <h2
                                id="pengelola-title"
                                className="mt-4 text-2xl font-bold leading-tight tracking-[-0.04em] text-slate-900 sm:mt-5 sm:text-2xl lg:text-3xl"
                            >
                                SKK Migas
                            </h2>

                            <p className="mt-3 max-w-lg text-xs leading-6 text-slate-700 sm:text-sm sm:leading-7">
                                Digital LFA dikelola oleh SKK Migas, lembaga
                                yang dibentuk Pemerintah Republik Indonesia
                                untuk melaksanakan pengelolaan kegiatan usaha
                                hulu minyak dan gas bumi berdasarkan Kontrak
                                Kerja Sama.
                            </p>

                            {/* NAVIGASI CAROUSEL */}
                            <div className="mt-6 flex items-center gap-3 sm:mt-7">
                                <button
                                    type="button"
                                    onClick={handlePrevious}
                                    aria-label="Foto sebelumnya"
                                    className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition-colors hover:bg-red-600 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2"
                                >
                                    <ArrowLeft size={14} />
                                </button>

                                <span
                                    className="min-w-[32px] text-center text-[10px] font-semibold tabular-nums text-slate-600"
                                    aria-live="polite"
                                >
                                    {activeSlide + 1}/{slides.length}
                                </span>

                                <button
                                    type="button"
                                    onClick={handleNext}
                                    aria-label="Foto berikutnya"
                                    className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition-colors hover:bg-red-600 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2"
                                >
                                    <ArrowRight size={14} />
                                </button>
                            </div>
                        </div>

                        {/* KANAN: FOTO CAROUSEL */}
                        <div className="relative min-h-[230px] overflow-hidden sm:min-h-[280px] md:min-h-full">
                            <AnimatePresence mode="wait" initial={false}>
                                <motion.figure
                                    key={currentSlide.image}
                                    initial={
                                        reduceMotion
                                            ? false
                                            : { opacity: 0, x: 12 }
                                    }
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={
                                        reduceMotion
                                            ? undefined
                                            : { opacity: 0, x: -12 }
                                    }
                                    transition={{
                                        duration: reduceMotion ? 0 : 0.3,
                                        ease: "easeOut",
                                    }}
                                    className="absolute inset-0"
                                >
                                    <Image
                                        src={currentSlide.image}
                                        alt={currentSlide.alt}
                                        fill
                                        priority={activeSlide === 0}
                                        sizes="(max-width: 767px) 100vw, (max-width: 1023px) 45vw, 560px"
                                        className="object-cover object-center"
                                    />

                                    <figcaption className="absolute bottom-3 right-4 z-10 max-w-[85%] rounded-md bg-white/80 px-2.5 py-1.5 text-right text-[9px] leading-4 text-slate-600 sm:bottom-4 sm:right-5 sm:text-[10px]">
                                        {currentSlide.caption}
                                    </figcaption>
                                </motion.figure>
                            </AnimatePresence>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}