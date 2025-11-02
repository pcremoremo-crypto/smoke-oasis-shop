import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FaTwitter, FaFacebook, FaInstagram } from "react-icons/fa";
import { toast } from 'sonner';
import emailjs from '@emailjs/browser';

export function ContactPage() {
  const [formData, setFormData] = useState({
    from_name: '',
    from_email: '',
    message: '',
  });
  const [isSending, setIsSending] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);

    // Replace with your EmailJS service ID, template ID, and public key
    const serviceId = 'YOUR_SERVICE_ID'; 
    const templateId = 'YOUR_TEMPLATE_ID';
    const publicKey = 'YOUR_PUBLIC_KEY';

    if (serviceId === 'YOUR_SERVICE_ID' || templateId === 'YOUR_TEMPLATE_ID' || publicKey === 'YOUR_PUBLIC_KEY') {
      toast.error('Error de configuración', {
        description: 'Por favor, configura tus credenciales de EmailJS en src/pages/Contact.tsx',
      });
      setIsSending(false);
      return;
    }

    try {
      await emailjs.send(serviceId, templateId, formData, publicKey);
      toast.success('Mensaje enviado', {
        description: 'Tu mensaje ha sido enviado con éxito. Nos pondremos en contacto pronto.',
      });
      setFormData({ from_name: '', from_email: '', message: '' });
    } catch (error) {
      console.error('Error al enviar el mensaje:', error);
      toast.error('Error al enviar el mensaje', {
        description: 'Hubo un problema al enviar tu mensaje. Inténtalo de nuevo más tarde.',
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <div className="grid md:grid-cols-2 gap-12">
        <div className="space-y-6">
          <h1 className="text-4xl font-bold">Contáctanos</h1>
          <p className="text-muted-foreground text-lg">
            ¿Tienes alguna pregunta o comentario? Rellena el formulario y nos pondremos en contacto contigo lo antes posible.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input 
              type="text" 
              placeholder="Nombre" 
              name="from_name"
              value={formData.from_name}
              onChange={handleChange}
              required
            />
            <Input 
              type="email" 
              placeholder="Email" 
              name="from_email"
              value={formData.from_email}
              onChange={handleChange}
              required
            />
            <Textarea 
              placeholder="Tu mensaje" 
              rows={5} 
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
            />
            <Button type="submit" size="lg" disabled={isSending}>
              {isSending ? 'Enviando...' : 'Enviar Mensaje'}
            </Button>
          </form>
        </div>
        <div className="space-y-6 rounded-lg bg-muted/40 p-8">
          <h2 className="text-3xl font-bold">Nuestras Redes</h2>
          <p className="text-muted-foreground">
            Síguenos en nuestras redes sociales para estar al día de las últimas novedades y ofertas.
          </p>
          <div className="flex space-x-4">
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors"><FaTwitter size={28} /></a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors"><FaFacebook size={28} /></a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors"><FaInstagram size={28} /></a>
          </div>
        </div>
      </div>
    </div>
  );
}