
"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CoinsVideo } from "@/components/ui/CoinsVideo";

const panels = [
  {
    l: "01 / YOUR FINANCIAL JOURNEY",
    h: "Every Great Future Begins With a Decision.",
    p: "Financial confidence starts with understanding where you are and where you want to go.",
    n: "01",
    footer: "START WITH A VISION",
  },
  {
    l: "02 / INVEST WITH PURPOSE",
    h: "Make Your Money Work With Purpose.",
    p: "Explore investment opportunities aligned with your financial goals, time horizon and risk profile.",
    n: "02",
    footer: "INVEST WITH PURPOSE",
  },
  {
    l: "03 / PLAN WITH CLARITY",
    h: "Build a Strategy Around Your Life.",
    p: "Every financial journey is different. Your investment strategy should reflect your priorities and aspirations.",
    n: "03",
    footer: "PLAN WITH CLARITY",
  },
  {
    l: "04 / THINK LONG TERM",
    h: "Consistency Creates Possibilities.",
    p: "Build disciplined financial habits and focus on long-term wealth creation.",
    n: "04",
    footer: "THINK LONG TERM",
  },
  {
    l: "05 / LET'S BEGIN",
    h: "Your Future Deserves a Thoughtful Plan.",
    p: "Let's start a conversation about your financial goals.",
    n: "05",
    footer: "YOUR NEXT CHAPTER",
    cta: true,
  },
];

const panelWidths = [
  "lg:w-screen",
  "lg:w-[85vw]",
  "lg:w-[85vw]",
  "lg:w-[85vw]",
  "lg:w-screen",
];

