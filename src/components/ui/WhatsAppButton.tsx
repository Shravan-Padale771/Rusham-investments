
import Image from "next/image";

export function WhatsAppButton() {
  const phoneNumber = "91XXXXXXXXXX"; // Replace with your WhatsApp number

  const message = encodeURIComponent(
    "Hello Rusham Investment, I would like to know more about your financial services."
  );

  return (
    <a
      href={`https://wa.me/${phoneNumber}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Rusham Investment on WhatsApp"
      className="
        fixed bottom-8 right-6 z-[100]
        flex h-12 w-12 items-center justify-center
        rounded-full bg-white
        shadow-lg shadow-black/15
        transition-all duration-300
        hover:scale-110 hover:shadow-xl
      "
    >
      <Image
        src="/images/wplogo.png"
        alt="WhatsApp"
        width={56}
        height={56}
        className="h-14 w-14 object-contain"
        priority
      />
    </a>
  );
}
