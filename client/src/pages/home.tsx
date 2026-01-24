import { useRef, useEffect, useState } from "react";
import { useScrapbookItems, useDeleteScrapbookItem } from "@/hooks/use-scrapbook";
import { ScrapbookItemCard } from "@/components/ScrapbookItemCard";
import { AddScrapbookDialog } from "@/components/AddScrapbookDialog";
import { Loader2, AlertCircle } from "lucide-react";
import { type ScrapbookItem } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { data: items, isLoading, error } = useScrapbookItems();
  const { mutate: deleteItem } = useDeleteScrapbookItem();
  const { toast } = useToast();
  
  // State to track if we've done the initial scroll position setup
  const [isInitialized, setIsInitialized] = useState(false);

  // Default items if empty to show the style
  const defaultItems: ScrapbookItem[] = [
    { id: 1, imageUrl: "https://images.unsplash.com/photo-1516961642265-531546e84af2?q=80&w=1000&auto=format&fit=crop", caption: "Analog moments", width: 400, alignment: "left", offset: "pos" },
    { id: 2, imageUrl: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=1000&auto=format&fit=crop", caption: "Mountain hikes", width: 350, alignment: "right", offset: "neg" },
    { id: 3, imageUrl: "https://images.unsplash.com/photo-1504198458649-3128b932f49e?q=80&w=1000&auto=format&fit=crop", caption: "City lights", width: 500, alignment: "center", offset: "none" },
    { id: 4, imageUrl: "https://images.unsplash.com/photo-1516233758813-a38d024919c5?q=80&w=1000&auto=format&fit=crop", caption: "Raw textures", width: 300, alignment: "left", offset: "pos" },
  ];

  const displayItems = (items && items.length > 0) ? items : defaultItems;

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to rip this page out?")) {
      deleteItem(id, {
        onSuccess: () => toast({ title: "Deleted", description: "Item removed from scrapbook." }),
        onError: () => toast({ title: "Error", description: "Could not delete item.", variant: "destructive" }),
      });
    }
  };

  // Infinite Scroll Logic
  useEffect(() => {
    const container = scrollRef.current;
    if (!container || isLoading || displayItems.length === 0) return;

    // We render 3 sets: [Set A] [Set B] [Set C]
    // Initial position should be at start of Set B
    const singleSetHeight = container.scrollHeight / 3;

    if (!isInitialized) {
      container.scrollTop = singleSetHeight;
      setIsInitialized(true);
    }

    const handleScroll = () => {
      const scrollTop = container.scrollTop;
      const buffer = 50; // Small buffer to prevent glitching at exact edges

      // If we scroll into Set A (top set), jump to corresponding point in Set B
      if (scrollTop <= buffer) {
        container.scrollTop = scrollTop + singleSetHeight;
      }
      // If we scroll into Set C (bottom set), jump to corresponding point in Set B
      else if (scrollTop >= singleSetHeight * 2 - buffer) {
        container.scrollTop = scrollTop - singleSetHeight;
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [isLoading, displayItems, isInitialized]);

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#E6E1D3]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-stone-800" />
          <p className="font-mono uppercase tracking-widest text-xs">Loading Memories...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#E6E1D3] text-red-800">
        <div className="flex flex-col items-center gap-4 p-8 border-2 border-red-800">
          <AlertCircle className="w-8 h-8" />
          <p className="font-mono uppercase tracking-widest text-sm">Error Loading Scrapbook</p>
          <p className="font-mono text-xs">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full overflow-hidden relative bg-[#E6E1D3]">
      {/* Fixed Center Text - Core Design Element */}
      <div className="fixed-center-text font-bold">
        I make videos for the internet that get people excited about living in the real world.
      </div>

      {/* Main Scroll Container */}
      <div 
        ref={scrollRef}
        className="h-full w-full overflow-y-auto no-scrollbar scroll-smooth"
        style={{ scrollBehavior: 'auto' }} // auto needed for instant jumps
      >
        <div className="flex flex-col w-full max-w-4xl mx-auto px-4 py-20 min-h-screen">
          {/* Render 3 sets for infinite loop illusion */}
          {[0, 1, 2].map((setIndex) => (
            <div key={`set-${setIndex}`} className="flex flex-col w-full pb-20">
              {displayItems.map((item, index) => (
                <ScrapbookItemCard 
                  key={`${setIndex}-${item.id}`} 
                  item={item} 
                  index={index}
                  onDelete={setIndex === 1 ? handleDelete : undefined} // Only enable interactions on middle set ideally, but for now enabling on middle set
                  isAdmin={true} // Assuming admin for demo
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      <AddScrapbookDialog />
    </div>
  );
}