export function CinematicStory() {
  const root = useRef<HTMLElement>(null);
  const [cinematic, setCinematic] = useState(false);

  // Enable cinematic animation only on desktop.
  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px)");
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    const update = () => {
      setCinematic(desktop.matches && !reducedMotion.matches);
    };

    update();

    desktop.addEventListener("change", update);
    reducedMotion.addEventListener("change", update);

    return () => {
      desktop.removeEventListener("change", update);
      reducedMotion.removeEventListener("change", update);
    };
  }, []);

  // GSAP cinematic animation.
  useLayoutEffect(() => {
    if (!cinematic || !root.current) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(root);

      const track = q(".story-track")[0] as HTMLElement;
      const frame = q(".video-frame")[0] as HTMLElement;
      const video = q(".story-video")[0] as HTMLVideoElement;
      const intro = q(".story-intro")[0] as HTMLElement;

      if (!track || !frame || !video || !intro) return;

      const getDistance = () =>
        Math.max(0, track.scrollWidth - window.innerWidth);

      const timeline = gsap.timeline({
        defaults: {
          ease: "none",
        },
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: () =>
            `+=${Math.round(
              Math.max(window.innerHeight * 2, getDistance() * 1.15)
            )}`,
          pin: true,
          scrub: 0.4,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // Phase 1: Expand video frame using GPU-friendly transforms.
      timeline.to(
        frame,
        {
          scaleX: () => 1 / 0.44,
          scaleY: () => 1 / 0.56,
          duration: 1,
          ease: "power2.inOut",
        },
        0
      );

      // Cinematic video zoom.
      timeline.to(
        video,
        {
          scale: 1.12,
          duration: 1,
          ease: "power2.inOut",
        },
        0
      );

      // Phase 2: Introduction appears.
      timeline.fromTo(
        intro,
        {
          opacity: 0,
          y: 40,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.45,
          ease: "power2.out",
        },
        0.55
      );

      // Introduction disappears.
      timeline.to(
        intro,
        {
          opacity: 0,
          y: -30,
          duration: 0.3,
        },
        1.35
      );

      // Phase 3: Horizontal storytelling panels.
      timeline.fromTo(
        track,
        {
          x: () => window.innerWidth,
        },
        {
          x: () => -getDistance(),
          duration: 4.5,
          ease: "none",
        },
        1.2
      );

      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });
    }, root);

    return () => {
      ctx.revert();
    };
  }, [cinematic]);

  return (
    <section
      ref={root}
      id="story"
      aria-label="Your financial journey"
      className="relative bg-[#EFF9F0]"
    >
      <div
        className={
          cinematic
            ? "relative h-screen overflow-hidden bg-[#181F1C]"
            : "relative overflow-hidden bg-[#EFF9F0]"
        }
      >
        {/* =========================================
            VIDEO SECTION
        ========================================= */}

        <div
          className={
            cinematic
              ? "absolute inset-0 z-0 flex items-center justify-center"
              : "hidden"
          }
        >
          <div
            className="video-frame relative mx-auto overflow-hidden bg-[#181F1C]"
            style={
              cinematic
                ? {
                    width: "44vw",
                    height: "56vh",
                    transformOrigin: "center center",
                  }
                : {
                    width: "100%",
                    maxWidth: "1200px",
                    aspectRatio: "16 / 9",
                  }
            }
          >
            <CoinsVideo
              loading="eager"
              className="story-video absolute inset-0 h-full w-full object-cover"
            />

            <div
              className="pointer-events-none absolute inset-0 bg-black/10"
              aria-hidden="true"
            />
          </div>
        </div>

        {/* =========================================
            CENTERED INTRODUCTION
        ========================================= */}

        <div
          className={
            cinematic
              ? "story-intro pointer-events-none absolute inset-x-0 top-1/2 z-10 -translate-y-1/2 px-5 text-center text-[#EFF9F0] opacity-0 sm:px-8"
              : "story-intro pointer-events-none absolute inset-x-0 top-1/2 z-10 -translate-y-1/2 px-5 text-center text-white sm:px-8"
          }
        >
          <p className="font-head text-xs font-bold tracking-[.22em] sm:text-sm">
            THE RUSHAM INVESTMENT APPROACH
          </p>

          <h2 className="mx-auto mt-4 max-w-4xl font-display text-3xl font-bold leading-tight sm:text-5xl lg:text-6xl">
            Wealth is built one thoughtful decision at a time.
          </h2>
        </div>

        {/* =========================================
            STORY PANELS
        ========================================= */}

        <div
          className={
            cinematic
              ? "story-track absolute left-0 top-0 z-10 flex h-full w-max flex-row"
              : "story-track relative z-10 flex flex-col"
          }
        >
          {panels.map((panel, index) => {
            const dark = index % 2 === 0;

            return (
              <article
                key={panel.n}
                className={`
                  story-panel group relative flex flex-col
                  justify-between overflow-hidden
                  px-7 py-12 sm:px-12 sm:py-16
                  ${
                    cinematic
                      ? `h-full shrink-0 py-20 ${panelWidths[index]}`
                      : "min-h-[580px] sm:min-h-[620px]"
                  }
                  ${
                    dark
                      ? "bg-[#181F1C] text-[#EFF9F0]"
                      : "bg-[#EFF9F0] text-[#181F1C]"
                  }
                `}
              >
                {/* Decorative background number */}
                <span
                  aria-hidden="true"
                  className={`
                    pointer-events-none absolute -bottom-12
                    font-display text-[18rem] font-bold leading-none
                    transition-transform duration-700
                    group-hover:scale-105
                    ${
                      dark
                        ? "right-0 text-[#748B75]/15"
                        : "right-0 text-[#748B75]/20"
                    }
                  `}
                >
                  {panel.n}
                </span>

                {/* Top label */}
                <div className="relative z-10 flex items-center justify-between gap-4">
                  <p
                    className={`
                      font-head text-[10px] font-bold
                      tracking-[.2em] sm:text-xs
                      ${dark ? "text-[#EE964B]" : "text-[#748B75]"}
                    `}
                  >
                    {panel.l}
                  </p>

                  <span
                    className={`h-px w-10 sm:w-16 ${
                      dark ? "bg-[#EE964B]" : "bg-[#748B75]"
                    }`}
                  />
                </div>

                {/* Main content */}
                <div
                  className={`
                    relative z-10 my-12 max-w-3xl
                    ${!dark ? "lg:ml-auto lg:text-right" : ""}
                  `}
                >
                  <p className="mb-5 font-head text-xs font-semibold tracking-[.18em] text-[#748B75]">
                    {panel.n}
                  </p>

                  <h2 className="max-w-3xl font-display text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-7xl">
                    {panel.h}
                  </h2>

                  <p
                    className={`
                      mt-7 max-w-lg text-base font-medium
                      leading-relaxed sm:text-lg
                      ${!dark ? "lg:ml-auto" : ""}
                      ${
                        dark
                          ? "text-[#EFF9F0]/75"
                          : "text-[#181F1C]/75"
                      }
                    `}
                  >
                    {panel.p}
                  </p>

                  {/* CTA */}
                  {panel.cta && (
                    <Link
                      href="/contact"
                      className="
                        mt-9 inline-flex items-center gap-4
                        bg-[#EE964B] px-7 py-4
                        font-head text-sm font-bold text-[#181F1C]
                        transition-all duration-300
                        hover:bg-[#EFF9F0]
                      "
                    >
                      Book an Appointment
                      <span aria-hidden="true">↗</span>
                    </Link>
                  )}
                </div>

                {/* Bottom information */}
                <div
                  className={`
                    relative z-10 flex items-center
                    justify-between gap-4 border-t pt-5
                    ${
                      dark
                        ? "border-[#748B75]/40"
                        : "border-[#748B75]/50"
                    }
                  `}
                >
                  <p className="font-head text-[9px] font-bold tracking-[.16em] sm:text-[10px]">
                    RUSHAM INVESTMENT
                  </p>

                  <p className="text-right text-[9px] font-semibold tracking-[.12em] text-[#748B75] sm:text-[10px]">
                    {panel.footer}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
