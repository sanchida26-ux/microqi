import { useState, useEffect, useRef } from "react";
import { User, Clock, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import microqiLogo from "@/assets/microqi-logo.png";

interface NavbarProps {
  hasActiveAlerts: boolean;
}

export function Navbar({ hasActiveAlerts }: NavbarProps) {
  const [time, setTime] = useState(new Date());
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { logout, email } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="h-14 bg-navbar text-navbar-foreground flex items-center justify-between px-4 shrink-0">
      <div className="flex items-center gap-3">
        <img src={microqiLogo} alt="MICRO-QI" className="h-8 invert brightness-200" />
        <div>
          <h1 className="text-sm font-semibold leading-tight">MICRO-QI</h1>
          <p className="text-[10px] opacity-70 leading-tight">Industrial Air Safety Monitoring</p>
        </div>
      </div>

      <div className="flex items-center gap-4 text-xs">
        <div className="flex items-center gap-1.5">
          <span
            className={`h-2 w-2 rounded-full ${
              hasActiveAlerts ? "bg-danger blink" : "bg-safe"
            }`}
          />
          <span>{hasActiveAlerts ? "Alert Active" : "System Healthy"}</span>
        </div>
        <div className="flex items-center gap-1.5 opacity-80">
          <Clock className="h-3.5 w-3.5" />
          <span>{time.toLocaleDateString()}</span>
          <span>{time.toLocaleTimeString()}</span>
        </div>
        
        {/* User menu */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="h-7 w-7 rounded-full bg-primary-foreground/20 flex items-center justify-center hover:bg-primary-foreground/30 transition-colors"
            title={email || "User"}
          >
            <User className="h-4 w-4" />
          </button>
          
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-card text-foreground rounded-md shadow-lg border border-border z-50">
              <div className="px-4 py-2 border-b border-border text-xs">
                <p className="font-medium truncate">{email || "User"}</p>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted transition-colors text-destructive hover:text-destructive"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
