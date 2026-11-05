
export function CoinsVideo({
  className = "",
  loading = "eager",
}: {
  className?: string;
  loading?: "eager" | "lazy";
}) {
  return (
    <video
      className={className}
      muted
      autoPlay
      loop
      playsInline
      preload={loading === "eager" ? "auto" : "metadata"}
    >
      <source src="/videos/coins.mp4" type="video/mp4" />
    </video>
  );
}
