'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, BookOpen } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';

type Article = {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    cover_image: string;
    category: string;
    created_at: string;
};

export default function LatestArticles() {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchArticles = async () => {
            const { data, error } = await supabase
                .from('articles')
                .select('id, title, slug, excerpt, cover_image, category, created_at')
                .eq('is_published', true)
                .order('created_at', { ascending: false })
                .limit(3);

            if (error) {
                console.error('Error fetching articles:', error);
            } else {
                setArticles(data || []);
            }
            setLoading(false);
        };

        fetchArticles();
    }, []);

    if (loading) {
        return <div className="py-24 bg-black/95"><div className="container mx-auto px-4"><div className="h-96 bg-white/5 animate-pulse rounded-xl" /></div></div>;
    }

    if (articles.length === 0) return null;

    return (
        <section id="latest-articles" className="py-24 bg-black/95 border-t border-white/5">
            <div className="container mx-auto px-4">
                 <div className="text-center mb-16">
                    <div className="inline-block p-3 rounded-full bg-primary/10 mb-6">
                        <BookOpen className="w-8 h-8 text-primary" />
                    </div>
                    <h2 className="font-headline text-3xl md:text-5xl font-bold text-white mb-4">
                        Conseils & <span className="text-primary">Guides</span>
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        Découvrez nos derniers articles pour préparer votre voyage au Maroc. Prix taxis, astuces et itinéraires.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {articles.map((article) => (
                        <Card key={article.id} className="group bg-white/5 border-white/10 overflow-hidden hover:border-primary/50 transition-all duration-300">
                             <CardHeader className="p-0 relative h-48 overflow-hidden">
                                <Link href={`/conseils-voyage/${article.slug}`}>
                                     {article.cover_image ? (
                                        <div className="relative h-full w-full">
                                            <Image 
                                                src={article.cover_image}
                                                alt={article.title}
                                                fill
                                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                                        </div>
                                     ) : (
                                        <div className="h-full w-full bg-gray-800 flex items-center justify-center">
                                            <BookOpen className="w-12 h-12 text-gray-600" />
                                        </div>
                                     )}
                                </Link>
                                <div className="absolute top-4 left-4 z-20">
                                    <span className="bg-primary text-black text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                        {article.category || 'Guide'}
                                    </span>
                                </div>
                             </CardHeader>
                             <CardContent className="p-6">
                                <Link href={`/conseils-voyage/${article.slug}`}>
                                    <h3 className="font-headline text-xl text-white font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                                        {article.title}
                                    </h3>
                                </Link>
                                <p className="text-gray-400 text-sm line-clamp-3 leading-relaxed">
                                    {article.excerpt}
                                </p>
                             </CardContent>
                             <CardFooter className="p-6 pt-0">
                                <Link href={`/conseils-voyage/${article.slug}`} className="text-primary hover:text-white text-sm font-bold flex items-center transition-colors">
                                    Lire l'article <ArrowRight className="ml-2 w-4 h-4" />
                                </Link>
                             </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
