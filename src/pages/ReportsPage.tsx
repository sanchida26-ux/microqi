import { Thermometer, Flame, CloudRain, AlertTriangle } from "lucide-react";

const stats = [
  { label: "Avg Temperature", value: "34.2°C", icon: Thermometer },
  { label: "Avg CO Level", value: "38.5 ppm", icon: Flame },
  { label: "Avg PM2.5", value: "72.3 µg/m³", icon: CloudRain },
  { label: "Alerts Today", value: "12", icon: AlertTriangle },
];

export default function ReportsPage() {
  return (
    <div className="max-w-[800px] space-y-5">
      <h2 className="text-lg font-semibold">Daily Report Summary</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="bg-card rounded-md border p-4 shadow-sm text-center">
            <s.icon className="h-5 w-5 mx-auto mb-2 text-primary" />
            <p className="text-xl font-bold">{s.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
          </div>
        ))}
      </div>
      <div className="bg-card rounded-md border p-4 shadow-sm">
        <h3 className="text-sm font-semibold mb-3">Notes</h3>
        <ul className="text-sm text-muted-foreground space-y-1.5 list-disc list-inside">
          <li>Temperature peaked at 43°C in Zone 2 at 14:32.</li>
          <li>CO gas levels exceeded threshold 3 times in Zone 4.</li>
          <li>PM2.5 remains elevated across all zones after maintenance activity.</li>
          <li>VOC readings within acceptable range for all zones.</li>
        </ul>
      </div>
    </div>
  );
}
