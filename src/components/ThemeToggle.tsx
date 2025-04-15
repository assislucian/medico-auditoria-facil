
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className={cn("ml-auto relative", className)}
      aria-label="Alternar tema"
    >
      <Sun className={cn(
        "h-5 w-5 transition-all",
        theme === "light" ? "scale-100 rotate-0" : "scale-0 -rotate-90"
      )} />
      <Moon className={cn(
        "absolute h-5 w-5 transition-all",
        theme === "dark" ? "scale-100 rotate-0" : "scale-0 rotate-90"
      )} />
      <span className="sr-only">Alternar tema</span>
    </Button>
  );
}
