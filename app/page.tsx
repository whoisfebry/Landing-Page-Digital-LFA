"use client";

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Tentang from "@/components/Tentang";
import Tujuan from "@/components/Tujuan";
import Untuksiapa from "@/components/Untuksiapa";
import Manfaat from "@/components/Manfaat";
import Pengelola from "@/components/Pengelola";
import Footer from "@/components/Footer";

export default function Home() {
    return (
        <main>
            <Navbar />
            <Hero />
            <Tentang />
            <Tujuan />
            <Untuksiapa />
            <Manfaat />
            <Pengelola />
            <Footer />
        </main>
    );
}