import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { API_URL } from '../../lib/constants';

interface PopupData {
  activo: boolean;
  imagen_url: string | null;
  imagen_url_fallback: string | null;
  texto: string | null;
}

export function Popup() {
  const [popup, setPopup] = useState<PopupData | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // No mostrar si ya se vio en esta sesión
    const yaVisto = sessionStorage.getItem('sc_popup_seen');
    if (yaVisto) return;

    fetch(`${API_URL}/api/landing/popup`)
      .then(res => res.json())
      .then(data => {
        if (data.activo && (data.texto || data.imagen_url || data.imagen_url_fallback)) {
          setPopup(data);
          setVisible(true);
        }
      })
      .catch(() => {});
  }, []);

  const cerrar = () => {
    setVisible(false);
    sessionStorage.setItem('sc_popup_seen', '1');
  };

  return (
    <AnimatePresence>
      {visible && popup && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-charcoal/60 backdrop-blur-sm p-4"
          onClick={cerrar}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 24 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Imagen si existe */}
            {(popup.imagen_url || popup.imagen_url_fallback) && (
              <div className="w-full overflow-hidden">
                <img
                  src={popup.imagen_url || popup.imagen_url_fallback!}
                  alt="Promoción Sol Cantero"
                  className="w-full h-auto"
                  onError={(e) => {
                    if (popup.imagen_url_fallback) {
                      e.currentTarget.src = popup.imagen_url_fallback;
                    }
                  }}
                />
              </div>
            )}

            {/* Texto */}
            <div className="p-8 relative">
              <button
                onClick={cerrar}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-charcoal/40 hover:text-charcoal transition-colors rounded-full hover:bg-charcoal/5"
              >
                <X size={18} />
              </button>

              {popup.texto && (
                <p className="text-charcoal text-lg font-light leading-relaxed pr-8">
                  {popup.texto}
                </p>
              )}

              <button
                onClick={cerrar}
                className="mt-6 w-full bg-charcoal text-beige py-3 rounded-2xl font-sans font-medium tracking-wider text-sm hover:bg-charcoal-light transition-colors duration-300"
              >
                ¡Entendido!
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}