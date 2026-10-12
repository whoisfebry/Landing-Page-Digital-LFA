"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Menu, X, ChevronDown, ExternalLink } from "lucide-react";

const navLinks = [
    { label: "Tentang", href: "tentang" },
    { label: "Tujuan", href: "tujuan" },
    { label: "Untuk Siapa", href: "untuk-siapa" },
    { label: "Manfaat", href: "manfaat" },
    { label: "Pengelola", href: "pengelola" },
];

const portalLinks = [
    {
        label: "SKK Migas",
        href: "https://www.skkmigas.go.id/",
    },
    {
        label: "Digital LFA",
        href: "https://uat.digital-lfa.sustenv.com/login",
    },
];

const rubberTransition = {
    type: "spring" as const,
    stiffness: 420,
    damping: 28,
    mass: 0.7,
};

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isPortalOpen, setIsPortalOpen] = useState(false);
    const [activeLink, setActiveLink] = useState("");

    const closeMenus = () => {
        setIsMenuOpen(false);
        setIsPortalOpen(false);
    };

    // Menyesuaikan menu aktif berdasarkan URL saat halaman dibuka.
    useEffect(() => {
        const syncActiveLink = () => {
            const currentPath = window.location.pathname
                .replace(/^\/+|\/+$/g, "");

            const matchingLink = navLinks.find(
                (link) => link.href === currentPath,
            );

            setActiveLink(matchingLink?.href ?? "");
        };

        syncActiveLink();

        window.addEventListener("popstate", syncActiveLink);

        return () => {
            window.removeEventListener("popstate", syncActiveLink);
        };
    }, []);

    // Navigasi ke section sekaligus mengubah URL tanpa tanda #.
    const handleNavigation = (
        event: React.MouseEvent<HTMLAnchorElement>,
        id: string,
    ) => {
        event.preventDefault();

        window.history.pushState(null, "", `/${id}`);

        setActiveLink(id);
        closeMenus();

        document.getElementById(id)?.scrollIntoView({
            behavior: "smooth",
            block: "start",
        });
    };

    // Kembali ke halaman utama melalui logo.
    const handleLogoClick = (
        event: React.MouseEvent<HTMLAnchorElement>,
    ) => {
        event.preventDefault();

        window.history.pushState(null, "", "/");

        setActiveLink("");
        closeMenus();

        document.getElementById("home")?.scrollIntoView({
            behavior: "smooth",
            block: "start",
        });
    };

    return (
        <header className="fixed left-1/2 top-3 z-50 w-[calc(100%-1.5rem)] -translate-x-1/2 sm:top-5 sm:w-max sm:max-w-[calc(100%-2.5rem)]">
            <div className="relative">
                {/* Navbar Utama */}
                <nav className="w-full rounded-full border border-white/80 bg-white/65 px-3 py-2 text-slate-800 shadow-lg shadow-slate-900/5 backdrop-blur-xl sm:w-auto sm:px-4">
                    <div className="flex items-center justify-between gap-3 sm:justify-start sm:gap-9 lg:gap-10">
                        {/* Logo */}
                        <a
                            href="/"
                            aria-label="Digital LFA - Beranda"
                            onClick={handleLogoClick}
                            className="flex shrink-0 items-center sm:mr-2"
                        >
                            <Image
                                src="/images/logo.png"
                                alt="Logo Digital LFA"
                                width={64}
                                height={64}
                                priority
                                className="h-10 w-14 shrink-0 object-contain sm:h-11 sm:w-14"
                            />
                        </a>

                        {/* Menu Desktop */}
                        <div className="hidden items-center gap-1 lg:flex xl:gap-1.5">
                            {navLinks.map((link) => {
                                const isActive = activeLink === link.href;

                                return (
                                    <a
                                        key={link.href}
                                        href={`/${link.href}`}
                                        onClick={(event) =>
                                            handleNavigation(event, link.href)
                                        }
                                        aria-current={
                                            isActive ? "page" : undefined
                                        }
                                        className={`relative isolate whitespace-nowrap rounded-full px-3 py-2 text-[11px] transition-colors duration-200 xl:px-3.5 ${isActive
                                                ? "font-semibold text-red-600"
                                                : "text-slate-800 font-semibold hover:text-red-600"
                                            }`}
                                    >
                                        {isActive && (
                                            <motion.span
                                                layoutId="navbar-rubber-indicator"
                                                className="absolute inset-0 -z-10 rounded-full border border-white/80 bg-white/40 shadow-sm backdrop-blur-md"
                                                transition={rubberTransition}
                                            />
                                        )}

                                        <span className="relative z-10">
                                            {link.label}
                                        </span>
                                    </a>
                                );
                            })}
                        </div>

                        {/* Portal Desktop */}
                        <div className="relative hidden shrink-0 lg:block">
                            <button
                                type="button"
                                onClick={() =>
                                    setIsPortalOpen(!isPortalOpen)
                                }
                                aria-expanded={isPortalOpen}
                                className="flex cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-full border border-white/80 bg-white/40 px-3 py-2 text-[10px] font-semibold text-slate-800 shadow-sm transition-colors hover:bg-white/60"
                            >
                                Portal pengguna

                                <ChevronDown
                                    size={12}
                                    className={`transition-transform duration-200 ${isPortalOpen ? "rotate-180" : ""
                                        }`}
                                />
                            </button>

                            {isPortalOpen && (
                                <motion.div
                                    initial={{
                                        opacity: 0,
                                        y: -6,
                                        scale: 0.97,
                                    }}
                                    animate={{
                                        opacity: 1,
                                        y: 0,
                                        scale: 1,
                                    }}
                                    exit={{
                                        opacity: 0,
                                        y: -6,
                                        scale: 0.97,
                                    }}
                                    transition={{ duration: 0.18 }}
                                    className="absolute right-0 top-full mt-5 w-48 overflow-hidden rounded-xl border border-white/70 bg-white/90 p-1.5 text-slate-800 font-semibold shadow-xl backdrop-blur-xl"
                                >
                                    {portalLinks.map((link) => (
                                        <a
                                            key={link.label}
                                            href={link.href}
                                            onClick={() =>
                                                setIsPortalOpen(false)
                                            }
                                            className="flex items-center justify-between rounded-lg px-3 py-2.5 text-xs transition-colors hover:bg-slate-100 hover:text-red-600"
                                        >
                                            {link.label}
                                            <ExternalLink size={13} />
                                        </a>
                                    ))}
                                </motion.div>
                            )}
                        </div>

                        {/* Tombol Mobile dan Tablet */}
                        <button
                            type="button"
                            aria-label={
                                isMenuOpen ? "Tutup menu" : "Buka menu"
                            }
                            aria-expanded={isMenuOpen}
                            onClick={() => {
                                setIsMenuOpen(!isMenuOpen);
                                setIsPortalOpen(false);
                            }}
                            className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full border border-white/80 bg-white/40 text-slate-800 font-semibold shadow-sm transition-colors hover:bg-white/70 lg:hidden"
                        >
                            <motion.span
                                key={isMenuOpen ? "close" : "open"}
                                initial={{
                                    rotate: -45,
                                    opacity: 0.5,
                                }}
                                animate={{
                                    rotate: 0,
                                    opacity: 1,
                                }}
                                transition={{ duration: 0.18 }}
                                className="flex items-center justify-center"
                            >
                                {isMenuOpen ? (
                                    <X size={17} />
                                ) : (
                                    <Menu size={17} />
                                )}
                            </motion.span>
                        </button>
                    </div>
                </nav>

                {/* Menu Mobile dan Tablet */}
                {isMenuOpen && (
                    <motion.div
                        initial={{
                            opacity: 0,
                            y: -8,
                            scale: 0.98,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                            scale: 1,
                        }}
                        transition={rubberTransition}
                        className="absolute left-0 right-0 top-full mt-3 lg:hidden"
                    >
                        <div className="max-h-[calc(100svh-100px)] w-full overflow-y-auto rounded-2xl border border-white/80 bg-white/90 p-3 text-slate-800 shadow-xl shadow-slate-900/5 backdrop-blur-xl">
                            {/* Navigasi Mobile */}
                            <div className="space-y-1">
                                {navLinks.map((link) => {
                                    const isActive =
                                        activeLink === link.href;

                                    return (
                                        <a
                                            key={link.href}
                                            href={`/${link.href}`}
                                            onClick={(event) =>
                                                handleNavigation(
                                                    event,
                                                    link.href,
                                                )
                                            }
                                            aria-current={
                                                isActive ? "page" : undefined
                                            }
                                            className={`relative isolate flex min-h-10 items-center overflow-hidden rounded-xl px-3 py-2.5 text-sm transition-colors ${isActive
                                                    ? "font-semibold text-red-600"
                                                    : "font-medium text-slate-700 hover:text-red-600"
                                                }`}
                                        >
                                            {isActive && (
                                                <motion.span
                                                    layoutId="navbar-rubber-indicator"
                                                    className="absolute inset-0 -z-10 rounded-xl border border-white/80 bg-white/40 shadow-sm backdrop-blur-md"
                                                    transition={rubberTransition}
                                                />
                                            )}

                                            <span className="relative z-10">
                                                {link.label}
                                            </span>
                                        </a>
                                    );
                                })}
                            </div>

                            {/* Portal Mobile */}
                            <div className="mt-2 border-t border-slate-200/70 pt-2">
                                <p className="px-3 py-2 text-[11px] font-semibold text-slate-500">
                                    Portal pengguna
                                </p>

                                {portalLinks.map((link) => (
                                    <a
                                        key={link.label}
                                        href={link.href}
                                        onClick={closeMenus}
                                        className="flex min-h-10 items-center justify-between rounded-xl px-3 py-2.5 text-sm text-slate-700 transition-colors hover:bg-slate-100 hover:text-red-600"
                                    >
                                        {link.label}
                                        <ExternalLink size={14} />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </header>
    );
}