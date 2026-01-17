'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { MessageCircle, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function SimpleContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    message: ''
  });
  const { toast } = useToast();

  const handleWhatsAppDirect = () => {
    window.open('https://wa.me/212628438838', '_blank');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone) {
        toast({
            title: "Required fields missing",
            description: "Please enter your name and phone number.",
            variant: "destructive"
        });
        return;
    }

    const text = `Hello, I am ${formData.name}. Phone: ${formData.phone}. %0A${formData.message ? `Message: ${formData.message}` : ''}`;
    window.open(`https://wa.me/212628438838?text=${text}`, '_blank');
  };

  return (
    <div className="bg-card backdrop-blur-sm p-8 rounded-3xl border border-border shadow-md">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-primary mb-2">Get in Touch</h3>
        <p className="text-muted-foreground">Send us a message or chat on WhatsApp</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
            <Input 
                placeholder="Full Name" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="bg-background"
            />
        </div>
        <div>
            <Input 
                placeholder="Phone Number (with country code)" 
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="bg-background"
            />
        </div>
        <div>
            <Textarea 
                placeholder="Tell us about your adventure plan..." 
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                className="bg-background h-32 resize-none"
            />
        </div>

        <Button type="submit" className="w-full bg-primary text-primary-foreground font-bold py-6 text-lg">
            <Send className="mr-2 h-5 w-5" /> Send Request
        </Button>
      </form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">Or</span>
        </div>
      </div>

      <Button 
        type="button" 
        onClick={handleWhatsAppDirect}
        variant="outline" 
        className="w-full border-green-500 text-green-500 hover:bg-green-500 hover:text-white py-6 text-lg font-bold transition-all"
      >
        <MessageCircle className="mr-2 h-6 w-6" /> Chat on WhatsApp
      </Button>
    </div>
  );
}
