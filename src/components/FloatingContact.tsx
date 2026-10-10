import React from "react";
import { FaWhatsapp, FaPhone } from "react-icons/fa";
import { MessageSquareText } from "lucide-react";

export function FloatingContact() {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      <a 
        href="https://wa.me/61435304821"
        target="_blank"
        rel="noreferrer"
        className="w-14 h-14 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-lg hover:-translate-y-1 transition-transform"
        aria-label="Contact on WhatsApp"
        data-testid="btn-float-whatsapp"
      >
        <FaWhatsapp size={28} />
      </a>
      
      <a 
        href="sms:0435304821"
        className="w-14 h-14 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg hover:-translate-y-1 transition-transform"
        aria-label="Send SMS"
        data-testid="btn-float-sms"
      >
        <MessageSquareText size={24} />
      </a>
      
      <a 
        href="tel:0435304821"
        className="w-14 h-14 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-lg hover:-translate-y-1 transition-transform"
        aria-label="Call Now"
        data-testid="btn-float-phone"
      >
        <FaPhone size={24} />
      </a>
    </div>
  );
}
