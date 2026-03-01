import { Sun, Moon, Shield, Zap } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { HealthIndicator } from "./HealthIndicator";

export function Navbar() {
  const { dark, toggle } = useTheme();

  return (
    <header className="nav-glass sticky top-0 z-50 border-b bg-background/80">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-3 story-link group">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-destructive/20 to-destructive/5 transition-all duration-300 group-hover:scale-110">
            <div className="absolute inset-0 rounded-xl bg-destructive/20 opacity-0 group-hover:opacity-100 transition-opacity blur-md" />
            <Shield className="h-5 w-5 text-destructive relative z-10" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-success" />
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-display text-lg font-bold tracking-tight">
              VerityCheck
            </span>
            <span className="text-[10px] text-muted-foreground flex items-center gap-1">
              <Zap className="h-2.5 w-2.5 text-warning" />
              AI-Powered
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <HealthIndicator />
          <div className="h-6 w-px bg-border mx-1" />
          <button
            onClick={toggle}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-muted-foreground transition-all duration-200 hover:bg-accent hover:text-accent-foreground hover:scale-105 active:scale-95 border border-transparent hover:border-border"
            aria-label="Toggle theme"
          >
            {dark ? (
              <Sun className="h-[18px] w-[18px]" />
            ) : (
              <Moon className="h-[18px] w-[18px]" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
