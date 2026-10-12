
"use client";

import {
    useRef,
    useEffect,
    useState,
    useCallback,
    type CSSProperties,
    type MouseEvent,
    type KeyboardEvent,
} from "react";
import { gsap } from "gsap";
import "./AccordionGallery.css";

export type AccordionGalleryItem = {
    image: string;
    label: string;
    alt?: string;
    link?: string;
};

type AccordionGalleryProps = {
    items: AccordionGalleryItem[];
    defaultIndex?: number;
    accentColor?: string;
    overlayColor?: string;
    textColor?: string;
    height?: number;
    gap?: number;
    radius?: number;
    expandRatio?: number;
    duration?: number;
    ease?: string;
    parallax?: number;
    tilt?: number;
    stagger?: number;
    trigger?: "hover" | "click";
    showLabels?: boolean;
    grayscale?: boolean;
    className?: string;
};

export default function AccordionGallery({
    items,
    defaultIndex = 0,
    accentColor = "#e0443b",
    overlayColor = "#111b2a",
    textColor = "#ffffff",
    height = 460,
    gap = 10,
    radius = 12,
    expandRatio = 0.58,
    duration = 0.6,
    ease = "power3.out",
    parallax = 0.2,
    tilt = 0,
    stagger = 0.06,
    trigger = "hover",
    showLabels = true,
    grayscale = true,
    className = "",
}: AccordionGalleryProps) {
    const rootRef = useRef<HTMLDivElement>(null);
    const panelRefs = useRef<(HTMLElement | null)[]>([]);
    const mediaRefs = useRef<(HTMLSpanElement | null)[]>([]);
    const barRefs = useRef<(HTMLSpanElement | null)[]>([]);
    const textRefs = useRef<(HTMLSpanElement | null)[]>([]);
    const tlRef = useRef<gsap.core.Timeline | null>(null);
    const firstRunRef = useRef(true);
    const mediaSizeRef = useRef(320);
    const mobileRef = useRef(false);

    const count = items.length;

    const [active, setActive] = useState(() =>
        Math.min(Math.max(defaultIndex, 0), Math.max(count - 1, 0))
    );

    const applyLayout = useCallback(
        (animate: boolean) => {
            const panels = panelRefs.current;
            if (!panels.length || !count) return;

            const reducedMotion =
                typeof window !== "undefined" &&
                window.matchMedia("(prefers-reduced-motion: reduce)").matches;

            const mobile = mobileRef.current;
            const ratio = Math.min(Math.max(expandRatio, 0.2), 0.8);

            // Desktop: satu panel melebar, sisanya mengecil.
            const grow =
                count > 1
                    ? (ratio * (count - 1)) / (1 - ratio)
                    : 1;

            tlRef.current?.kill();

            const durationValue =
                animate && !reducedMotion ? duration : 0;

            const timeline = gsap.timeline();

            panels.forEach((panel, index) => {
                if (!panel) return;

                const isActive = index === active;
                const media = mediaRefs.current[index];
                const bar = barRefs.current[index];
                const text = textRefs.current[index];

                timeline.to(
                    panel,
                    {
                        flexGrow: mobile
                            ? isActive ? 3 : 1
                            : isActive ? grow : 1,
                        rotateY: mobile
                            ? 0
                            : isActive
                                ? 0
                                : index < active
                                    ? tilt
                                    : -tilt,
                        duration: durationValue,
                        ease,
                    },
                    0
                );

                if (media) {
                    const drift = Math.max(
                        -1.5,
                        Math.min(1.5, active - index)
                    );

                    const shift =
                        drift * parallax * mediaSizeRef.current * 0.06;

                    timeline.to(
                        media,
                        {
                            xPercent: -50,
                            yPercent: -50,
                            x: mobile || isActive ? 0 : shift,
                            y: 0,
                            "--ag-gray":
                                grayscale && !isActive ? 1 : 0,
                            duration: durationValue,
                            ease,
                        },
                        0
                    );
                }

                panel.style.setProperty(
                    "--ag-dim",
                    isActive ? "0" : "0.35"
                );

                if (showLabels && bar && text) {
                    timeline.to(
                        [bar, text],
                        {
                            opacity: isActive ? 1 : 0,
                            x: isActive ? 0 : -14,
                            duration: durationValue,
                            ease,
                            stagger: isActive && !reducedMotion ? stagger : 0,
                        },
                        0
                    );
                }
            });

            tlRef.current = timeline;
        },
        [
            active,
            count,
            expandRatio,
            duration,
            ease,
            tilt,
            parallax,
            grayscale,
            showLabels,
            stagger,
        ]
    );

    useEffect(() => {
        const element = rootRef.current;
        if (!element || !count) return;

        const measure = () => {
            const rect = element.getBoundingClientRect();
            const mobile = window.matchMedia("(max-width: 640px)").matches;

            mobileRef.current = mobile;

            const usable = Math.max(
                rect.width - gap * (count - 1),
                120
            );

            mediaSizeRef.current = Math.max(
                140,
                usable *
                Math.min(Math.max(expandRatio, 0.2), 0.8) *
                1.1
            );

            element.style.setProperty(
                "--ag-media-size",
                `${mediaSizeRef.current}px`
            );

            element.style.setProperty(
                "--ag-gallery-height",
                `${mobile ? Math.max(380, count * 78 + 170) : height}px`
            );

            applyLayout(!firstRunRef.current);
        };

        measure();

        const observer = new ResizeObserver(measure);
        observer.observe(element);
        window.addEventListener("resize", measure);

        return () => {
            observer.disconnect();
            window.removeEventListener("resize", measure);
        };
    }, [applyLayout, count, gap, expandRatio, height]);

    useEffect(() => {
        applyLayout(!firstRunRef.current);
        firstRunRef.current = false;
    }, [applyLayout]);

    useEffect(
        () => () => {
            tlRef.current?.kill();
        },
        []
    );

    const handleEnter = (index: number) => {
        if (trigger === "hover" && !mobileRef.current) {
            setActive(index);
        }
    };

    const handleClick = (
        index: number,
        event: MouseEvent<HTMLElement>,
        link?: string
    ) => {
        if (index !== active) {
            if (link) event.preventDefault();
            setActive(index);
        }
    };

    const handleKeyDown = (
        index: number,
        event: KeyboardEvent<HTMLElement>
    ) => {
        if (!count) return;

        if (
            event.key === "ArrowRight" ||
            event.key === "ArrowDown"
        ) {
            event.preventDefault();
            setActive((index + 1) % count);
        } else if (
            event.key === "ArrowLeft" ||
            event.key === "ArrowUp"
        ) {
            event.preventDefault();
            setActive((index - 1 + count) % count);
        }
    };

    if (!count) return null;

    const galleryStyle = {
        "--ag-accent": accentColor,
        "--ag-overlay": overlayColor,
        "--ag-text": textColor,
        "--ag-gap": `${gap}px`,
        "--ag-radius": `${radius}px`,
        height: `${height}px`,
    } as CSSProperties;

    return (
        <div
            ref={rootRef}
            className={["accordion-gallery", className]
                .filter(Boolean)
                .join(" ")}
            style={galleryStyle}
            role="list"
            aria-label="Galeri dokumentasi program"
        >
            {items.map((item, index) => {
                const isActive = index === active;

                const panelContent = (
                    <>
                        <span className="ag-panel__frame">
                            <span
                                className="ag-panel__media"
                                ref={(element: HTMLSpanElement | null) => {
                                    mediaRefs.current[index] = element;
                                }}
                            >
                                <img
                                    src={item.image}
                                    alt={item.alt || item.label}
                                    draggable={false}
                                />
                            </span>

                            <span
                                className="ag-panel__overlay"
                                aria-hidden="true"
                            />
                        </span>

                        {showLabels && (
                            <span className="ag-panel__label">
                                <span
                                    className="ag-panel__bar"
                                    ref={(element: HTMLSpanElement | null) => {
                                        barRefs.current[index] = element;
                                    }}
                                />

                                <span className="ag-panel__label-content">
                                    <span
                                        className="ag-panel__text"
                                        ref={(element: HTMLSpanElement | null) => {
                                            textRefs.current[index] = element;
                                        }}
                                    >
                                        {item.label}
                                    </span>

                                    {isActive && item.alt && (
                                        <span className="ag-panel__caption">
                                            {item.alt}
                                        </span>
                                    )}
                                </span>
                            </span>
                        )}
                    </>
                );

                const panelProps = {
                    className: `ag-panel${isActive ? " ag-panel--active" : ""}`,
                    style: { borderRadius: `${radius}px` },
                    onClick: (event: MouseEvent<HTMLElement>) =>
                        handleClick(index, event, item.link),
                    onMouseEnter: () => handleEnter(index),
                    onFocus: () => setActive(index),
                    onKeyDown: (event: KeyboardEvent<HTMLElement>) =>
                        handleKeyDown(index, event),
                    role: "listitem" as const,
                    tabIndex: 0,
                    "aria-current": isActive ? ("true" as const) : undefined,
                    "aria-label": item.label,
                };

                if (item.link) {
                    return (
                        <a
                            key={`${item.label}-${index}`}
                            ref={(element) => {
                                panelRefs.current[index] = element;
                            }}
                            {...panelProps}
                            href={item.link}
                        >
                            {panelContent}
                        </a>
                    );
                }

                return (
                    <div
                        key={`${item.label}-${index}`}
                        ref={(element) => {
                            panelRefs.current[index] = element;
                        }}
                        {...panelProps}
                    >
                        {panelContent}
                    </div>
                );
            })}
        </div>
    );
}
