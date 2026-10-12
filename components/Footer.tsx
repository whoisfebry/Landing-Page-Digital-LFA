"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Mail, MapPin, Phone } from "lucide-react";
import Swal from "sweetalert2";

const footerGroups = [
    {
        title: "Pojok SKK Migas",
        items: [
            { label: "Edukasi", href: "https://skkmigas.go.id/" },
            { label: "WBS Kawal SKK Migas", href: "https://skkmigas.go.id/" },
            { label: "Perpustakaan", href: "https://skkmigas.go.id/" },
            { label: "Rekrutmen", href: "https://skkmigas.go.id/" },
        ],
    },
    {
        title: "Perwakilan SKK Migas",
        items: [
            { label: "Kantor Pusat", href: "https://skkmigas.go.id/" },
            {
                label: "Kantor Perwakilan SKK Migas Sumatera Bagian Utara",
                href: "https://skkmigas.go.id/",
            },
            {
                label: "Kantor Perwakilan SKK Migas Sumatera Bagian Selatan",
                href: "https://skkmigas.go.id/",
            },
            {
                label: "Kantor Perwakilan SKK Migas Jawa, Bali, Madura, dan Nusa Tenggara",
                href: "https://skkmigas.go.id/",
            },
            {
                label: "Kantor Perwakilan SKK Migas Kalimantan dan Sulawesi",
                href: "https://skkmigas.go.id/",
            },
            {
                label: "Kantor Perwakilan SKK Migas Wilayah Papua dan Maluku",
                href: "https://skkmigas.go.id/",
            },
        ],
    },
];

const socialLinks = [
    {
        label: "Facebook",
        href: "https://www.facebook.com/humasskkmigas/",
        icon: "facebook",
    },
    {
        label: "Twitter / X",
        href: "https://x.com/humasskkmigas",
        icon: "twitter",
    },
    {
        label: "Instagram",
        href: "https://www.instagram.com/skkmigasofficial",
        icon: "instagram",
    },
];

