import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#E6E1D3] p-4">
      <Card className="w-full max-w-md mx-auto bg-[#E6E1D3] border-2 border-stone-800 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <CardContent className="pt-6">
          <div className="flex mb-4 gap-2 text-stone-800 items-center justify-center">
            <AlertCircle className="h-8 w-8" />
            <h1 className="text-2xl font-bold font-mono tracking-tighter">404 Page Not Found</h1>
          </div>

          <p className="mt-4 text-center font-mono text-sm text-stone-600 mb-8">
            The page you're looking for has been ripped out of the book.
          </p>

          <Link href="/" className="block w-full text-center py-3 bg-stone-800 text-[#E6E1D3] hover:bg-stone-900 transition-colors uppercase font-mono tracking-widest text-sm font-bold">
            Return to Scrapbook
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
