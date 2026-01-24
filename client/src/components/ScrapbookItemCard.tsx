import { type ScrapbookItem } from "@shared/schema";
import { cn } from "@/lib/utils";
import { Trash2 } from "lucide-react";

interface ScrapbookItemProps {
  item: ScrapbookItem;
  index: number;
  onDelete?: (id: number) => void;
  isAdmin?: boolean;
}

export function ScrapbookItemCard({ item, index, onDelete, isAdmin }: ScrapbookItemProps) {
  // Deterministic layout based on index if not provided in DB
  const alignment = item.alignment || (index % 3 === 0 ? "left" : index % 3 === 1 ? "center" : "right");
  const offset = item.offset || (index % 2 === 0 ? "pos" : "neg");
  const width = item.width || 350;

  // Map alignment to self-alignment classes
  const alignmentClass =
    alignment === "left"
      ? "self-start ml-[5%] md:ml-[15%]"
      : alignment === "right"
      ? "self-end mr-[5%] md:mr-[15%]"
      : "self-center";

  // Map offset to transform classes
  const offsetClass =
    offset === "pos"
      ? "translate-y-4 md:translate-y-8"
      : "translate-y-[-1rem] md:translate-y-[-2rem]";

  return (
    <div
      className={cn(
        "relative group flex flex-col mb-[120px] transition-all duration-500 ease-out",
        alignmentClass,
        offsetClass
      )}
      style={{ width: `${width}px`, maxWidth: '90vw' }}
    >
      <div className="relative">
        {/* Paper texture overlay or tape effect could go here */}
        
        <img
          src={item.imageUrl}
          alt={item.caption || "Scrapbook memory"}
          className="w-full h-auto object-cover scrapbook-shadow filter contrast-[1.1] brightness-90 group-hover:scale-[1.02] group-hover:z-10 group-hover:brightness-100 transition-all duration-300 ease-out select-none"
          loading="lazy"
        />
        
        {/* Admin Delete Button - only shows on hover if admin */}
        {isAdmin && onDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(item.id);
            }}
            className="absolute -top-3 -right-3 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-md hover:bg-red-600 z-20"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {item.caption && (
        <p className="mt-4 text-xs md:text-sm font-mono tracking-widest uppercase text-center text-stone-800 text-shadow-sm opacity-80 group-hover:opacity-100 transition-opacity">
          {item.caption}
        </p>
      )}
    </div>
  );
}
