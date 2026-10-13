
"use client";

import { motion, useReducedMotion } from "framer-motion";
import FoldText from "@/components/FoldText";

const tujuanItems = [
    {
        number: "01",
        title: "Tata Kelola PPM",
        description:
            "Setiap usulan melewati pemeriksaan dan persetujuan yang jelas, dengan jejak perubahan tersimpan.",
    },
    {
        number: "02",
        title: "Pelaporan Berbasis LFA",
        description:
            "Tujuan, keluaran, kegiatan, dan indikator ditetapkan sejak awal, bukan disusun belakangan.",
    },
];

export default function Tujuan() {
    const reduceMotion = useReducedMotion();

    const reveal = (delay = 0) =>
        reduceMotion
            ? {}
            : {
                initial: { opacity: 0, y: 16 },
                whileInView: { opacity: 1, y: 0 },
                viewport: { once: true, amount: 0.2 },
                transition: {
                    duration: 0.55,
                    delay,
                    ease: "easeOut" as const,
                },
            };

    return (
        <section
            id="tujuan"
            aria-labelledby="tujuan-title"
            className="relative isolate overflow-hidden scroll-mt-15 bg-white px-6 py-16 sm:px-10 sm:py-20 lg:px-16 lg:py-24"
        >
            <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-10 sm:gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:gap-20">
                {/* Kolom kiri: tujuan utama */}
                <motion.div
                    {...reveal(0)}
                    className="flex flex-col items-start"
                >
                    <div className="flex items-center gap-3">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-red-600 sm:text-[11px]">
                            Tujuan
                        </p>
                    </div>

                    <h2
                        id="tujuan-title"
                        className="mt-5 max-w-xl text-[clamp(1.5rem,3vw,2.2rem)] font-bold leading-[1.25] tracking-[-0.04em] text-slate-900"
                    >
                        <FoldText
                            text="Agar program dapat diperiksa,"
                            splitBy="word"
                            hinge="top"
                            trigger={reduceMotion ? "mount" : "scroll"}
                            duration={0.65}
                            stagger={0.07}
                            ease="power3.out"
                            perspective={700}
                            creaseShading={0.4}
                            fontSize="inherit"
                            fontWeight="inherit"
                            color="inherit"
                            style={{
                                lineHeight: "inherit",
                                letterSpacing: "inherit",
                            }}
                        />
                        {" "}
                        <FoldText
                            text="bukan hanya dilaporkan."
                            splitBy="word"
                            hinge="top"
                            trigger={reduceMotion ? "mount" : "scroll"}
                            duration={1.1}
                            stagger={0.1}
                            ease="power3.out"
                            perspective={900}
                            creaseShading={0.25}
                            fontSize="inherit"
                            fontWeight="inherit"
                            color="#dc2626"
                            style={{
                                lineHeight: "inherit",
                                letterSpacing: "inherit",
                            }}
                        />
                    </h2>

                    <p className="mt-5 max-w-lg text-sm leading-7 text-slate-600 sm:text-[15px] sm:leading-8">
                        Rencana dan realisasi tercatat dengan struktur
                        seragam, sehingga dapat diperiksa dan
                        dipertanggungjawabkan.
                    </p>
                </motion.div>

                {/* Kolom kanan: dua sasaran */}
                <div className="flex flex-col">
                    {tujuanItems.map((item, index) => (
                        <motion.article
                            key={item.number}
                            {...reveal(0.12 + index * 0.12)}
                            className={`group relative py-6 sm:py-7 ${index === 0
                                    ? "border-b border-slate-200"
                                    : ""
                                }`}
                        >
                            <div className="flex items-start gap-4 sm:gap-6">
                                {/* Nomor */}
                                <span className="pt-0.5 text-xs font-semibold tracking-[0.08em] text-red-600 sm:text-sm">
                                    {item.number}
                                </span>

                                <div className="min-w-0 flex-1">
                                    <h3 className="text-base font-bold tracking-[-0.025em] text-slate-900 transition-colors duration-200 group-hover:text-red-600 sm:text-lg">
                                        {item.title}
                                    </h3>

                                    <p className="mt-2 max-w-xl text-xs leading-6 text-slate-500 sm:text-sm sm:leading-7">
                                        {item.description}
                                    </p>
                                </div>
                            </div>
                        </motion.article>
                    ))}
                </div>
            </div>
        </section>
    );
}
