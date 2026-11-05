import Image from "next/image";

export function AboutHero() {
  return (
    <section className="overflow-hidden bg-background pb-20 pt-12 sm:pt-16 lg:pb-28" aria-labelledby="about-title">
      <div className="container-x grid items-center gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-7">
          <p className="eyebrow rise flex items-center gap-3 text-soft">
            <span aria-hidden="true" className="h-[2px] w-10 bg-accent" />
            About Rusham Investment
          </p>
          <h1 id="about-title" className="display-xl rise mt-6" style={{ animationDelay: "0.1s" }}>
            More Than Investments. A Commitment to Your Financial Future.
          </h1>
          <p className="lead rise mt-7 max-w-xl text-foreground/80" style={{ animationDelay: "0.25s" }}>
            Thoughtful guidance, informed decisions and a long-term approach to wealth creation.
          </p>
        </div>

        <div className="rise relative lg:col-span-5" style={{ animationDelay: "0.2s" }}>
          <div aria-hidden="true" className="absolute -left-4 top-10 h-full w-full rounded-[2rem] bg-sage-bg sm:-left-6" />
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-muted">
            <Image
              src="/images/rahul.png"
              alt="An advisory desk with a notebook, pen, calculator and a small plant in soft natural light"
              fill
              priority
              sizes="(min-width: 1024px) 40vw, 90vw"
              className="object-cover"
            />
          </div>
          <div className="absolute -bottom-5 right-4 grid h-24 w-24 place-items-center rounded-full bg-accent text-center sm:-right-4 sm:h-28 sm:w-28">
            <span className="eyebrow !text-[0.6rem] !tracking-[0.14em] text-dark">
              Clarity
              <br />
              over noise
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