export default function Footer() {
    const reduceMotion = useReducedMotion();
    const [year, setYear] = useState(2026);
    const [email, setEmail] = useState("");

    useEffect(() => {
        setYear(new Date().getFullYear());
    }, []);

    const reveal = (delay = 0) =>
        reduceMotion
            ? {}
            : {
                initial: { opacity: 0, y: 12 },
                whileInView: { opacity: 1, y: 0 },
                viewport: { once: true, amount: 0.15 },
                transition: {
                    duration: 0.5,
                    delay,
                    ease: "easeOut" as const,
                },
            };

    const handleNewsletterSubmit = async (
        event: React.FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        const form = event.currentTarget;

        // Pastikan email diisi dan formatnya valid.
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        // Backend newsletter belum terhubung.
        await Swal.fire({
            icon: "info",
            title: "Newsletter belum terhubung",
            text: "Email kamu valid, tetapi layanan newsletter belum tersedia.",
            confirmButtonText: "Mengerti",
            confirmButtonColor: "#315bd6",
            width: "30rem",
            customClass: {
                popup: "swal-popup",
                title: "swal-title",
                htmlContainer: "swal-text",
                confirmButton: "swal-button",
            },
        });
    };

    return (
        <footer className="relative overflow-hidden bg-[#06132f] px-5 pb-5 pt-7 text-white sm:px-8 sm:pb-6 sm:pt-8 lg:px-12">
            <div className="mx-auto w-full max-w-7xl">
                {/* LOGO DAN MEDIA SOSIAL */}
                <motion.div
                    {...reveal(0)}
                    className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
                >
                    <Link
                        href="/"
                        aria-label="Digital LFA - Beranda"
                        className="inline-flex w-fit items-center gap-2 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-4 focus-visible:ring-offset-[#06132f]"
                    >
                        <Image
                            src="/images/logo1.png"
                            alt="Digital LFA"
                            width={100}
                            height={36}
                            className="h-7 w-auto object-contain sm:h-8"
                        />

                        <span className="text-sm font-bold tracking-tight text-white sm:text-base">
                            SKK Migas | Digital LFA
                        </span>
                    </Link>

                    {/* IKON MEDIA SOSIAL */}
                    <div
                        aria-label="Media sosial"
                        className="flex items-center gap-2"
                    >
                        {socialLinks.map((social) => (
                            <a
                                key={social.label}
                                href={social.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={social.label}
                                title={social.label}
                                className="group flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-white/15 bg-white/[0.03] text-slate-300 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#315bd6] hover:bg-[#315bd6] hover:text-white hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#315bd6] focus-visible:ring-offset-2 focus-visible:ring-offset-[#06132f] sm:h-11 sm:w-11"
                            >
                                <svg
                                    viewBox="0 0 24 24"
                                    className="h-4 w-4 fill-current transition-transform duration-300 group-hover:scale-105 sm:h-[17px] sm:w-[17px]"
                                    aria-hidden="true"
                                >
                                    {social.icon === "facebook" && (
                                        <path d="M13.5 21v-8h2.7l.4-3.1h-3.1V8c0-.9.3-1.5 1.6-1.5h1.7V3.7c-.3 0-1.3-.1-2.4-.1-2.4 0-4.1 1.5-4.1 4.2v2.1H7.5V13h2.8v8h3.2Z" />
                                    )}

                                    {social.icon === "twitter" && (
                                        <path d="M18.9 2H22l-6.8 7.8L23.2 22h-6.3L12 14.6 5.5 22H2.3l7.3-8.4L1.8 2h6.5l4.5 6.8L18.9 2Zm-1.1 17.8h1.7L7.3 4.1H5.5l12.3 15.7Z" />
                                    )}

                                    {social.icon === "instagram" && (
                                        <>
                                            <rect
                                                x="3"
                                                y="3"
                                                width="18"
                                                height="18"
                                                rx="5"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                            />
                                            <circle
                                                cx="12"
                                                cy="12"
                                                r="4"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                            />
                                            <circle
                                                cx="17.5"
                                                cy="6.8"
                                                r="1.2"
                                            />
                                        </>
                                    )}
                                </svg>
                            </a>
                        ))}
                    </div>
                </motion.div>

                <div className="mt-5 h-px bg-white/10 sm:mt-6" />

                {/* INFORMASI UTAMA */}
                <div className="grid grid-cols-1 gap-x-8 gap-y-9 py-7 sm:grid-cols-2 sm:py-8 lg:grid-cols-[1fr_1.5fr_1.2fr_1.15fr] lg:gap-x-8 lg:py-9">
                    {/* POJOK SKK MIGAS */}
                    <motion.div
                        {...reveal(0.05)}
                        className="min-w-0"
                    >
                        <h2 className="mb-4 text-xs font-semibold text-white sm:text-[13px]">
                            {footerGroups[0].title}
                        </h2>

                        <ul className="space-y-3">
                            {footerGroups[0].items.map((item) => (
                                <li key={item.label}>
                                    <a
                                        href={item.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex max-w-full items-start text-[11px] leading-5 text-slate-300 transition-colors hover:text-white sm:text-xs"
                                    >
                                        {item.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* PERWAKILAN SKK MIGAS */}
                    <motion.div
                        {...reveal(0.1)}
                        className="min-w-0"
                    >
                        <h2 className="mb-4 text-xs font-semibold text-white sm:text-[13px]">
                            {footerGroups[1].title}
                        </h2>

                        <ul className="space-y-3">
                            {footerGroups[1].items.map((item) => (
                                <li key={item.label}>
                                    <a
                                        href={item.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex max-w-full items-start text-[11px] leading-5 text-slate-300 transition-colors hover:text-white sm:text-xs"
                                    >
                                        {item.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* KONTAK */}
                    <motion.div
                        {...reveal(0.15)}
                        className="min-w-0"
                    >
                        <h2 className="mb-4 text-xs font-semibold text-white sm:text-[13px]">
                            Kontak
                        </h2>

                        <div className="space-y-4 text-[11px] leading-5 text-slate-300 sm:text-xs">
                            <div className="flex items-start gap-3">
                                <MapPin
                                    size={18}
                                    className="mt-0.5 shrink-0 text-white"
                                />
                                <p>
                                    Gedung Wisma Mulia Lantai 35,
                                    <br />
                                    Jl. Gatot Subroto No. 42,
                                    <br />
                                    Jakarta 12710
                                    <br />
                                    PO BOX 4775
                                </p>
                            </div>

                            <a
                                href="tel:+622129241607"
                                className="flex items-center gap-3 transition-colors hover:text-white"
                            >
                                <Phone
                                    size={17}
                                    className="shrink-0 text-white"
                                />
                                <span>(+62-21) 2924-1607</span>
                            </a>

                            <a
                                href="mailto:humas@skkmigas.go.id"
                                className="flex items-center gap-3 break-all transition-colors hover:text-white"
                            >
                                <Mail
                                    size={17}
                                    className="shrink-0 text-white"
                                />
                                <span>humas@skkmigas.go.id</span>
                            </a>
                        </div>
                    </motion.div>

                    {/* NEWSLETTER */}
                    <motion.div
                        {...reveal(0.2)}
                        className="min-w-0"
                    >
                        <h2 className="mb-3 text-xs font-semibold text-white sm:text-[13px]">
                            Newsletter
                        </h2>

                        <p className="mb-4 max-w-xs text-[11px] leading-5 text-slate-300 sm:text-xs">
                            Dapatkan informasi terbaru seputar Digital LFA
                            melalui email.
                        </p>

                        <form
                            onSubmit={handleNewsletterSubmit}
                            className="flex flex-col gap-2"
                        >
                            <label
                                htmlFor="footer-email"
                                className="sr-only"
                            >
                                Alamat email
                            </label>

                            <input
                                id="footer-email"
                                name="email"
                                type="email"
                                value={email}
                                onChange={(event) =>
                                    setEmail(event.target.value)
                                }
                                placeholder="Masukkan email"
                                required
                                className="h-9 w-full rounded-full border border-slate-200/80 bg-white px-4 text-[11px] text-slate-900 outline-none transition-shadow placeholder:text-slate-400 focus:ring-2 focus:ring-blue-400"
                            />

                            <button
                                type="submit"
                                className="inline-flex h-9 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-[#315bd6] px-4 text-[11px] font-semibold text-white transition-colors hover:bg-[#416be7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#06132f]"
                            >
                                <Mail size={12} />
                                Daftar Newsletter
                            </button>
                        </form>
                    </motion.div>
                </div>

                <div className="h-px bg-white/10" />

                {/* COPYRIGHT DAN TAUTAN LEGAL */}
                <div className="flex flex-col gap-3 py-4 text-[9px] leading-5 text-slate-400 sm:flex-row sm:items-center sm:justify-between sm:gap-5 sm:text-[10px]">
                    <p>
                        © {year} SKK Migas · Satuan Kerja Khusus Pelaksana
                        Kegiatan Usaha Hulu Minyak dan Gas Bumi
                    </p>

                    <nav
                        aria-label="Tautan legal"
                        className="flex flex-wrap items-center gap-x-4 gap-y-1 sm:justify-end"
                    >
                        <Link
                            href="/privasi"
                            className="transition-colors hover:text-white"
                        >
                            Pernyataan privasi
                        </Link>

                        <Link
                            href="/syarat-penggunaan"
                            className="transition-colors hover:text-white"
                        >
                            Syarat penggunaan
                        </Link>

                        <span className="text-slate-500">
                            Informasi publik
                        </span>
                    </nav>
                </div>
            </div>
        </footer>
    );
}