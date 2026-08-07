import { useSettings } from "@/hooks/use-settings";

export function WhatsAppButton() {
  const settings = useSettings();

  const whatsappNumber = settings.contact.whatsapp
    .replace(/\D/g, "")
    .replace(/^0+/, "");

  const whatsappUrl = `https://wa.me/234${whatsappNumber.replace(/^234/, "")}?text=${encodeURIComponent(
    `Hello ${settings.brand.site_name}, I'd like to make an enquiry.`,
  )}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-5 right-4 z-[60] flex size-14 items-center justify-center rounded-full bg-[#25D366] shadow-card transition-transform hover:scale-105 sm:bottom-7 sm:right-7"
    >
      <svg
        viewBox="0 0 24 24"
        className="size-7 fill-white"
        aria-hidden="true"
      >
        <path d="M12.04 2a9.9 9.9 0 0 0-8.5 15.02L2 22l5.12-1.5A9.9 9.9 0 1 0 12.04 2Zm0 1.8a8.1 8.1 0 1 1-4.13 15.06l-.3-.18-3.03.89.9-2.95-.2-.31A8.1 8.1 0 0 1 12.04 3.8Zm4.66 10.35c-.25-.13-1.48-.73-1.71-.81-.23-.09-.4-.13-.56.12-.17.25-.65.8-.8.97-.15.17-.3.19-.55.06-.25-.12-1.06-.39-2.02-1.24a7.6 7.6 0 0 1-1.4-1.74c-.15-.25-.02-.39.11-.51.12-.12.25-.3.37-.45.13-.16.17-.26.25-.43.09-.17.04-.32-.02-.45-.06-.12-.56-1.35-.77-1.85-.2-.48-.4-.42-.56-.43h-.47c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1s.9 2.43 1.03 2.6c.12.17 1.77 2.7 4.3 3.78.6.26 1.07.42 1.43.53.6.19 1.15.16 1.58.1.48-.07 1.48-.6 1.69-1.19.2-.58.2-1.08.15-1.18-.06-.11-.23-.17-.48-.29Z" />
      </svg>
    </a>
  );
}
