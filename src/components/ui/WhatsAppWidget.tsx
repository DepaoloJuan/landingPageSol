import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send } from 'lucide-react';
import { WA_PHONE } from '../../lib/constants';

const EASE_SPRING = [0.22, 1, 0.36, 1] as [number, number, number, number];

export function WhatsAppWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 400);
    }
  }, [isOpen]);

  const handleSend = () => {
    const text = message.trim();
    const finalMessage = text
      ? text
      : '¡Hola Sol! Me gustaría obtener más información.';
    const url = `https://wa.me/${WA_PHONE}?text=${encodeURIComponent(finalMessage)}`;
    window.open(url, '_blank');
    setMessage('');
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-[100] flex flex-col items-end gap-4">

      {/* Widget panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="widget"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.35, ease: EASE_SPRING }}
            className="w-80 rounded-2xl overflow-hidden shadow-2xl border border-rose/20"
          >
            {/* Header */}
            <div className="bg-rose px-4 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">

                {/* Logo — reemplazá /images/logo-widget.png con tu imagen */}
                <div className="w-10 h-10 rounded-full overflow-hidden bg-rose-light flex items-center justify-center flex-shrink-0 border-2 border-white/30">
                  <img
                    src="/images/logo-widget.png"
                    alt="Sol Cantero"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback si la imagen no carga
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.parentElement!.innerHTML =
                        '<span class="font-brand text-white text-lg">S</span>';
                    }}
                  />
                </div>

                <div>
                  <p className="font-brand text-white text-lg leading-none">Sol Cantero</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="w-2 h-2 rounded-full bg-green-400" />
                    <span className="text-white/80 text-[10px] font-sans tracking-wide">En línea</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="text-white/70 hover:text-white transition-colors"
                aria-label="Cerrar chat"
              >
                <X size={18} />
              </button>
            </div>

            {/* Cuerpo */}
            <div className="bg-rose-light/30 px-4 py-5 flex flex-col gap-4">

              {/* Mensaje de bienvenida */}
              <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-soft max-w-[85%]">
                <p className="text-charcoal text-sm font-sans font-light leading-relaxed">
                  ¡Hola! 👋 ¿Cómo puedo ayudarte?
                </p>
              </div>

              {/* Input */}
              <div className="bg-white rounded-2xl flex items-end gap-2 px-4 py-3 shadow-soft border border-rose/10">
                <textarea
                  ref={inputRef}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Escribí tu mensaje..."
                  rows={2}
                  className="flex-1 resize-none text-sm font-sans font-light text-charcoal placeholder:text-charcoal/30 focus:outline-none bg-transparent leading-relaxed"
                />
                <button
                  onClick={handleSend}
                  aria-label="Enviar mensaje por WhatsApp"
                  className="w-9 h-9 rounded-full bg-rose hover:bg-rose-dark flex items-center justify-center flex-shrink-0 transition-colors duration-300 mb-0.5"
                >
                  <Send size={15} className="text-white translate-x-px" />
                </button>
              </div>

              <p className="text-center text-[10px] text-charcoal/30 font-sans tracking-wide">
                Continúa en WhatsApp
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Botón flotante */}
      <motion.button
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Abrir chat de WhatsApp"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="relative group"
      >
        <div className="absolute inset-0 bg-rose rounded-full animate-ping opacity-25" />
        <div className="relative bg-rose text-white p-4 rounded-full shadow-lg transition-all duration-300 group-hover:shadow-[0_0_20px_rgba(232,160,176,0.6)]">
          <AnimatePresence mode="wait" initial={false}>
            {isOpen ? (
              <motion.span
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X size={28} />
              </motion.span>
            ) : (
              <motion.span
                key="open"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {/* Icono WhatsApp SVG */}
                <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </motion.button>

    </div>
  );
}