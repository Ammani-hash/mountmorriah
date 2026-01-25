import { useRef, useEffect, useState } from "react";
import { ScrapbookItemCard } from "@/components/ScrapbookItemCard";

interface ScrapbookItem {
  id: number;
  imageUrl: string;
  caption: string | null;
  width: number | null;
  alignment: string | null;
  offset: string | null;
}

export default function Home() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isResetting = useRef(false);

  // State to track if we've done the initial scroll position setup
  const [isInitialized, setIsInitialized] = useState(false);

  // Auto-scroll refs
  const scrollDirection = useRef<'down' | 'up'>('down');
  const autoScrollRef = useRef<number | null>(null);
  const userScrollTimeout = useRef<NodeJS.Timeout | null>(null);

  // Default items using local static images
  const displayItems: ScrapbookItem[] = [
    { id: 1, imageUrl: `${import.meta.env.BASE_URL}assets/1.jpg`, caption: "Analog moments", width: 400, alignment: "left", offset: "pos" },
    { id: 2, imageUrl: `${import.meta.env.BASE_URL}assets/2.jpg`, caption: "Mountain hikes", width: 350, alignment: "right", offset: "neg" },
    { id: 3, imageUrl: `${import.meta.env.BASE_URL}assets/3.jpg`, caption: "City lights", width: 500, alignment: "center", offset: "none" },
    { id: 4, imageUrl: `${import.meta.env.BASE_URL}assets/4.jpg`, caption: "Raw textures", width: 300, alignment: "left", offset: "pos" },
    { id: 7, imageUrl: `${import.meta.env.BASE_URL}assets/7.jpg`, caption: "Golden hour", width: 380, alignment: "right", offset: "neg" },
    { id: 8, imageUrl: `${import.meta.env.BASE_URL}assets/8.jpg`, caption: "Urban escape", width: 450, alignment: "left", offset: "pos" },
    { id: 9, imageUrl: `${import.meta.env.BASE_URL}assets/9.jpg`, caption: "Quiet corners", width: 320, alignment: "center", offset: "none" },
    { id: 10, imageUrl: `${import.meta.env.BASE_URL}assets/10.jpg`, caption: "Film grain", width: 400, alignment: "right", offset: "neg" },
    { id: 11, imageUrl: `${import.meta.env.BASE_URL}assets/11.jpg`, caption: "Lost tapes", width: 360, alignment: "left", offset: "pos" },
    { id: 12, imageUrl: `${import.meta.env.BASE_URL}assets/12.jpg`, caption: "Faded memory", width: 420, alignment: "center", offset: "none" },
    { id: 13, imageUrl: `${import.meta.env.BASE_URL}assets/13.jpg`, caption: "Last frame", width: 380, alignment: "right", offset: "neg" },
  ];

  // Infinite Scroll Logic
  useEffect(() => {
    const container = scrollRef.current;
    if (!container || displayItems.length === 0) return;

    // We render 3 sets: [Set A] [Set B] [Set C]
    // Initial position should be at start of Set B
    const singleSetHeight = container.scrollHeight / 3;

    if (!isInitialized) {
      container.scrollTop = singleSetHeight;
      setIsInitialized(true);
    }

    const handleScroll = () => {
      if (isResetting.current) return;

      // Recalculate fresh each time - images may have loaded
      const currentSingleSetHeight = container.scrollHeight / 3;
      const scrollTop = container.scrollTop;
      // Dynamic buffer: 10% of viewport height or minimum 100px for better edge detection
      const buffer = Math.max(100, container.clientHeight * 0.1);

      // Check if we need to reset position
      if (scrollTop <= buffer || scrollTop >= currentSingleSetHeight * 2 - buffer) {
        isResetting.current = true;

        // Use requestAnimationFrame for smoother visual updates
        requestAnimationFrame(() => {
          // Read CURRENT scroll position inside rAF
          const currentScrollTop = container.scrollTop;
          const freshSetHeight = container.scrollHeight / 3;

          // If we scroll into Set A (top set), jump to corresponding point in Set B
          if (currentScrollTop <= buffer) {
            container.scrollTop = currentScrollTop + freshSetHeight;
          }
          // If we scroll into Set C (bottom set), jump to corresponding point in Set B
          else if (currentScrollTop >= freshSetHeight * 2 - buffer) {
            container.scrollTop = currentScrollTop - freshSetHeight;
          }

          // Longer delay before allowing next reset
          setTimeout(() => {
            isResetting.current = false;
          }, 50);
        });
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [displayItems, isInitialized]);

  // Auto-scroll effect
  useEffect(() => {
    const container = scrollRef.current;
    if (!container || !isInitialized) return;

    const SCROLL_SPEED = 2; // pixels per frame
    const PAUSE_DURATION = 1500; // ms to pause after user interaction

    // Auto-scroll animation loop
    const autoScroll = () => {
      if (!container) return;
      const delta = scrollDirection.current === 'down' ? SCROLL_SPEED : -SCROLL_SPEED;
      container.scrollTop += delta;
      autoScrollRef.current = requestAnimationFrame(autoScroll);
    };

    const startAutoScroll = () => {
      if (autoScrollRef.current) return;
      autoScrollRef.current = requestAnimationFrame(autoScroll);
    };

    const stopAutoScroll = () => {
      if (autoScrollRef.current) {
        cancelAnimationFrame(autoScrollRef.current);
        autoScrollRef.current = null;
      }
      if (userScrollTimeout.current) {
        clearTimeout(userScrollTimeout.current);
      }
      userScrollTimeout.current = setTimeout(startAutoScroll, PAUSE_DURATION);
    };

    // Detect user scroll direction via wheel event
    const handleWheel = (e: WheelEvent) => {
      scrollDirection.current = e.deltaY > 0 ? 'down' : 'up';
      stopAutoScroll();
    };

    // Handle touch events for mobile
    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
      stopAutoScroll();
    };
    const handleTouchMove = (e: TouchEvent) => {
      const touchY = e.touches[0].clientY;
      scrollDirection.current = touchY < touchStartY ? 'down' : 'up';
      touchStartY = touchY;
    };

    // Initialize and start
    container.addEventListener('wheel', handleWheel, { passive: true });
    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: true });
    startAutoScroll();

    return () => {
      container.removeEventListener('wheel', handleWheel);
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      if (autoScrollRef.current) cancelAnimationFrame(autoScrollRef.current);
      if (userScrollTimeout.current) clearTimeout(userScrollTimeout.current);
    };
  }, [isInitialized]);

  return (
    <div className="h-screen w-full overflow-hidden relative bg-[#E6E1D3]">
      {/* Fixed Center Text - Core Design Element */}
      <div className="fixed-center-text font-bold">
        I make videos for the internet that get people excited about living in the real world.
      </div>

      {/* Fixed Footer Navigation */}
      <div className="fixed-footer">
        <a href="#">Youtube</a>
        <a href="#">Newsletter</a>
        <a href="#">Work With Me</a>
        <a href="#">Contact</a>
      </div>

      {/* Main Scroll Container */}
      <div
        ref={scrollRef}
        className="h-full w-full overflow-y-auto no-scrollbar"
        style={{ scrollBehavior: 'auto', willChange: 'scroll-position' }}
      >
        <div className="flex flex-col w-full px-8 md:px-16 lg:px-24 py-20 min-h-screen">
          {/* Render 3 sets for infinite loop illusion */}
          {[0, 1, 2].map((setIndex) => (
            <div key={`set-${setIndex}`} className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16 lg:gap-20 w-full pb-20">
              {displayItems.map((item, index) => (
                <ScrapbookItemCard
                  key={`${setIndex}-${item.id}`}
                  item={item}
                  index={index}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
