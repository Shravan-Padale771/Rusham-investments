
import Link from "next/link";
import Image from "next/image";
import { site } from "@/config/site";

export function LogoMark({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <Image
      src="/images/logo.png"
      alt={`${site.name} logo`}
      width={180}
      height={60}
      className={className}
      priority
    />
  );
}

export function Logo({ tone = "light" }: { tone?: "light" | "dark" }) {
  const onDark = tone === "dark";

  return (
    <Link
      href="/"
      aria-label={`${site.name} — home`}
      className={`group inline-flex items-center ${
        onDark ? "text-dark-foreground" : "text-foreground"
      }`}
    >
      <Image
        src="/images/logo.png"
        alt={`${site.name} logo`}
        width={300}
        height={100}
        priority
        className="h-16 w-auto object-contain sm:h-[76px]"
      />
    </Link>
  );
}

