import { useState } from "react";
import { useCreateScrapbookItem } from "@/hooks/use-scrapbook";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function AddScrapbookDialog() {
  const [open, setOpen] = useState(false);
  const { mutate, isPending } = useCreateScrapbookItem();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    imageUrl: "",
    caption: "",
    width: "350",
    alignment: "center",
    offset: "none"
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate(
      {
        imageUrl: formData.imageUrl,
        caption: formData.caption,
        width: parseInt(formData.width),
        alignment: formData.alignment,
        offset: formData.offset
      },
      {
        onSuccess: () => {
          setOpen(false);
          setFormData({ imageUrl: "", caption: "", width: "350", alignment: "center", offset: "none" });
          toast({ title: "Memory added", description: "Your item has been added to the scrapbook." });
        },
        onError: () => {
          toast({ title: "Error", description: "Failed to add item. Please try again.", variant: "destructive" });
        }
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="icon" 
          className="fixed bottom-8 right-8 z-50 rounded-full w-12 h-12 border-2 border-stone-800 bg-[#E6E1D3] text-stone-800 hover:bg-stone-800 hover:text-[#E6E1D3] transition-colors shadow-lg"
        >
          <Plus className="w-6 h-6" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-[#E6E1D3] border-2 border-stone-800 font-mono text-stone-800">
        <DialogHeader>
          <DialogTitle className="uppercase tracking-widest text-center border-b border-stone-800 pb-2">New Memory</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="image" className="uppercase text-xs font-bold">Image URL</Label>
            <Input
              id="image"
              placeholder="https://images.unsplash.com/..."
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              required
              className="bg-transparent border-stone-800 focus-visible:ring-stone-800 rounded-none"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="caption" className="uppercase text-xs font-bold">Caption</Label>
            <Input
              id="caption"
              placeholder="Summer 2024..."
              value={formData.caption}
              onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
              className="bg-transparent border-stone-800 focus-visible:ring-stone-800 rounded-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="alignment" className="uppercase text-xs font-bold">Alignment</Label>
              <Select 
                value={formData.alignment} 
                onValueChange={(val) => setFormData({ ...formData, alignment: val })}
              >
                <SelectTrigger className="bg-transparent border-stone-800 focus:ring-stone-800 rounded-none">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent className="bg-[#E6E1D3] border-stone-800 font-mono">
                  <SelectItem value="left">Left</SelectItem>
                  <SelectItem value="center">Center</SelectItem>
                  <SelectItem value="right">Right</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="width" className="uppercase text-xs font-bold">Width (px)</Label>
              <Input
                id="width"
                type="number"
                min="200"
                max="800"
                value={formData.width}
                onChange={(e) => setFormData({ ...formData, width: e.target.value })}
                className="bg-transparent border-stone-800 focus-visible:ring-stone-800 rounded-none"
              />
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-stone-800 text-[#E6E1D3] hover:bg-stone-900 rounded-none uppercase tracking-widest mt-6"
            disabled={isPending}
          >
            {isPending ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Adding...</>
            ) : (
              "Add to Scrapbook"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
