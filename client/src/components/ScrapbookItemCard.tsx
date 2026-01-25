import { cn } from "@/lib/utils";

interface ScrapbookItem {
  id: number;
  imageUrl: string;
  caption: string | null;
  width: number | null;
  alignment: string | null;
  offset: string | null;
}

interface ScrapbookItemProps {
  item: ScrapbookItem;
  index: number;
}

export function ScrapbookItemCard({ item, index }: ScrapbookItemProps) {
  // Deterministic layout based on index if not provided in DB
  const alignment = item.alignment || (index % 3 === 0 ? "left" : index % 3 === 1 ? "center" : "right");
  const offset = item.offset || (index % 2 === 0 ? "pos" : "neg");

  // Column-based stagger for 3-column layout (desktop only)
  const columnIndex = index % 3;
  const staggerClass =
    columnIndex === 0 ? "md:mt-0" :
    columnIndex === 1 ? "md:mt-16 lg:mt-24" :
    "md:mt-8 lg:mt-12";

  // Mobile: use alignment-based offsets for single column view
  const mobileAlignmentClass =
    alignment === "left"
      ? "md:ml-0 ml-[5%]"
      : alignment === "right"
      ? "md:mr-0 mr-[5%] md:ml-0 ml-auto"
      : "";

  // Mobile offset for single column
  const mobileOffsetClass =
    offset === "pos"
      ? "translate-y-4 md:translate-y-0"
      : "translate-y-[-1rem] md:translate-y-0";

  return (
    <div
      className={cn(
        "relative group flex flex-col mb-8 md:mb-4 transition-all duration-500 ease-out",
        staggerClass,
        mobileAlignmentClass,
        mobileOffsetClass
      )}
      style={{ width: '100%' }}
    >
      <div className="relative">
        <img
          src={item.imageUrl}
          alt={item.caption || "Scrapbook memory"}
          className="w-full h-auto object-cover scrapbook-shadow filter contrast-[1.1] brightness-90 group-hover:scale-[1.02] group-hover:z-10 group-hover:brightness-100 transition-all duration-300 ease-out select-none"
          loading="lazy"
        />
      </div>

      {item.caption && (
        <p className="mt-4 text-xs md:text-sm font-mono tracking-widest uppercase text-center text-stone-800 text-shadow-sm opacity-80 group-hover:opacity-100 transition-opacity">
          {item.caption}
        </p>
      )}
    </div>
  );
}
