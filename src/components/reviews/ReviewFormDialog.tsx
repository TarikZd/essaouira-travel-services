'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Star } from 'lucide-react';
import { initializeFirebase } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface ReviewFormDialogProps {
  children: React.ReactNode;
}

export function ReviewFormDialog({ children }: ReviewFormDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rating, setRating] = useState(5);
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    fullName: '',
    country: '',
    email: '',
    text: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { firestore } = initializeFirebase();
      
      await addDoc(collection(firestore, 'reviews'), {
        ...formData,
        rating,
        createdAt: serverTimestamp(),
        status: 'pending', // Optional: for moderation
      });

      toast({
        title: "Avis envoyé !",
        description: "Merci pour votre retour. Votre avis sera publié après modération.",
      });

      setOpen(false);
      setFormData({ fullName: '', country: '', email: '', text: '' });
      setRating(5);
    } catch (error) {
      console.error('Error submitting review:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'envoi de votre avis. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white text-gray-900">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Écrire un avis</DialogTitle>
          <DialogDescription>
            Partagez votre expérience avec nous. Votre retour est précieux.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Nom complet</Label>
            <Input 
              id="fullName" 
              name="fullName" 
              placeholder="Jean Dupont" 
              required 
              value={formData.fullName}
              onChange={handleInputChange}
              className="bg-white text-black border-gray-200 focus:border-primary focus:ring-primary"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-2">
                <Label htmlFor="country">Pays</Label>
                <Input 
                  id="country" 
                  name="country" 
                  placeholder="France" 
                  required 
                  value={formData.country}
                  onChange={handleInputChange}
                  className="bg-white text-black border-gray-200 focus:border-primary focus:ring-primary"
                />
             </div>
             <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  name="email" 
                  type="email" 
                  placeholder="jean@example.com" 
                  required 
                  value={formData.email}
                  onChange={handleInputChange}
                  className="bg-white text-black border-gray-200 focus:border-primary focus:ring-primary"
                />
             </div>
          </div>

          <div className="space-y-2">
            <Label>Note</Label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="focus:outline-none"
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(null)}
                  onClick={() => setRating(star)}
                >
                  <Star 
                    className={cn(
                      "w-8 h-8 transition-colors",
                      (hoveredRating !== null ? star <= hoveredRating : star <= rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    )} 
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="text">Votre avis</Label>
            <Textarea 
              id="text" 
              name="text" 
              placeholder="Racontez-nous votre expérience..." 
              required 
              value={formData.text}
              onChange={handleInputChange}
              className="resize-none h-32 bg-white text-black border-gray-200 focus:border-primary focus:ring-primary"
            />
          </div>

          <DialogFooter className="mt-4">
            <Button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary/90 text-black font-bold">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Envoyer mon avis
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
