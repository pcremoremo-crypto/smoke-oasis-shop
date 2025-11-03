import { FaWhatsapp } from "react-icons/fa";

export const WhatsAppButton = () => {
  const phoneNumber = "573203430234"; // Reemplaza con tu número de WhatsApp
  const message = "Hola, estoy interesado en tus productos."; // Mensaje predeterminado

  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-colors duration-300 flex items-center justify-center"
      aria-label="Contactar por WhatsApp"
    >
      <FaWhatsapp size={28} />
    </a>
  );
};
