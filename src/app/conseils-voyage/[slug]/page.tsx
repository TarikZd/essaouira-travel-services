
import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { MarkdownRenderer } from '@/components/ui/markdown-renderer';
import { ArrowLeft, Calendar, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const revalidate = 3600;
export const runtime = 'edge';

async function getArticle(slug: string) {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single();

  if (error || !data) {
    return null;
  }
  return data;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) return { title: 'Article introuvable' };

  return {
    title: article.seo_title || `${article.title} | Conseils Voyage`,
    description: article.seo_description || article.excerpt || '',
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) {
    notFound();
  }

  return (
    <article className="min-h-screen bg-black text-white pb-24">
      {/* Hero Header */}
      <div className="relative h-[50vh] w-full bg-gray-900 overflow-hidden">
        {article.cover_image && (
             // Replace with Next/Image using a valid loader or domain config
            <Image 
                src={article.cover_image} 
                alt={article.title} 
                fill
                className="absolute inset-0 w-full h-full object-cover opacity-60"
                priority
            />

        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
        
        <div className="absolute bottom-0 left-0 w-full p-8 md:p-16">
            <div className="container mx-auto max-w-4xl">
                <Link href="/conseils-voyage" className="inline-flex items-center text-primary hover:text-white mb-6 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Retour aux guides
                </Link>
                <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                    <span className="bg-primary/20 text-primary px-3 py-1 rounded-full font-bold">
                        {article.category}
                    </span>
                    <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(article.created_at).toLocaleDateString('fr-FR')}
                    </span>
                    <span className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        Essaouira Travel
                    </span>
                </div>
                <h1 className="font-headline text-3xl md:text-5xl font-bold text-white leading-tight">
                    {article.title}
                </h1>
            </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 max-w-4xl py-12">
        <div className="prose prose-lg prose-invert mx-auto">
             <MarkdownRenderer content={article.content} />
        </div>

        {/* Dynamic CTA at bottom */}
        <div className="mt-20 p-8 md:p-12 bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 rounded-3xl text-center">
            <h3 className="text-2xl font-bold text-white mb-4">
                Envie de découvrir cela par vous-même ?
            </h3>
            <p className="text-gray-400 mb-8 max-w-xl mx-auto">
                Nous pouvons organiser votre transport privé ou votre excursion sur mesure pour que vous profitiez à 100% sans stress.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-primary text-black hover:bg-white font-bold">
                    Réserver un chauffeur
                </Button>
                <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                    Contacter sur WhatsApp
                </Button>
            </div>
        </div>
      </div>
    </article>
  );
}
