
import { preload } from "react-dom";
import Image from "next/image";
import { site } from "@/config/site";
import { Button } from "@/components/ui/Button";

const principles = [
  "Goal-based planning",
  "Transparent communication",
  "Long-term discipline",
];

export function Hero() {
  preload(site.media.poster, { as: "image", fetchPriority: "high" });

  return (
    <section
      className="relative overflow-hidden my-20 bg-background"
      aria-labelledby="hero-title"
    >
      <div className="container-wide grid items-center gap-10 md:grid-cols-[1.2fr_1fr] lg:gap-12">
        {/* Left content */}
        <div className="lg:col-span-1">
          <p
            className="eyebrow rise flex items-center gap-3 text-soft"
            style={{ animationDelay: "0.05s" }}
          >
            <span aria-hidden="true" className="h-[2px] w-10 bg-accent" />
            Your partner in wealth creation
          </p>

          <h1
            id="hero-title"
            className="display-xl rise mt-6"
            style={{ animationDelay: "0.15s" }}
          >
            <span className="block">Your Money.</span>
            <span className="block">Your Future.</span>
            <span className="block text-soft">Our Expertise.</span>
          </h1>

          <p
            className="lead rise mt-7 max-w-xl text-foreground/80"
            style={{ animationDelay: "0.3s" }}
          >
            Thoughtful financial planning and disciplined investment
            strategies designed to help you build, protect and grow
            your wealth with confidence.
          </p>

          <div
            className="rise mt-9 flex flex-col gap-4 sm:flex-row"
            style={{ animationDelay: "0.42s" }}
          >
            <Button href="/contact">Start Your Journey</Button>

            <Button href="#approach" variant="secondary" arrow={false}>
              Explore Our Approach
            </Button>
          </div>

          <ul
            className="rise mt-12 flex flex-wrap gap-x-7 gap-y-3 border-t border-border pt-6"
            style={{ animationDelay: "0.55s" }}
          >
            {principles.map((p) => (
              <li
                key={p}
                className="label-sub flex items-center gap-2.5 text-sm text-foreground/80"
              >
                <span
                  aria-hidden="true"
                  className="h-1.5 w-1.5 rounded-full bg-accent"
                />
                {p}
              </li>
            ))}
          </ul>
        </div>

        {/* Right image */}
        <div
          className="rise relative mx-auto  md:mb-0 mb-5 w-full max-w-[520px] lg:col-span-1 lg:ml-auto"
          style={{ animationDelay: "0.3s" }}
        >
         

          <figure className="relative rounded-[1.75rem] bg-dark p-2.5 sm:p-3.5">
            <div className="relative aspect-[16/9] overflow-hidden rounded-[1.1rem] border border-dark-border sm:aspect-[16/10] lg:aspect-[4/3]">
              <Image
                src="/images/h2.jpg"
                alt="Professional financial planning and wealth management"
                fill
                priority
                sizes="(max-width: 900px) 90vw, 40vw"
                className="object-cover"
              />
            </div>

            <figcaption className="flex items-center justify-between gap-2 px-1 pb-1.5 pt-4 text-dark-foreground sm:px-2">
              <span className="flex items-center gap-2.5">
                <span
                  aria-hidden="true"
                  className="h-2 w-2 rounded-full bg-accent"
                />
                <span className="eyebrow !text-[0.68rem] !tracking-[0.2em] text-dark-foreground/90">
                  Compounding, one step at a time
                </span>
              </span>

            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
