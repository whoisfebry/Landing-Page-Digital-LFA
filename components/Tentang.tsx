"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

function IndonesiaDotMap() {
    const markers = [
        { x: 12, y: 38, name: "Sumatera Utara", delay: 0.1 },
        { x: 18, y: 57, name: "Sumatera Selatan", delay: 0.16 },
        { x: 30, y: 72, name: "Jawa Barat", delay: 0.22 },
        { x: 39, y: 75, name: "Jawa Timur", delay: 0.28 },
        { x: 45, y: 43, name: "Kalimantan", delay: 0.34 },
        { x: 58, y: 53, name: "Sulawesi", delay: 0.4 },
        { x: 67, y: 70, name: "Nusa Tenggara", delay: 0.46 },
        { x: 75, y: 48, name: "Maluku", delay: 0.52 },
        { x: 88, y: 43, name: "Papua Barat", delay: 0.58 },
        { x: 94, y: 48, name: "Papua", delay: 0.64 },
    ];

    const reduceMotion = useReducedMotion();
    const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

    return (
        <motion.div
            className="relative w-full"
            role="group"
            aria-label="Peta Indonesia dengan titik penanda wilayah kerja"
            initial={reduceMotion ? false : { opacity: 0, scale: 0.96, y: 18 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
        >
            <img
                src="https://commons.wikimedia.org/wiki/Special:FilePath/Indonesia_Blankmap.svg"
                alt="Peta Indonesia"
                draggable={false}
                className="block h-auto w-full select-none opacity-65"
                style={{
                    filter:
                        "brightness(0) saturate(100%) invert(67%) sepia(8%) saturate(390%) hue-rotate(172deg) brightness(91%) contrast(86%)",
                }}
            />

            <div className="absolute inset-0">
                {markers.map(({ x, y, name }) => {
                    const isSelected = selectedRegion === name;

                    return (
                        <motion.div
                            key={name}
                            className="group absolute -translate-x-1/2 -translate-y-1/2"
                            style={{ left: `${x}%`, top: `${y}%` }}
                        >
                            <span
                                aria-hidden="true"
                                className={`pointer-events-none absolute inset-0 rounded-full ${isSelected && !reduceMotion
                                    ? "animate-[ripple_1.8s_ease-out_infinite]"
                                    : "opacity-0"
                                    }`}
                                style={{
                                    backgroundColor: "rgba(220,38,38,0.35)",
                                }}
                            />

                            <span
                                aria-hidden="true"
                                className={`pointer-events-none absolute inset-0 rounded-full ${isSelected && !reduceMotion
                                    ? "animate-[ripple_1.8s_ease-out_0.6s_infinite]"
                                    : "opacity-0"
                                    }`}
                                style={{
                                    backgroundColor: "rgba(220,38,38,0.25)",
                                }}
                            />

                            <motion.button
                                type="button"
                                aria-label={`Pilih wilayah: ${name}`}
                                aria-pressed={isSelected}
                                title={name}
                                onClick={() =>
                                    setSelectedRegion(isSelected ? null : name)
                                }
                                whileHover={
                                    reduceMotion ? undefined : { scale: 1.15 }
                                }
                                whileTap={
                                    reduceMotion ? undefined : { scale: 0.95 }
                                }
                                animate={{
                                    backgroundColor: "#dc2626",
                                    boxShadow: isSelected
                                        ? "0 0 0 3px rgba(220,38,38,0.2), 0 0 8px 2px rgba(220,38,38,0.35)"
                                        : "0 0 0 3px rgba(220,38,38,0.14)",
                                    scale: isSelected ? 1.05 : 1,
                                }}
                                transition={{
                                    duration: reduceMotion ? 0 : 0.2,
                                    ease: "easeOut",
                                }}
                                className="relative z-[1] block h-3 w-3 cursor-pointer rounded-full border-2 border-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2 sm:h-3.5 sm:w-3.5"
                            />

                            <span
                                role="tooltip"
                                className={`pointer-events-none absolute bottom-[calc(100%+10px)] left-1/2 z-20 w-max max-w-40 -translate-x-1/2 rounded-lg bg-slate-900 px-3 py-2 text-xs font-medium text-white shadow-lg transition duration-150 ${isSelected
                                    ? "opacity-100"
                                    : "opacity-0 group-hover:opacity-100 group-focus-within:opacity-100"
                                    }`}
                            >
                                {name}
                                <span
                                    aria-hidden="true"
                                    className="absolute left-1/2 top-full -translate-x-1/2 border-[5px] border-transparent border-t-slate-900"
                                />
                            </span>
                        </motion.div>
                    );
                })}
            </div>

            <style jsx>{`
                @keyframes ripple {
                    0% {
                        transform: scale(1);
                        opacity: 0.65;
                    }
                    100% {
                        transform: scale(3.5);
                        opacity: 0;
                    }
                }
            `}</style>
        </motion.div>
    );
}

const lfaStages = [
    {
        number: "01",
        title: "Rencana",
        description:
            "KKKS menyusun tujuan, kegiatan, anggaran, dan indikator keberhasilan.",
    },
    {
        number: "02",
        title: "Persetujuan",
        description:
            "SKK Migas memeriksa isian lalu menyetujui atau mengembalikannya untuk diperbaiki.",
    },
    {
        number: "03",
        title: "Pelaksanaan",
        description:
            "Program dijalankan di lapangan, realisasi dan buktinya dilaporkan per periode.",
    },
    {
        number: "04",
        title: "Hasil",
        description:
            "Capaian dibandingkan dengan target yang ditetapkan sejak awal.",
    },
];

export default function Tentang() {
    const reduceMotion = useReducedMotion();
    const [activeStage, setActiveStage] = useState(0);
    const [isStageFourCompleted, setIsStageFourCompleted] = useState(false);

    const handleStageChange = (index: number) => {
        setActiveStage(index);
        setIsStageFourCompleted(false);
    };

    const reveal = (delay = 0) =>
        reduceMotion
            ? {}
            : {
                initial: { opacity: 0, y: 18 },
                whileInView: { opacity: 1, y: 0 },
                viewport: { once: true, amount: 0.2 },
                transition: {
                    duration: 0.6,
                    delay,
                    ease: "easeOut" as const,
                },
            };

    return (
        <main className="relative isolate overflow-hidden bg-white">
            {/* BAGIAN 1: TENTANG DIGITAL LFA */}
            <section
                id="tentang"
                aria-labelledby="tentang-title"
                className="relative bg-white px-6 pt-16 pb-16 sm:px-10 sm:pt-20 sm:pb-20 lg:px-16 lg:pt-24 lg:pb-24"
            >
                <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-8 sm:gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-10 xl:grid-cols-[0.9fr_1.1fr] xl:gap-12">
                    <motion.div
                        {...reveal(0)}
                        className="flex flex-col items-start"
                    >
                        <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-red-600 sm:text-[11px]">
                            Tentang
                        </span>

                        <h1
                            id="tentang-title"
                            className="mt-5 max-w-[520px] text-xl font-bold leading-[1.25] tracking-[-0.03em] text-slate-900 sm:text-2xl lg:text-[clamp(1.6rem,2vw,2rem)]"
                        >
                            Satu kerangka yang sama untuk seluruh wilayah kerja.
                        </h1>

                        <p className="mt-4 max-w-[500px] text-sm leading-7 text-slate-600 sm:text-[15px] sm:leading-8">
                            Perusahaan yang mengelola wilayah kerja hulu
                            minyak dan gas bumi menjalankan Program
                            Pengembangan Masyarakat di daerah sekitar
                            operasinya. Digital LFA menyatukan rencana dan
                            laporannya, sehingga apa yang dijanjikan dan apa
                            yang terjadi di lapangan dapat ditelusuri kembali.
                        </p>
                    </motion.div>

                    <motion.div
                        {...reveal(0.18)}
                        className="relative mx-auto w-full max-w-[560px] lg:ml-auto"
                    >
                        <IndonesiaDotMap />

                        <p className="mt-1 text-center text-[10px] font-medium uppercase tracking-[0.18em] text-slate-400 lg:text-right">
                            Satu standar · Berbagai wilayah kerja
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* BAGIAN 2: BAGAIMANA LFA BEKERJA */}
            <section
                aria-labelledby="alur-lfa-title"
                className="relative bg-slate-100 px-6 py-16 sm:px-10 sm:py-20 lg:px-16 lg:py-18"
            >
                <div className="mx-auto w-full max-w-7xl">
                    <motion.div
                        {...reveal(0)}
                        className="rounded-2xl border border-slate-200 bg-white px-4 py-7 shadow-[0_12px_40px_rgba(15,23,42,0.04)] sm:px-8 sm:py-10 lg:px-10 lg:py-10"
                    >
                        <div className="mx-auto max-w-2xl text-center">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-red-600 sm:text-[11px]">
                                Bagaimana LFA Bekerja
                            </p>

                            <h2
                                id="alur-lfa-title"
                                className="mt-4 text-2xl font-bold leading-tight tracking-[-0.035em] text-slate-900 sm:text-3xl"
                            >
                                Empat tahap yang sama untuk setiap program.
                            </h2>

                            <p className="mx-auto mt-3 max-w-xl text-xs leading-6 text-slate-500 sm:text-sm sm:leading-7">
                                Kerangka ini dipakai sejak rencana disusun
                                sampai hasilnya dilaporkan, sehingga setiap
                                tahap bisa ditelusuri kembali.
                            </p>
                        </div>

                        {/* TIMELINE INTERAKTIF */}
                        <div className="relative mt-9 sm:mt-12">
                            <div
                                aria-hidden="true"
                                className="absolute left-[12.5%] right-[12.5%] top-[5px] hidden h-[2px] rounded-full bg-slate-200 md:block"
                            />

                            <motion.div
                                aria-hidden="true"
                                className="absolute left-[12.5%] top-[5px] hidden h-[2px] rounded-full bg-red-600 md:block"
                                initial={false}
                                animate={{
                                    width: `${(activeStage / 3) * 75}%`,
                                }}
                                transition={
                                    reduceMotion
                                        ? { duration: 0 }
                                        : {
                                            type: "spring",
                                            stiffness: 160,
                                            damping: 24,
                                        }
                                }
                            />

                            <div
                                aria-hidden="true"
                                className="absolute bottom-6 left-[5px] top-[5px] w-[2px] rounded-full bg-slate-200 md:hidden"
                            />

                            <motion.div
                                aria-hidden="true"
                                className="absolute left-[5px] top-[5px] w-[2px] rounded-full bg-red-600 md:hidden"
                                initial={false}
                                animate={{
                                    height: `${(activeStage / 3) * 100}%`,
                                }}
                                transition={
                                    reduceMotion
                                        ? { duration: 0 }
                                        : {
                                            type: "spring",
                                            stiffness: 160,
                                            damping: 24,
                                        }
                                }
                            />

                            <div className="grid grid-cols-1 gap-4 pb-3 md:grid-cols-4 md:gap-3 md:pb-5 lg:gap-4 lg:pb-6">
                                {lfaStages.map((stage, index) => {
                                    const isActive = activeStage === index;
                                    const isReached = index <= activeStage;
                                    const isStageFour = index === 3;
                                    const isCompleted =
                                        isStageFour && isStageFourCompleted;

                                    const isFirstStageCompleted =
                                        index === 0 && activeStage > 0;

                                    const isPreviousStageCompleted =
                                        (index === 1 || index === 2) &&
                                        activeStage > index;

                                    const showGreenCheck =
                                        isFirstStageCompleted ||
                                        isPreviousStageCompleted ||
                                        isCompleted;

                                    return (
                                        <motion.div
                                            key={stage.number}
                                            {...reveal(index * 0.08)}
                                            className="relative min-w-0"
                                        >
                                            {/* TITIK TIMELINE */}
                                            <div className="relative z-10 mb-2 flex items-center gap-3 md:mb-4 md:justify-center">
                                                <span className="relative block h-[11px] w-[11px] shrink-0">
                                                    <span
                                                        aria-hidden="true"
                                                        className={`pointer-events-none absolute inset-0 rounded-full ${isActive && !reduceMotion
                                                            ? "animate-[ripple_1.8s_ease-out_infinite]"
                                                            : "opacity-0"
                                                            }`}
                                                        style={{
                                                            backgroundColor:
                                                                "rgba(220,38,38,0.35)",
                                                        }}
                                                    />

                                                    <span
                                                        aria-hidden="true"
                                                        className={`pointer-events-none absolute inset-0 rounded-full ${isActive && !reduceMotion
                                                            ? "animate-[ripple_1.8s_ease-out_0.6s_infinite]"
                                                            : "opacity-0"
                                                            }`}
                                                        style={{
                                                            backgroundColor:
                                                                "rgba(220,38,38,0.25)",
                                                        }}
                                                    />

                                                    <motion.span
                                                        aria-hidden="true"
                                                        animate={{
                                                            backgroundColor: isReached
                                                                ? "#dc2626"
                                                                : "#253247",
                                                            boxShadow: isActive
                                                                ? "0 0 0 2px rgba(220,38,38,0.2), 0 0 6px 1px rgba(220,38,38,0.3)"
                                                                : isReached
                                                                    ? "0 0 0 2px rgba(220,38,38,0.10)"
                                                                    : "0 0 0 2px rgba(148,163,184,0.12)",
                                                        }}
                                                        transition={{
                                                            duration: reduceMotion
                                                                ? 0
                                                                : 0.2,
                                                            ease: "easeOut",
                                                        }}
                                                        className="relative z-[1] block h-full w-full rounded-full border-2 border-white"
                                                    />
                                                </span>

                                                <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-slate-400 md:hidden">
                                                    Tahap {stage.number}
                                                </span>
                                            </div>

                                            {/* KARTU TAHAP */}
                                            <div
                                                className={`group relative ml-6 flex min-h-[155px] w-[calc(100%-1.5rem)] flex-col rounded-xl border bg-white p-4 transition-colors duration-300 sm:min-h-[170px] sm:p-5 md:ml-0 md:min-h-[205px] md:w-full md:p-4 lg:min-h-[190px] lg:p-5 ${isActive
                                                    ? "border-red-200"
                                                    : "border-slate-200 hover:border-red-200"
                                                    }`}
                                            >
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleStageChange(index)
                                                    }
                                                    aria-pressed={isActive}
                                                    aria-label={`Pilih tahap ${stage.number}: ${stage.title}`}
                                                    className="flex w-full flex-1 cursor-pointer flex-col text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2"
                                                >
                                                    <div className="flex w-full items-start justify-between gap-2">
                                                        <span
                                                            className={`text-2xl font-bold leading-none tracking-[-0.045em] transition-colors duration-300 sm:text-3xl md:text-4xl ${isReached
                                                                ? "text-red-600"
                                                                : "text-slate-300 group-hover:text-red-600"
                                                                }`}
                                                        >
                                                            {stage.number}
                                                        </span>

                                                        {/* IKON TAHAP */}
                                                        <span
                                                            aria-hidden="true"
                                                            className={`mt-0.5 flex h-5 w-5 items-center justify-center rounded-full text-[10px] transition-colors duration-300 sm:h-6 sm:w-6 sm:text-xs ${showGreenCheck
                                                                ? "bg-emerald-600 text-white"
                                                                : "bg-slate-100 text-slate-400"
                                                                }`}
                                                        >
                                                            {showGreenCheck
                                                                ? "✓"
                                                                : "↗"}
                                                        </span>
                                                    </div>

                                                    <h3
                                                        className={`mt-3 text-[13px] font-bold tracking-tight sm:mt-4 sm:text-sm md:text-base ${isReached
                                                            ? "text-slate-900"
                                                            : "text-slate-700"
                                                            }`}
                                                    >
                                                        {stage.title}
                                                    </h3>

                                                    <p className="mt-1.5 text-[10px] leading-[1.75] text-slate-500 sm:mt-2 sm:text-[11px] md:text-xs">
                                                        {stage.description}
                                                    </p>
                                                </button>

                                                {/* STATUS DAN TOMBOL SELESAI */}
                                                <div className="mt-auto flex items-center justify-between gap-2 pt-3 sm:pt-4">
                                                    <span
                                                        className={`text-[9px] font-semibold uppercase tracking-[0.1em] sm:text-[10px] sm:tracking-[0.12em] ${isCompleted
                                                            ? "text-emerald-600"
                                                            : isActive
                                                                ? "text-red-600"
                                                                : isReached
                                                                    ? "text-emerald-600"
                                                                    : "text-slate-400"
                                                            }`}
                                                    >
                                                        {isCompleted
                                                            ? "Tahap selesai"
                                                            : isActive
                                                                ? "Tahap aktif"
                                                                : isReached
                                                                    ? "Tahap tercapai"
                                                                    : "Belum tercapai"}
                                                    </span>

                                                    {isStageFour &&
                                                        isActive &&
                                                        !isCompleted && (
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    setIsStageFourCompleted(
                                                                        true
                                                                    )
                                                                }
                                                                className="shrink-0 cursor-pointer rounded-md bg-red-600 px-3 py-1.5 text-[9px] font-semibold text-white transition-colors hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2 sm:text-[10px]"
                                                            >
                                                                Selesai
                                                            </button>
                                                        )}
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ANIMASI GELOMBANG */}
            <style jsx>{`
                @keyframes ripple {
                    0% {
                        transform: scale(1);
                        opacity: 0.65;
                    }
                    100% {
                        transform: scale(3.5);
                        opacity: 0;
                    }
                }
            `}</style>
        </main>
    );
}