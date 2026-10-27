"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Search, LoaderCircle, X } from "lucide-react";
import FoldText from "@/components/FoldText";

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

type LocationSearchResult = {
    placeId: string;
    name: string;
    address: string;
    description: string;
    lat?: number;
    lon?: number;
};

function IndonesiaDotMap() {
    const reduceMotion = useReducedMotion();
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<import("maplibre-gl").Map | null>(null);
    const markerRef = useRef<import("maplibre-gl").Marker | null>(null);
    const [selectedProvince, setSelectedProvince] = useState("");
    const [mapError, setMapError] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searching, setSearching] = useState(false);
    const [searchMessage, setSearchMessage] = useState("");
    const [suggestions, setSuggestions] = useState<LocationSearchResult[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const sessionTokenRef = useRef<string | null>(null);
    const suppressAutocompleteRef = useRef(false);
    const cameraRotationRunRef = useRef(0);

    useEffect(() => {
        let cancelled = false;
        let map: import("maplibre-gl").Map | null = null;
        let resizeObserver: ResizeObserver | null = null;

        async function initializeMap() {
            try {
                const maplibregl = await import("maplibre-gl");

                maplibregl.setWorkerUrl("/maplibre/maplibre-gl-worker.mjs");

                if (cancelled || !mapContainerRef.current) return;

                map = new maplibregl.Map({
                    container: mapContainerRef.current,
                    style: "https://tiles.openfreemap.org/styles/positron",
                    attributionControl: false,
                    center: [117, -2],
                    zoom: 4.0,
                    maxBounds: [[92, -14], [144, 10]],
                    pitch: 0,
                    bearing: 0,
                    maxPitch: 75,
                    minZoom: 3.5,
                    maxZoom: 18,
                    cooperativeGestures: true,
                });

                mapInstanceRef.current = map;

                map.addControl(
                    new maplibregl.NavigationControl({ showCompass: true }),
                    "top-right"
                );

                map.on("load", async () => {
                    if (!map || cancelled) return;

                    for (const layer of map.getStyle().layers ?? []) {
                        if (layer.type !== "symbol" || !layer.layout?.["text-field"]) continue;

                        const layerName = layer.id.toLowerCase();
                        const isAdministrativeLabel =
                            /(country|state|province|city|town|village|locality|settlement|place-label|region)/.test(layerName);

                        if (isAdministrativeLabel) {
                            map.setLayoutProperty(layer.id, "visibility", "none");
                        }
                    }

                    try {
                        const response = await fetch(
                            "/maps/indonesia-38-provinces.geojson"
                        );

                        if (!response.ok) {
                            throw new Error(
                                "File GeoJSON provinsi Indonesia tidak ditemukan."
                            );
                        }

                        const geojson = await response.json();

                        if (cancelled || !map) return;

                        map.addSource("indonesia-provinces", {
                            type: "geojson",
                            data: geojson,
                        });

                        map.addLayer({
                            id: "province-fill",
                            type: "fill",
                            source: "indonesia-provinces",
                            paint: {
                                "fill-color": [
                                    "case",
                                    ["boolean", ["feature-state", "selected"], false],
                                    "#dc2626",
                                    "#dbe4ee",
                                ],
                                "fill-opacity": [
                                    "interpolate",
                                    ["linear"],
                                    ["zoom"],
                                    3, 0.22,
                                    4.5, 0.10,
                                    5.5, 0.025,
                                    6, 0,
                                ],
                            },
                        });

                        map.addLayer({
                            id: "province-outline",
                            type: "line",
                            source: "indonesia-provinces",
                            paint: {
                                "line-color": [
                                    "case",
                                    ["boolean", ["feature-state", "selected"], false],
                                    "#991b1b",
                                    "#ffffff",
                                ],
                                "line-width": [
                                    "case",
                                    ["boolean", ["feature-state", "selected"], false],
                                    2,
                                    0.8,
                                ],
                            },
                        });

                        map.addSource("openfreemap", {
                            type: "vector",
                            url: "https://tiles.openfreemap.org/planet",
                        });

                        const labelLayerId = map
                            .getStyle()
                            .layers?.find(
                                (layer) =>
                                    layer.type === "symbol" &&
                                    Boolean(layer.layout?.["text-field"])
                            )?.id;

                        map.addLayer(
                            {
                                id: "3d-buildings",
                                source: "openfreemap",
                                "source-layer": "building",
                                type: "fill-extrusion",
                                minzoom: 14.5,
                                filter: ["!=", ["get", "hide_3d"], true],
                                paint: {
                                    "fill-extrusion-color": [
                                        "coalesce",
                                        ["get", "colour"],
                                        "#b8c1cc",
                                    ],
                                    "fill-extrusion-height": [
                                        "interpolate",
                                        ["linear"],
                                        ["zoom"],
                                        14.5,
                                        0,
                                        16,
                                        ["coalesce", ["get", "render_height"], 8],
                                    ],
                                    "fill-extrusion-base": [
                                        "interpolate",
                                        ["linear"],
                                        ["zoom"],
                                        14.5,
                                        0,
                                        16,
                                        ["coalesce", ["get", "render_min_height"], 0],
                                    ],
                                    "fill-extrusion-opacity": 0.98,
                                },
                            },
                            labelLayerId
                        );

                        map.addLayer({
                            id: "named-places-labels",
                            type: "symbol",
                            source: "openfreemap",
                            "source-layer": "poi",
                            minzoom: 12,
                            filter: [
                                "all",
                                ["has", "name"],
                                ["!=", ["get", "name"], ""],
                            ],
                            layout: {
                                "text-field": [
                                    "coalesce",
                                    ["get", "name:id-ID"],
                                    ["get", "name:id"],
                                    ["get", "name"],
                                    ["get", "name:en"],
                                ],
                                "text-font": ["Noto Sans Regular"],
                                "text-size": [
                                    "interpolate", ["linear"], ["zoom"],
                                    12, 10,
                                    15, 11,
                                    18, 13,
                                ],
                                "text-max-width": 14,
                                "text-padding": 2,
                                "text-allow-overlap": true,
                                "text-ignore-placement": true,
                                "icon-allow-overlap": true,
                                "symbol-z-order": "source",
                            },
                            paint: {
                                "text-color": "#263445",
                                "text-halo-color": "#ffffff",
                                "text-halo-width": 2,
                                "text-halo-blur": 0.3,
                            },
                        });

                        map.addLayer({
                            id: "named-neighborhood-labels",
                            type: "symbol",
                            source: "openfreemap",
                            "source-layer": "place",
                            minzoom: 8,
                            filter: [
                                "all",
                                ["has", "name"],
                                ["!=", ["get", "name"], ""],
                            ],
                            layout: {
                                "text-field": [
                                    "coalesce",
                                    ["get", "name:id-ID"],
                                    ["get", "name:id"],
                                    ["get", "name"],
                                    ["get", "name:en"],
                                ],
                                "text-font": ["Noto Sans Regular"],
                                "text-size": [
                                    "interpolate", ["linear"], ["zoom"],
                                    8, 10,
                                    12, 12,
                                    16, 14,
                                ],
                                "text-max-width": 12,
                                "text-allow-overlap": true,
                                "text-ignore-placement": true,
                                "symbol-z-order": "source",
                            },
                            paint: {
                                "text-color": "#334155",
                                "text-halo-color": "#ffffff",
                                "text-halo-width": 2,
                            },
                        });

                        map.addSource("searched-place-label-source", {
                            type: "geojson",
                            data: {
                                type: "FeatureCollection",
                                features: [],
                            },
                        });

                        map.addLayer({
                            id: "searched-place-label",
                            type: "symbol",
                            source: "searched-place-label-source",
                            layout: {
                                "text-field": ["get", "label"],
                                "text-font": ["Noto Sans Bold"],
                                "text-size": [
                                    "interpolate", ["linear"], ["zoom"],
                                    12, 12,
                                    15, 15,
                                    18, 18,
                                ],
                                "text-offset": [0, -2.5],
                                "text-anchor": "bottom",
                                "text-max-width": 15,
                                "text-allow-overlap": true,
                                "text-ignore-placement": true,
                                "symbol-z-order": "source",
                            },
                            paint: {
                                "text-color": "#991b1b",
                                "text-halo-color": "#ffffff",
                                "text-halo-width": 2.5,
                                "text-halo-blur": 0.3,
                            },
                        });

                        const getProvinceName = (
                            properties: Record<string, unknown> | null | undefined
                        ) => {
                            const keys = [
                                "name",
                                "NAME_1",
                                "Propinsi",
                                "PROVINSI",
                                "province",
                                "provinsi",
                                "WADMPR",
                                "namaprov",
                            ];

                            const rawName = keys
                                .map((key) => properties?.[key])
                                .find(
                                    (value) =>
                                        typeof value === "string" &&
                                        value.trim().length > 0
                                );

                            return normalizeProvinceName(
                                typeof rawName === "string"
                                    ? rawName
                                    : "Wilayah Indonesia"
                            );
                        };

                        let selectedFeatureId: string | number | undefined;

                        map.on("click", "province-fill", (event) => {
                            if (!map) return;

                            const feature = event.features?.[0];
                            if (!feature) return;

                            const provinceName = getProvinceName(feature.properties);
                            const featureId =
                                feature.id ??
                                (feature.properties?.id as string | number | undefined);

                            if (selectedFeatureId !== undefined) {
                                map.setFeatureState(
                                    {
                                        source: "indonesia-provinces",
                                        id: selectedFeatureId,
                                    },
                                    { selected: false }
                                );
                            }

                            if (
                                featureId !== undefined &&
                                selectedFeatureId === featureId
                            ) {
                                selectedFeatureId = undefined;
                                setSelectedProvince("");
                                map.easeTo({
                                    center: [117, -2],
                                    zoom: 4.0,
                                    pitch: 0,
                                    duration: reduceMotion ? 0 : 900,
                                });
                                return;
                            }

                            selectedFeatureId = featureId;
                            if (featureId !== undefined) {
                                map.setFeatureState(
                                    {
                                        source: "indonesia-provinces",
                                        id: featureId,
                                    },
                                    { selected: true }
                                );
                            }

                            setSelectedProvince(provinceName);

                            const coordinates = feature.geometry
                                ? JSON.stringify(feature.geometry)
                                : "";
                            if (!coordinates) return;

                            const points: number[][] = [];
                            const collectCoordinates = (value: unknown) => {
                                if (!Array.isArray(value)) return;
                                if (
                                    value.length >= 2 &&
                                    typeof value[0] === "number" &&
                                    typeof value[1] === "number"
                                ) {
                                    points.push([value[0], value[1]]);
                                    return;
                                }
                                value.forEach(collectCoordinates);
                            };

                            collectCoordinates(
                                (feature.geometry as { coordinates?: unknown })
                                    .coordinates
                            );

                            if (points.length) {
                                const bounds = points.reduce(
                                    (result, point) =>
                                        result.extend(point as [number, number]),
                                    new maplibregl.LngLatBounds(
                                        points[0] as [number, number],
                                        points[0] as [number, number]
                                    )
                                );

                                map.fitBounds(bounds, {
                                    padding: 48,
                                    maxZoom: 8.5,
                                    duration: reduceMotion ? 0 : 1100,
                                });
                            }
                        });

                        map.on("mouseenter", "province-fill", () => {
                            if (map) map.getCanvas().style.cursor = "pointer";
                        });

                        map.on("mouseleave", "province-fill", () => {
                            if (map) map.getCanvas().style.cursor = "";
                        });

                        setMapError(false);
                    } catch (error) {
                        console.error("Gagal memuat layer peta:", error);
                        if (!cancelled) setMapError(true);
                    }
                });

                map.on("error", (event) => {
                    console.warn("MapLibre:", event.error?.message ?? event);
                });

                resizeObserver = new ResizeObserver(() => {
                    map?.resize();
                });
                resizeObserver.observe(mapContainerRef.current);
            } catch (error) {
                console.error("Gagal menginisialisasi MapLibre:", error);
                if (!cancelled) setMapError(true);
            }
        }

        void initializeMap();

        return () => {
            cancelled = true;
            resizeObserver?.disconnect();
            markerRef.current?.remove();
            markerRef.current = null;
            mapInstanceRef.current = null;
            map?.remove();
        };
    }, [reduceMotion]);

    // Ambil saran lokasi dari Google Places melalui route API server.
    useEffect(() => {
        if (suppressAutocompleteRef.current) {
            suppressAutocompleteRef.current = false;
            return;
        }

        const query = searchQuery.trim();
        if (query.length < 3) {
            setSuggestions([]);
            setShowSuggestions(false);
            return;
        }

        let cancelled = false;
        const controller = new AbortController();

        const timer = window.setTimeout(async () => {
            try {
                if (!sessionTokenRef.current) {
                    sessionTokenRef.current = crypto.randomUUID();
                }

                const params = new URLSearchParams({
                    input: query,
                    sessionToken: sessionTokenRef.current,
                });

                const response = await fetch(`/api/places?${params.toString()}`, {
                    signal: controller.signal,
                });
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || "Pencarian lokasi gagal.");
                }

                const found: LocationSearchResult[] = Array.isArray(data.suggestions)
                    ? data.suggestions
                    : [];

                if (!cancelled) {
                    setSuggestions(found);
                    setShowSuggestions(found.length > 0);

                    if (!found.length) {
                        setSearchMessage(
                            "Belum ada saran lokasi. Coba nama atau alamat yang lebih lengkap."
                        );
                    }
                }
            } catch (error) {
                if (
                    cancelled ||
                    (error instanceof DOMException && error.name === "AbortError")
                ) {
                    return;
                }

                console.error("Google Places autocomplete gagal:", error);
                setSuggestions([]);
                setShowSuggestions(false);
                setSearchMessage(
                    "Saran lokasi gagal dimuat. Periksa konfigurasi Google Places API."
                );
            }
        }, 350);

        return () => {
            cancelled = true;
            window.clearTimeout(timer);
            controller.abort();
        };
    }, [searchQuery]);

    async function selectLocation(result: LocationSearchResult) {
        const map = mapInstanceRef.current;

        if (!map) {
            setSearchMessage("Peta masih dimuat. Coba lagi sebentar.");
            return;
        }

        setSearching(true);
        setShowSuggestions(false);
        setSuggestions([]);
        setSearchMessage("");

        try {
            const params = new URLSearchParams({ placeId: result.placeId });

            if (sessionTokenRef.current) {
                params.set("sessionToken", sessionTokenRef.current);
            }

            const response = await fetch(`/api/places?${params.toString()}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Detail lokasi gagal dimuat.");
            }

            const longitude = Number(data.lon);
            const latitude = Number(data.lat);

            if (!Number.isFinite(longitude) || !Number.isFinite(latitude)) {
                throw new Error("Koordinat lokasi tidak valid.");
            }

            const placeName = data.name || result.name || "Lokasi terpilih";
            const placeAddress =
                data.address || result.address || result.description || placeName;
            const maplibregl = await import("maplibre-gl");

            markerRef.current?.remove();

            markerRef.current = new maplibregl.Marker({ color: "#dc2626" })
                .setLngLat([longitude, latitude])
                .setPopup(
                    new maplibregl.Popup({ offset: 24 }).setText(
                        `${placeName} — ${placeAddress}`
                    )
                )
                .addTo(map);

            const labelSource = map.getSource("searched-place-label-source") as
                | import("maplibre-gl").GeoJSONSource
                | undefined;

            labelSource?.setData({
                type: "FeatureCollection",
                features: [{
                    type: "Feature",
                    geometry: {
                        type: "Point",
                        coordinates: [longitude, latitude],
                    },
                    properties: { label: placeName },
                }],
            });

            const rotationRun = ++cameraRotationRunRef.current;

            map.flyTo({
                center: [longitude, latitude],
                zoom: 16.5,
                pitch: 62,
                bearing: -25,
                offset: [-80, 80],
                duration: reduceMotion ? 0 : 2600,
                easing: (t: number) =>
                    t < 0.5
                        ? 4 * t * t * t
                        : 1 - Math.pow(-2 * t + 2, 3) / 2,
                essential: true,
            });

            if (!reduceMotion) {
                const rotationBearings = [-5, 15, -5, -20, -5, 15, -5, -20];

                const rotateNext = (index: number) => {
                    if (
                        rotationRun !== cameraRotationRunRef.current ||
                        index >= rotationBearings.length
                    ) {
                        return;
                    }

                    map.easeTo({
                        bearing: rotationBearings[index],
                        duration: 2600,
                        easing: (t: number) =>
                            t < 0.5
                                ? 4 * t * t * t
                                : 1 - Math.pow(-2 * t + 2, 3) / 2,
                        essential: true,
                    });

                    map.once("moveend", () => rotateNext(index + 1));
                };

                map.once("moveend", () => {
                    if (rotationRun === cameraRotationRunRef.current) {
                        rotateNext(0);
                    }
                });
            }

            suppressAutocompleteRef.current = true;
            setSearchQuery(placeName);
            setSelectedProvince("");
            setSearchMessage(
                `Lokasi ditemukan: ${placeName}${placeAddress ? ` — ${placeAddress}` : ""}`
            );
            sessionTokenRef.current = null;
        } catch (error) {
            console.error("Gagal membuka lokasi:", error);
            setSearchMessage(
                error instanceof Error
                    ? error.message
                    : "Lokasi tidak dapat dibuka. Coba pilih hasil lain."
            );
        } finally {
            setSearching(false);
        }
    }

    function clearSearch() {
        const map = mapInstanceRef.current;

        cameraRotationRunRef.current += 1;
        map?.stop();

        setSearchQuery("");
        setSearching(false);
        setSearchMessage("");
        setSuggestions([]);
        setShowSuggestions(false);
        setSelectedProvince("");
        sessionTokenRef.current = null;
        suppressAutocompleteRef.current = false;

        markerRef.current?.remove();
        markerRef.current = null;

        const labelSource = map?.getSource("searched-place-label-source") as
            | import("maplibre-gl").GeoJSONSource
            | undefined;

        labelSource?.setData({
            type: "FeatureCollection",
            features: [],
        });

        map?.easeTo({
            center: [117, -2],
            zoom: 4.0,
            pitch: 0,
            bearing: 0,
            duration: reduceMotion ? 0 : 1000,
            essential: true,
        });
    }

    async function searchLocation(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const query = searchQuery.trim();
        const map = mapInstanceRef.current;

        if (!query || !map) {
            setSearchMessage(
                query
                    ? "Peta masih dimuat. Coba lagi sebentar."
                    : "Masukkan nama perusahaan, gedung, atau alamat terlebih dahulu."
            );
            return;
        }

        setSearching(true);
        setSearchMessage("");

        try {
            if (!sessionTokenRef.current) {
                sessionTokenRef.current = crypto.randomUUID();
            }

            const params = new URLSearchParams({
                input: query,
                sessionToken: sessionTokenRef.current,
            });

            const response = await fetch(`/api/places?${params.toString()}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Pencarian lokasi gagal.");
            }

            const firstResult = (
                data.suggestions ?? []
            )[0] as LocationSearchResult | undefined;

            if (!firstResult) {
                setSearchMessage(
                    `Lokasi “${query}” belum ditemukan. Coba nama atau alamat yang lebih lengkap.`
                );
                return;
            }

            setSearching(false);
            await selectLocation(firstResult);
        } catch (error) {
            console.error("Pencarian Google Places gagal:", error);
            setSearchMessage(
                error instanceof Error
                    ? error.message
                    : "Pencarian gagal. Periksa koneksi internet dan konfigurasi API."
            );
        } finally {
            setSearching(false);
        }
    }

    return (
        <motion.div
            className="relative w-full"
            role="group"
            aria-label="Peta interaktif Indonesia dengan bangunan 3D"
            initial={reduceMotion ? false : { opacity: 0, y: 18 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
        >
            <style jsx global>{`
                .map-card .maplibregl-ctrl-attrib:not(.maplibregl-compact-show) .maplibregl-ctrl-attrib-inner {
                    display: none !important;
                }

                .map-card .maplibregl-ctrl-attrib.maplibregl-compact-show .maplibregl-ctrl-attrib-inner {
                    display: block !important;
                }
            `}</style>

            <form
                onSubmit={searchLocation}
                className="absolute left-2 right-12 top-2 z-20 flex max-w-[250px] gap-1 rounded-md border border-slate-200 bg-white/95 p-1 shadow-md backdrop-blur-sm sm:left-3 sm:right-14 sm:top-3 sm:max-w-[290px] sm:gap-1 sm:rounded-lg sm:p-1.5 lg:left-4 lg:top-4 lg:max-w-[320px]"
                role="search"
                aria-label="Cari lokasi di peta"
            >
                <input
                    value={searchQuery}
                    onChange={(event) => {
                        setSearchQuery(event.target.value);
                        setShowSuggestions(true);
                        setSearchMessage("");
                    }}
                    placeholder="Cari nama perusahaan, gedung, atau alamat"
                    aria-label="Nama perusahaan, gedung, atau alamat"
                    className="min-w-0 flex-1 cursor-text bg-transparent px-1 text-[10px] leading-4 text-slate-800 outline-none placeholder:text-[9px] placeholder:text-slate-400 sm:px-1.5 sm:text-[11px] sm:leading-5 sm:placeholder:text-[10px] lg:text-xs lg:placeholder:text-[11px]"
                />

                {searchQuery.trim().length > 0 && (
                    <button
                        type="button"
                        onClick={clearSearch}
                        aria-label="Hapus pencarian dan kembali ke tampilan awal peta"
                        title="Hapus pencarian"
                        className="flex shrink-0 cursor-pointer items-center justify-center rounded bg-slate-100 p-1.5 text-slate-600 transition hover:bg-slate-200 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 sm:rounded-md sm:p-1.5 lg:p-2"
                    >
                        <X className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                    </button>
                )}

                <button
                    type="submit"
                    disabled={searching}
                    aria-label={searching ? "Sedang mencari lokasi" : "Cari lokasi"}
                    title={searching ? "Sedang mencari lokasi" : "Cari lokasi"}
                    className="flex shrink-0 cursor-pointer items-center justify-center rounded bg-red-600 p-1.5 text-white transition hover:bg-red-700 disabled:cursor-wait disabled:opacity-60 sm:rounded-md sm:p-1.5 lg:p-2"
                >
                    {searching ? (
                        <LoaderCircle className="h-3 w-3 animate-spin sm:h-3.5 sm:w-3.5" />
                    ) : (
                        <Search className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                    )}
                </button>
            </form>

            {showSuggestions && suggestions.length > 0 && (
                <div
                    className="absolute left-2 right-12 top-[43px] z-30 max-h-36 max-w-[250px] overflow-hidden rounded-md border border-slate-200 bg-white shadow-lg sm:left-3 sm:right-14 sm:top-[49px] sm:max-h-44 sm:max-w-[290px] sm:rounded-lg lg:left-4 lg:top-[65px] lg:max-w-[320px]"
                    role="listbox"
                    aria-label="Saran lokasi"
                >
                    <div className="max-h-36 overflow-x-hidden overflow-y-auto overscroll-contain sm:max-h-44">
                        {suggestions.map((item, index) => (
                            <button
                                key={`${item.placeId}-${index}`}
                                type="button"
                                role="option"
                                aria-selected="false"
                                onClick={() => void selectLocation(item)}
                                className="block w-full cursor-pointer border-b border-slate-100 px-2 py-1.5 text-left last:border-b-0 hover:bg-red-50 focus:bg-red-50 focus:outline-none sm:px-2.5 sm:py-2"
                            >
                                <span className="block truncate text-[10px] font-semibold leading-4 text-slate-800 sm:text-[11px] sm:leading-4 lg:text-xs">
                                    {item.name || item.description || "Lokasi"}
                                </span>
                                <span className="mt-0.5 block line-clamp-2 text-[9px] leading-3.5 text-slate-500 sm:text-[10px] sm:leading-4">
                                    {item.address || item.description}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <div
                ref={mapContainerRef}
                className="map-card h-[230px] w-full overflow-hidden rounded-2xl border border-slate-200 bg-white sm:h-[300px] lg:h-[350px] [&_.maplibregl-canvas-container]:!rounded-2xl [&_.maplibregl-canvas]:!rounded-2xl"
            />

            {searchMessage && (
                <p
                    className="mt-1.5 rounded-md bg-white px-2 py-1.5 text-[10px] leading-4 text-slate-600 shadow-sm sm:text-[11px]"
                    aria-live="polite"
                >
                    {searchMessage}
                </p>
            )}

            {selectedProvince && (
                <div className="pointer-events-none absolute left-3 top-3 z-10 rounded-lg border border-red-100 bg-white/95 px-3 py-2 text-xs font-semibold text-red-700 shadow-sm sm:text-sm">
                    {selectedProvince}
                </div>
            )}

            {mapError && (
                <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-center text-xs leading-5 text-red-700">
                    Peta belum dapat dimuat. Pastikan file
                    {" "}public/maps/indonesia-38-provinces.geojson tersedia dan koneksi internet aktif.
                </p>
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

    // Container mengatur urutan animasi seluruh card LFA.
    const stagesContainerVariants = {
        hidden: {},
        visible: {
            transition: {
                staggerChildren: reduceMotion ? 0 : 0.25,
            },
        },
    };

    // Setiap card menunggu giliran dari stagesContainerVariants.
    const stageCardVariants = {
        hidden: reduceMotion
            ? { opacity: 1, y: 0 }
            : { opacity: 0, y: 24 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: reduceMotion ? 0 : 0.55,
                ease: "easeOut" as const,
            },
        },
    };

    return (
        <main className="relative isolate overflow-hidden bg-white">
            <section
                id="tentang"
                aria-labelledby="tentang-title"
                className="relative scroll-mt-15 bg-white px-6 pt-16 pb-16 sm:px-10 sm:pt-20 sm:pb-20 lg:px-16 lg:pt-15 lg:pb-24"
            >
                <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-8 sm:gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-10 xl:grid-cols-[0.9fr_1.1fr] xl:gap-12">
                    <motion.div
                        {...reveal(0)}
                        className="flex flex-col items-start"
                    >
                        <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-red-600 sm:text-[11px]">
                            Tentang
                        </span>

                        <h2
                            id="tentang-title"
                            className="mt-5 max-w-[520px] text-lg font-bold leading-[1.25] tracking-[-0.03em] text-slate-900 sm:text-xl lg:text-2xl"
                        >
                            <FoldText
                                text="Satu kerangka yang sama untuk seluruh wilayah kerja."
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
                        </h2>

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
                        className="relative mx-auto w-full max-w-[700px] sm:mt-0 lg:ml-auto"
                    >
                        <IndonesiaDotMap />

                        <div className="-mt-5 flex items-center justify-end gap-2 pr-4 text-[9px] font-medium text-slate-400 sm:-mt-5 sm:pr-4 sm:text-[10px] lg:-mt-6 lg:pr-6">
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
                <div className="relative w-full overflow-hidden rounded-[28px] bg-slate-100 px-5 py-8 sm:rounded-[36px] sm:px-8 sm:py-10 lg:rounded-[50px] lg:px-12 lg:py-12">
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
                                    className="mt-4 text-xl font-bold leading-tight tracking-[-0.035em] text-slate-900 sm:text-2xl"
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

                                {/* 
                                  Satu container mengontrol pemicu animasi.
                                  Card muncul bergantian dengan jeda 0,25 detik.
                                */}
                                <motion.div
                                    className="grid grid-cols-1 gap-4 pb-3 md:grid-cols-4 md:gap-3 md:pb-5 lg:gap-4 lg:pb-6"
                                    variants={stagesContainerVariants}
                                    initial={reduceMotion ? false : "hidden"}
                                    whileInView={reduceMotion ? undefined : "visible"}
                                    viewport={{ once: true, amount: 0.15 }}
                                >
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
                                                variants={stageCardVariants}
                                                className="relative min-w-0"
                                            >
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
                                                                duration: reduceMotion ? 0 : 0.2,
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
                                                    className={`group relative ml-6 flex min-h-[155px] w-[calc(100%-1.5rem)] flex-col rounded-xl border bg-white p-4 transition-colors duration-300 sm:min-h-[170px] sm:p-5 md:ml-0 md:min-h-[205px] md:w-full md:p-4 lg:min-h-[190px] lg:p-5 ${isActive
                                                        ? "border-red-200"
                                                        : "border-slate-200 hover:border-red-200"
                                                        }`}
                                                >
                                                    <button
                                                        type="button"
                                                        onClick={() => handleStageChange(index)}
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

                                                            <span
                                                                aria-hidden="true"
                                                                className={`mt-0.5 flex h-5 w-5 items-center justify-center rounded-full text-[10px] transition-colors duration-300 sm:h-6 sm:w-6 sm:text-xs ${showGreenCheck
                                                                    ? "bg-emerald-600 text-white"
                                                                    : "bg-slate-100 text-slate-400"
                                                                    }`}
                                                            >
                                                                {showGreenCheck ? "✓" : "↗"}
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
                                                                        setIsStageFourCompleted(true)
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
                                </motion.div>
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