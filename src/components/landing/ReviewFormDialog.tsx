'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Star, Loader2, Send } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

const formSchema = z.object({
  author_name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  rating: z.number().min(1, 'La note doit être au moins de 1').max(5),
  review_text: z.string().min(10, 'Votre avis doit contenir au moins 10 caractères'),
});

export function ReviewFormDialog() {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      author_name: '',
      rating: 5,
      review_text: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('reviews')
        .insert([
          {
            author_name: values.author_name,
            rating: values.rating,
            review_text: values.review_text,
            status: 'pending', // Reviews need approval
          },
        ]);

      if (error) throw error;

      toast({
        title: 'Avis envoyé !',
        description: 'Merci pour votre retour. Il sera publié après modération.',
      });
      setOpen(false);
      form.reset();
    } catch (error) {
      console.error('Error submitting review:', error);
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: "Impossible d'envoyer votre avis. Veuillez réessayer.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="border-primary/20 hover:bg-primary/10 text-primary">
          Écrire un avis
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-[#0b0f19] border-white/10 text-white">
        <DialogHeader>
          <DialogTitle>Partagez votre expérience</DialogTitle>
          <DialogDescription className="text-gray-400">
            Votre avis nous aide à nous améliorer et aide les futurs voyageurs.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Note globale</FormLabel>
                  <FormControl>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-8 h-8 cursor-pointer transition-colors ${
                            star <= field.value
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-600'
                          }`}
                          onClick={() => field.onChange(star)}
                        />
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="author_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Votre Nom</FormLabel>
                  <FormControl>
                    <Input placeholder="Jean Dupont" {...field} className="bg-white/5 border-white/10 text-white" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="review_text"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Votre Avis</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Racontez-nous votre trajet..."
                      className="resize-none bg-white/5 border-white/10 text-white min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmitting} className="w-full bg-primary text-black hover:bg-primary/90">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Envoi...
                </>
              ) : (
                <>
                  Envoyer mon avis
                  <Send className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
