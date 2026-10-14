"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

type SelectedRegion = {
    name: string;
    x: number;
    y: number;
};

// Normalisasi nama provinsi dari SVG ke bahasa Indonesia.
const provinceNames: Record<string, string> = {
    "Aceh": "Aceh",
    "Nanggroe Aceh Darussalam": "Aceh",
    "North Sumatra": "Sumatera Utara",
    "Sumatera Utara": "Sumatera Utara",
    "West Sumatra": "Sumatera Barat",
    "Sumatera Barat": "Sumatera Barat",
    "Riau": "Riau",
    "Riau Islands": "Kepulauan Riau",
    "Kepulauan Riau": "Kepulauan Riau",
    "Jambi": "Jambi",
    "South Sumatra": "Sumatera Selatan",
    "Sumatera Selatan": "Sumatera Selatan",
    "Bengkulu": "Bengkulu",
    "Lampung": "Lampung",
    "Bangka Belitung": "Kepulauan Bangka Belitung",
    "Bangka-Belitung": "Kepulauan Bangka Belitung",
    "Bangka Belitung Islands": "Kepulauan Bangka Belitung",
    "Kepulauan Bangka Belitung": "Kepulauan Bangka Belitung",
    "Jakarta": "DKI Jakarta",
    "Jakarta Raya": "DKI Jakarta",
    "DKI Jakarta": "DKI Jakarta",
    "Special Capital Region of Jakarta": "DKI Jakarta",
    "Banten": "Banten",
    "West Java": "Jawa Barat",
    "Jawa Barat": "Jawa Barat",
    "Central Java": "Jawa Tengah",
    "Jawa Tengah": "Jawa Tengah",
    "Yogyakarta": "DI Yogyakarta",
    "Special Region of Yogyakarta": "DI Yogyakarta",
    "Daerah Istimewa Yogyakarta": "DI Yogyakarta",
    "East Java": "Jawa Timur",
    "Jawa Timur": "Jawa Timur",
    "West Kalimantan": "Kalimantan Barat",
    "Kalimantan Barat": "Kalimantan Barat",
    "Central Kalimantan": "Kalimantan Tengah",
    "Kalimantan Tengah": "Kalimantan Tengah",
    "South Kalimantan": "Kalimantan Selatan",
    "Kalimantan Selatan": "Kalimantan Selatan",
    "East Kalimantan": "Kalimantan Timur",
    "Kalimantan Timur": "Kalimantan Timur",
    "North Kalimantan": "Kalimantan Utara",
    "North Kalimantan Province": "Kalimantan Utara",
    "Kalimantan Utara": "Kalimantan Utara",
    "Bali": "Bali",
    "West Nusa Tenggara": "Nusa Tenggara Barat",
    "Nusa Tenggara Barat": "Nusa Tenggara Barat",
    "East Nusa Tenggara": "Nusa Tenggara Timur",
    "Nusa Tenggara Timur": "Nusa Tenggara Timur",
    "West Sulawesi": "Sulawesi Barat",
    "Sulawesi Barat": "Sulawesi Barat",
    "North Sulawesi": "Sulawesi Utara",
    "Sulawesi Utara": "Sulawesi Utara",
    "Central Sulawesi": "Sulawesi Tengah",
    "Sulawesi Tengah": "Sulawesi Tengah",
    "South Sulawesi": "Sulawesi Selatan",
    "Sulawesi Selatan": "Sulawesi Selatan",
    "Southeast Sulawesi": "Sulawesi Tenggara",
    "Sulawesi Tenggara": "Sulawesi Tenggara",
    "Gorontalo": "Gorontalo",
    "Maluku": "Maluku",
    "North Maluku": "Maluku Utara",
    "Maluku Utara": "Maluku Utara",
    "Papua": "Papua",
    "West Papua": "Papua Barat",
    "Papua Barat": "Papua Barat",
    "Southwest Papua": "Papua Barat Daya",
    "Papua Barat Daya": "Papua Barat Daya",
    "Central Papua": "Papua Tengah",
    "Papua Tengah": "Papua Tengah",
    "Highland Papua": "Papua Pegunungan",
    "Papua Pegunungan": "Papua Pegunungan",
    "South Papua": "Papua Selatan",
    "Papua Selatan": "Papua Selatan",
};

function normalizeProvinceName(rawName: string): string {
    const cleanedName = rawName
        .trim()
        .replace(/[_-]+/g, " ")
        .replace(/\s+/g, " ");

    if (provinceNames[cleanedName]) {
        return provinceNames[cleanedName];
    }

    const matchingKey = Object.keys(provinceNames).find(
        (key) => key.toLowerCase() === cleanedName.toLowerCase()
    );

    return matchingKey
        ? provinceNames[matchingKey]
        : cleanedName;
}

