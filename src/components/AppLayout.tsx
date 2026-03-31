import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { AppSidebar } from "@/components/AppSidebar";
import { Chatbot } from "@/components/Chatbot";
import { generateAlerts } from "@/lib/mockData";

export function AppLayout() {
  const [hasAlerts, setHasAlerts] = useState(false);

  useEffect(() => {
    const alerts = generateAlerts(5);
    setHasAlerts(alerts.some((a) => a.alertType === "critical"));
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar hasActiveAlerts={hasAlerts} />
      <div className="flex flex-1 overflow-hidden">
        <AppSidebar />
        <main className="flex-1 overflow-y-auto p-5">
          <Outlet />
        </main>
      </div>
      <Chatbot />
    </div>
  );
}
