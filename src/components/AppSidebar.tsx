import {
  LayoutDashboard,
  Cpu,
  AlertTriangle,
  FileText,
  Settings,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";

const items = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Sensor Nodes", url: "/sensors", icon: Cpu },
  { title: "Alerts", url: "/alerts", icon: AlertTriangle },
  { title: "Reports", url: "/reports", icon: FileText },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  return (
    <aside className="w-52 bg-card border-r border-border shrink-0 flex flex-col">
      <nav className="flex-1 py-4">
        <ul className="space-y-0.5 px-2">
          {items.map((item) => (
            <li key={item.title}>
              <NavLink
                to={item.url}
                end={item.url === "/"}
                className="flex items-center gap-2.5 px-3 py-2 rounded-md text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                activeClassName="bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
              >
                <item.icon className="h-4 w-4" />
                <span>{item.title}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-3 border-t border-border text-[10px] text-muted-foreground text-center">
        MicroQI v1.0 – Prototype
      </div>
    </aside>
  );
}
