'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Image from 'next/image';

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <ReactMarkdown 
        remarkPlugins={[remarkGfm]}
        components={{
            // Custom renderer for images to make them responsive
            img: (props) => (
                <div className="relative w-full h-96 my-8 rounded-xl overflow-hidden">
                    <Image 
                        src={props.src || ''} 
                        alt={props.alt || ''} 
                        fill
                        className="object-cover"
                    />
                </div>
            ),
            // Add CTA style for links
            a: (props) => (
                <a {...props} className="text-primary hover:text-white font-bold underline decoration-primary/50 hover:decoration-white transition-all"/>
            )
        }}
    >
        {content || ''}
    </ReactMarkdown>
  );
}
