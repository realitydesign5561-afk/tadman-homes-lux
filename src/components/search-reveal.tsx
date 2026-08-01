import { useEffect } from "react";
import { SearchPanel, type PropertySearch } from "@/components/search-panel";
import { useIsMobile } from "@/hooks/use-mobile";

export function SearchReveal({
  open,
  onClose,
  initial,
}: {
  open: boolean;
  onClose: () => void;
  initial?: PropertySearch;
}) {
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!open || !isMobile) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open, isMobile]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  if (isMobile) {
    return (
      <div className="fixed inset-0 z-[70]">
        <button
          type="button"
          aria-label="Close search"
          onClick={onClose}
          className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
        />
        <div className="animate-sheet-up absolute inset-x-0 bottom-0 max-h-[92vh] overflow-y-auto rounded-t-[1.75rem] bg-background p-3 pb-8">
          <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-border" />
          <SearchPanel initial={initial} onClose={onClose} />
        </div>
      </div>
    );
  }

  return (
    <div className="animate-slide-down mt-5">
      <SearchPanel initial={initial} onClose={onClose} />
    </div>
  );
}