function IndonesiaDotMap() {
    const reduceMotion = useReducedMotion();
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const [svgMarkup, setSvgMarkup] = useState("");
    const [selectedRegion, setSelectedRegion] =
        useState<SelectedRegion | null>(null);
    const [mapError, setMapError] = useState(false);

    useEffect(() => {
        let cancelled = false;

        async function loadMap() {
            try {
                const response = await fetch("/maps/indonesia.svg");

                if (!response.ok) {
                    throw new Error("File peta tidak ditemukan.");
                }

                const svgText = await response.text();
                const parser = new DOMParser();
                const parsedDocument = parser.parseFromString(
                    svgText,
                    "image/svg+xml"
                );

                if (
                    parsedDocument.querySelector("parsererror") ||
                    parsedDocument.documentElement.tagName.toLowerCase() !==
                        "svg"
                ) {
                    throw new Error("Format SVG tidak valid.");
                }

                parsedDocument
                    .querySelectorAll("script, foreignObject")
                    .forEach((element) => element.remove());

                const svg = parsedDocument.documentElement;

                svg.setAttribute("width", "100%");
                svg.setAttribute("height", "100%");
                svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
                svg.style.display = "block";
                svg.style.width = "100%";
                svg.style.maxWidth = "100%";
                svg.style.height = "auto";

                parsedDocument
                    .querySelectorAll("path, polygon")
                    .forEach((element) => {
                        element.setAttribute("fill", "#e2e8f0");
                        element.setAttribute("stroke", "#ffffff");
                        element.setAttribute("stroke-width", "0.7");
                        element.setAttribute(
                            "vector-effect",
                            "non-scaling-stroke"
                        );
                        element.setAttribute("tabindex", "0");
                        element.setAttribute("role", "button");
                        element.setAttribute("cursor", "pointer");
                        element.classList.add("province-region");
                    });

                if (!cancelled) {
                    setSvgMarkup(
                        new XMLSerializer().serializeToString(svg)
                    );
                    setMapError(false);
                }
            } catch (error) {
                console.error("Gagal memuat peta Indonesia:", error);

                if (!cancelled) {
                    setMapError(true);
                }
            }
        }

        loadMap();

        return () => {
            cancelled = true;
        };
    }, []);

    useEffect(() => {
        const container = mapContainerRef.current;

        if (!container || !svgMarkup) return;

        const regions = Array.from(
            container.querySelectorAll<SVGElement>(".province-region")
        );

        const getRegionName = (element: SVGElement) => {
            const candidates = [
                element.getAttribute("data-name"),
                element.getAttribute("name"),
                element.getAttribute("aria-label"),
                element.getAttribute("title"),
                element.getAttribute("id"),
            ];

            const rawName =
                candidates.find(
                    (value) => value && value.trim().length > 0
                )?.trim() ?? "Wilayah Indonesia";

            return normalizeProvinceName(rawName);
        };

        const updateRegion = (
            element: SVGElement,
            selected: boolean
        ) => {
            element.style.fill = selected ? "#dc2626" : "#e2e8f0";
            element.style.stroke = selected ? "#991b1b" : "#ffffff";
            element.style.strokeWidth = selected ? "1.2" : "0.7";
        };

        const handleEnter = (event: Event) => {
            const element = event.currentTarget as SVGElement;

            if (selectedRegion?.name !== getRegionName(element)) {
                element.style.fill = "#fca5a5";
            }
        };

        const handleLeave = (event: Event) => {
            const element = event.currentTarget as SVGElement;

            updateRegion(
                element,
                selectedRegion?.name === getRegionName(element)
            );
        };

        const handleClick = (event: Event) => {
            const element = event.currentTarget as SVGElement;
            const mouseEvent = event as MouseEvent;
            const name = getRegionName(element);
            const rect = container.getBoundingClientRect();

            if (selectedRegion?.name === name) {
                setSelectedRegion(null);
                return;
            }

            const x =
                ((mouseEvent.clientX - rect.left) / rect.width) * 100;
            const y =
                ((mouseEvent.clientY - rect.top) / rect.height) * 100;

            setSelectedRegion({
                name,
                x: Math.max(8, Math.min(92, x)),
                y: Math.max(8, Math.min(92, y)),
            });
        };

        const handleKeyDown = (event: Event) => {
            const keyboardEvent = event as KeyboardEvent;

            if (
                keyboardEvent.key === "Enter" ||
                keyboardEvent.key === " "
            ) {
                keyboardEvent.preventDefault();
                handleClick(event);
            }
        };

        regions.forEach((element) => {
            element.style.transition = reduceMotion
                ? "none"
                : "fill 180ms ease, stroke 180ms ease";

            element.addEventListener("mouseenter", handleEnter);
            element.addEventListener("mouseleave", handleLeave);
            element.addEventListener("click", handleClick);
            element.addEventListener("keydown", handleKeyDown);

            updateRegion(
                element,
                selectedRegion?.name === getRegionName(element)
            );
        });

        return () => {
            regions.forEach((element) => {
                element.removeEventListener("mouseenter", handleEnter);
                element.removeEventListener("mouseleave", handleLeave);
                element.removeEventListener("click", handleClick);
                element.removeEventListener("keydown", handleKeyDown);
            });
        };
    }, [svgMarkup, selectedRegion, reduceMotion]);

    return (
        <motion.div
            className="relative w-full"
            role="group"
            aria-label="Peta Indonesia berdasarkan wilayah"
            initial={reduceMotion ? false : { opacity: 0, y: 18 }}
            whileInView={
                reduceMotion ? undefined : { opacity: 1, y: 0 }
            }
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
        >
            <div
                ref={mapContainerRef}
                className="relative flex min-h-[220px] w-full items-center justify-center sm:min-h-[300px]"
                onClick={(event) => {
                    if (event.target === event.currentTarget) {
                        setSelectedRegion(null);
                    }
                }}
                dangerouslySetInnerHTML={{ __html: svgMarkup }}
            />

            {mapError && (
                <p className="py-8 text-center text-sm text-red-600">
                    Peta tidak dapat dimuat. Pastikan file
                    {" "}public/maps/indonesia.svg tersedia.
                </p>
            )}

            {selectedRegion && (
                <div
                    role="status"
                    className="pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-full whitespace-nowrap"
                    style={{
                        left: `${selectedRegion.x}%`,
                        top: `${selectedRegion.y}%`,
                    }}
                >
                    <span
                        className="text-xs font-bold text-white sm:text-sm"
                        style={{
                            textShadow:
                                "0 1px 3px rgba(15,23,42,0.95), 0 0 5px rgba(15,23,42,0.75)",
                        }}
                    >
                        {selectedRegion.name}
                    </span>
                </div>
            )}
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
            <section
                id="tentang"
                aria-labelledby="tentang-title"
                className="relative scroll-mt-15 bg-white px-6 pt-16 pb-16 sm:px-10 sm:pt-20 sm:pb-20 lg:px-16 lg:pt-24 lg:pb-24"
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
                        className="relative mx-auto -mt-8 w-[115%] max-w-[680px] -translate-x-[6.5%] sm:mt-0 sm:w-full sm:translate-x-0 lg:ml-auto"
                    >
                        <IndonesiaDotMap />

                        <div className="-mt-8 flex items-center justify-end gap-2 pr-6 text-[9px] font-medium text-slate-400 sm:-mt-6 sm:pr-4 sm:text-[10px] lg:-mt-8 lg:pr-8">
                            <span className="h-2.5 w-2.5 shrink-0 rounded-sm bg-slate-200" />
                            <span>Wilayah</span>

                            <span className="ml-2 h-2.5 w-2.5 shrink-0 rounded-sm bg-red-600 sm:ml-3" />
                            <span>Wilayah dipilih</span>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* BAGIAN BAGAIMANA LFA BEKERJA */}
            <section
                aria-labelledby="alur-lfa-title"
                className="relative isolate scroll-mt-15 overflow-hidden bg-white px-0 py-0 sm:scroll-mt-28 lg:scroll-mt-32"
            >
                {/* PANEL ABU-ABU FULL WIDTH DENGAN SUDUT MEMBULAT */}
                <div className="relative w-full overflow-hidden rounded-[28px] bg-slate-100 px-5 py-8 sm:rounded-[36px] sm:px-8 sm:py-10 lg:rounded-[44px] lg:px-12 lg:py-12">
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
                                                <div className="relative z-10 mb-2 flex items-center gap-3 md:mb-4 md:justify-center">
                                                    <span className="relative block h-[11px] w-[11px] shrink-0">
                                                        <span
                                                            aria-hidden="true"
                                                            className={`pointer-events-none absolute inset-0 rounded-full ${
                                                                isActive && !reduceMotion
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
                                                            className={`pointer-events-none absolute inset-0 rounded-full ${
                                                                isActive && !reduceMotion
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

                                                <div
                                                    className={`group relative ml-6 flex min-h-[155px] w-[calc(100%-1.5rem)] flex-col rounded-xl border bg-white p-4 transition-colors duration-300 sm:min-h-[170px] sm:p-5 md:ml-0 md:min-h-[205px] md:w-full md:p-4 lg:min-h-[190px] lg:p-5 ${
                                                        isActive
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
                                                                className={`text-2xl font-bold leading-none tracking-[-0.045em] transition-colors duration-300 sm:text-3xl md:text-4xl ${
                                                                    isReached
                                                                        ? "text-red-600"
                                                                        : "text-slate-300 group-hover:text-red-600"
                                                                }`}
                                                            >
                                                                {stage.number}
                                                            </span>

                                                            <span
                                                                aria-hidden="true"
                                                                className={`mt-0.5 flex h-5 w-5 items-center justify-center rounded-full text-[10px] transition-colors duration-300 sm:h-6 sm:w-6 sm:text-xs ${
                                                                    showGreenCheck
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
                                                            className={`mt-3 text-[13px] font-bold tracking-tight sm:mt-4 sm:text-sm md:text-base ${
                                                                isReached
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

                                                    <div className="mt-auto flex items-center justify-between gap-2 pt-3 sm:pt-4">
                                                        <span
                                                            className={`text-[9px] font-semibold uppercase tracking-[0.1em] sm:text-[10px] sm:tracking-[0.12em] ${
                                                                isCompleted
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
                </div>
            </section>

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