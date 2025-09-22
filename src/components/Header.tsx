import { Menu, LogOut } from "lucide-react";
import { Button } from "./ui/button";

interface HeaderProps {
  onMenuClick?: () => void;
  onSignOut?: () => void;
}

export function Header({ onMenuClick, onSignOut }: HeaderProps) {
  const GOLD = "#D4AF37";

  return (
    <header
      className="sticky top-0 z-50 bg-black border-b py-3"
      style={{ borderColor: GOLD }}
    >
      <div className="flex items-center justify-between w-full px-4">
        {/* Left: logo */}
        <div className="flex items-center gap-3">
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-white hover:text-[${GOLD}]"
            onClick={onMenuClick}
          >
            <Menu className="h-6 w-6" />
          </Button>

          {/* SVG Logo */}
          <div className="flex items-center pl-2">
            <img
              src="https://hirmasgroup.com/wp-content/themes/bootscore-child-main/img/logo/logo.svg"
              alt="Hirmas Logo"
              className="h-10 w-auto"
            />
          </div>
        </div>

        {/* Right: Sign out button */}
        <div>
          <Button
            onClick={onSignOut}
            className="bg-black text-white border font-semibold rounded-lg transition-all duration-300"
            style={{
              borderColor: GOLD,
              color: GOLD,
              boxShadow: `0 0 6px rgba(212,175,55,0.5)`,
            }}
          >
            <LogOut className="h-4 w-4 mr-2" color={GOLD} />
            Sign out
          </Button>
        </div>
      </div>
    </header>
  );
}
