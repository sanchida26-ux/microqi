import { useState } from "react";
import { Search } from "lucide-react";
import { generateAlerts, type Alert, type AlertSeverity } from "@/lib/mockData";

const statusBadge: Record<AlertSeverity, string> = {
  normal: "bg-safe text-safe-foreground",
  warning: "bg-warning text-warning-foreground",
  critical: "bg-danger text-danger-foreground",
};

export default function AlertsPage() {
  const [alerts] = useState<Alert[]>(generateAlerts(15));
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState("");

  const filtered = alerts.filter((a) => {
    if (filter !== "all" && a.alertType !== filter) return false;
    if (search && !a.sensor.toLowerCase().includes(search.toLowerCase()) && !a.zone.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="max-w-[1000px] space-y-4">
      <h2 className="text-lg font-semibold">Alert History</h2>
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-2.5 top-2 h-4 w-4 text-muted-foreground" />
          <input
            className="w-full pl-8 pr-3 py-1.5 text-sm rounded-md border bg-card focus:outline-none focus:ring-1 focus:ring-ring"
            placeholder="Search sensor or zone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="text-sm border rounded-md px-2 py-1.5 bg-card focus:outline-none focus:ring-1 focus:ring-ring"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All Types</option>
          <option value="critical">Critical</option>
          <option value="warning">Warning</option>
          <option value="normal">Normal</option>
        </select>
      </div>
      <div className="bg-card rounded-md border shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted text-muted-foreground text-xs uppercase">
            <tr>
              <th className="text-left px-4 py-2.5">Alert ID</th>
              <th className="text-left px-4 py-2.5">Sensor</th>
              <th className="text-left px-4 py-2.5">Zone</th>
              <th className="text-center px-4 py-2.5">Type</th>
              <th className="text-right px-4 py-2.5">Value</th>
              <th className="text-right px-4 py-2.5">Time</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((a) => (
              <tr key={a.id} className="border-t">
                <td className="px-4 py-2.5 font-mono text-xs">{a.id}</td>
                <td className="px-4 py-2.5">{a.sensor}</td>
                <td className="px-4 py-2.5">{a.zone}</td>
                <td className="px-4 py-2.5 text-center">
                  <span className={`text-xs px-2 py-0.5 rounded ${statusBadge[a.alertType]}`}>
                    {a.alertType}
                  </span>
                </td>
                <td className="px-4 py-2.5 text-right">{a.value}</td>
                <td className="px-4 py-2.5 text-right text-muted-foreground">{a.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
