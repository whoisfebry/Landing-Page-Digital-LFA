"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
    ShieldCheck,
    Building2,
    ClipboardList,
} from "lucide-react";

const audiences = [
    {
        number: "01",
        icon: ShieldCheck,
        title: "SKK Migas",
        description:
            "Memeriksa, menyetujui, dan memantau pelaksanaan program di seluruh wilayah kerja.",
    },
    {
        number: "02",
        icon: Building2,
        title: "Kontraktor Kontrak Kerja Sama",
        description:
            "Menyusun rencana, menjalankan program di lapangan, dan melaporkan capaiannya.",
    },
    {
        number: "03",
        icon: ClipboardList,
        title: "Pengelolaan Program",
        description:
            "Mendukung pencatatan, pemantauan, dan pengelolaan informasi program agar pelaksanaannya lebih terstruktur.",
    },
];

export default function Untuksiapa() {
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
            id="untuk-siapa"
            aria-labelledby="untuk-siapa-title"
            className="relative isolate overflow-hidden bg-slate-100 px-5 py-10 sm:px-8 sm:py-12 lg:py-14"
        >
            <div className="mx-auto w-full max-w-6xl">
                {/* Judul dan deskripsi */}
                <motion.div
                    {...reveal(0)}
                    className="mx-auto max-w-3xl text-center"
                >
                    <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-red-600 sm:text-[11px]">
                        Untuk Siapa
                    </p>

                    <h2
                        id="untuk-siapa-title"
                        className="mx-auto mt-4 max-w-3xl text-[clamp(0.875rem,1.2vw,1.1rem)] font-medium leading-[1.65] tracking-[-0.02em] text-slate-700"
                    >
                        Digital LFA digunakan bersama oleh SKK Migas sebagai
                        pengawas dan Kontraktor Kontrak Kerja Sama sebagai
                        pelaksana di lapangan.
                    </h2>
                </motion.div>

                {/* Kartu pengguna dan fungsi pendukung */}
                <div className="mx-auto mt-7 grid w-full max-w-5xl grid-cols-1 gap-4 sm:mt-8 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
                    {audiences.map((audience, index) => {
                        const Icon = audience.icon;

                        return (
                            <motion.article
                                key={audience.number}
                                {...reveal(0.1 + index * 0.12)}
                                className="group flex min-h-[175px] flex-col rounded-xl border border-slate-200 bg-white p-5 transition-colors duration-300 hover:border-red-500 sm:min-h-[190px] sm:p-6"
                            >
                                {/* Ikon dan nomor */}
                                <div className="flex items-center justify-between">
                                    <span
                                        aria-hidden="true"
                                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition-colors duration-300 group-hover:border-red-600 group-hover:bg-red-600 group-hover:text-white"
                                    >
                                        <Icon
                                            size={18}
                                            strokeWidth={1.8}
                                        />
                                    </span>

                                    <span className="text-[10px] font-medium tracking-[0.12em] text-slate-300 transition-colors duration-300 group-hover:text-red-600">
                                        {audience.number}
                                    </span>
                                </div>

                                {/* Isi kartu */}
                                <h3 className="mt-4 text-sm font-bold leading-6 tracking-[-0.02em] text-slate-800 sm:text-[15px]">
                                    {audience.title}
                                </h3>

                                <p className="mt-2 text-xs leading-6 text-slate-500 sm:text-[13px]">
                                    {audience.description}
                                </p>
                            </motion.article>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}