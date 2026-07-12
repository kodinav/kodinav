import { MessageCircle } from "lucide-react";
import { site } from "@/data/site";

/**
 * Always-visible WhatsApp button for the ad landing pages: paid traffic often
 * prefers an instant chat over a form, and every extra path to contact pays.
 */
export function WhatsAppFab() {
  return (
    <a
      href={site.whatsapp}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Chat on WhatsApp (${site.phone})`}
      className="fixed right-[calc(1.25rem+env(safe-area-inset-right))] bottom-[calc(1.25rem+env(safe-area-inset-bottom))] z-40 flex size-13 items-center justify-center border border-[#1da851] bg-[#25d366] text-[#083a20] shadow-[6px_6px_0_0_rgba(22,20,15,0.35)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#1da851] hover:text-[#eafff2] active:scale-95"
    >
      <MessageCircle className="size-6" aria-hidden />
    </a>
  );
}
