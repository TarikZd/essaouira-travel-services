import Link from 'next/link';
import { AlertTriangle, Home, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorPageProps {
  error?: Error;
  reset?: () => void;
  title?: string;
  description?: string;
}

export default function ErrorPage({ 
  error, 
  reset, 
  title = "Something went wrong",
  description = "We encountered an unexpected error. Don't worry, our team has been notified."
}: ErrorPageProps) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        {/* Error Icon */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-destructive/20 blur-xl rounded-full"></div>
            <div className="relative bg-destructive/10 p-6 rounded-full">
              <AlertTriangle className="w-16 h-16 text-destructive" />
            </div>
          </div>
        </div>

        {/* Error Message */}
        <h1 className="text-4xl font-bold text-foreground mb-4">
          {title}
        </h1>
        <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
          {description}
        </p>

        {/* Error Details (Development Only) */}
        {process.env.NODE_ENV === 'development' && error && (
          <div className="mb-8 p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-left max-w-xl mx-auto">
            <p className="font-mono text-sm text-destructive mb-2">
              <strong>Error:</strong> {error.message}
            </p>
            {error.stack && (
              <details className="mt-2">
                <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground">
                  View Stack Trace
                </summary>
                <pre className="mt-2 text-xs text-muted-foreground overflow-x-auto whitespace-pre-wrap">
                  {error.stack}
                </pre>
              </details>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          {reset && (
            <Button 
              onClick={reset}
              size="lg"
              className="gap-2"
            >
              <RefreshCcw className="w-4 h-4" />
              Try Again
            </Button>
          )}
          
          <Button 
            variant="outline" 
            size="lg"
            asChild
            className="gap-2"
          >
            <Link href="/">
              <Home className="w-4 h-4" />
              Go Home
            </Link>
          </Button>
        </div>

        {/* Help Text */}
        <p className="mt-8 text-sm text-muted-foreground">
          If this problem persists, please{' '}
          <Link href="/#contact" className="text-primary hover:underline">
            contact our support team
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
