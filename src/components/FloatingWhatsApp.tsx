import { MessageCircle } from 'lucide-react';
import { WHATSAPP_URL } from '../lib/site-config';

type FloatingWhatsAppProps = {
  label?: string;
};

export function FloatingWhatsApp({ label = 'Chat on WhatsApp' }: FloatingWhatsAppProps) {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 inline-flex items-center gap-2 px-4 py-3 rounded-full bg-[#25D366] text-white font-semibold text-sm shadow-lg shadow-black/30 hover:bg-[#128C7E] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 motion-reduce:transition-none motion-reduce:hover:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      aria-label={label}
    >
      <MessageCircle className="w-5 h-5 shrink-0" aria-hidden />
      <span className="hidden sm:inline">{label}</span>
    </a>
  );
}
