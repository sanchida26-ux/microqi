import { useState, useEffect } from "react";
import { Thermometer, Droplets, Wind, Flame, CloudRain, AlertTriangle, Clock } from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar,
} from "recharts";
import {
  generateReading, generateTimeSeriesData, generateAlerts, generateEmissionData,
  getSeverity, getZoneSeverity,
  type SensorReading, type Alert, type AlertSeverity,
} from "@/lib/mockData";

const severityBg: Record<AlertSeverity, string> = {
  critical: "bg-danger text-danger-foreground",
  warning: "bg-warning text-warning-foreground",
  normal: "bg-safe text-safe-foreground",
};

const severityBorder: Record<AlertSeverity, string> = {
  critical: "border-danger",
  warning: "border-warning",
  normal: "border-safe",
};

function generateZones() {
  return [1, 2, 3, 4].map((i) => {
    const r = generateReading();
    return { id: i, severity: getZoneSeverity(r) };
  });
}

function SensorCard({
  label, value, unit, icon: Icon, severity,
}: {
  label: string; value: number; unit: string;
  icon: React.ElementType; severity: AlertSeverity;
}) {
  return (
    <div className={`bg-card rounded-md border-l-4 p-4 shadow-sm ${severityBorder[severity]}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</span>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="flex items-end gap-1">
        <span className="text-2xl font-bold">{value}</span>
        <span className="text-sm text-muted-foreground mb-0.5">{unit}</span>
      </div>
      <div className="mt-2 flex items-center gap-1.5">
        {severity !== "normal" && <AlertTriangle className="h-3 w-3" />}
        <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${severityBg[severity]}`}>
          {severity === "normal" ? "Safe" : severity === "warning" ? "Warning" : "Alert"}
        </span>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [reading, setReading] = useState<SensorReading>(generateReading());
  const [chartData, setChartData] = useState(generateTimeSeriesData());
  const [alerts, setAlerts] = useState<Alert[]>(generateAlerts(6));
  const [emissionData] = useState(generateEmissionData());
  const [zones, setZones] = useState(generateZones());
  const [lastUpdated, setLastUpdated] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setReading(generateReading());
      setChartData((prev) => {
        const next = [...prev.slice(1)];
        const r = generateReading();
        next.push({
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          temperature: r.temperature,
          co: r.co,
          pm25: r.pm25,
        });
        return next;
      });
      setAlerts(generateAlerts(6));
      setLastUpdated(0);
    }, 5000);

    const zoneInterval = setInterval(() => setZones(generateZones()), 10000);
    const tick = setInterval(() => setLastUpdated((p) => p + 1), 1000);
    return () => {
      clearInterval(interval);
      clearInterval(zoneInterval);
      clearInterval(tick);
    };
  }, []);

  return (
    <div className="space-y-5 max-w-[1200px]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">System Overview</h2>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Clock className="h-3.5 w-3.5" />
          Last Updated: {lastUpdated}s ago
        </div>
      </div>

      {/* Section 1: Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        <SensorCard label="Temperature" value={reading.temperature} unit="°C" icon={Thermometer} severity={getSeverity("temperature", reading.temperature)} />
        <SensorCard label="Humidity" value={reading.humidity} unit="%" icon={Droplets} severity={getSeverity("humidity", reading.humidity)} />
        <SensorCard label="CO Gas" value={reading.co} unit="ppm" icon={Flame} severity={getSeverity("co", reading.co)} />
        <SensorCard label="VOC Level" value={reading.voc} unit="ppb" icon={Wind} severity={getSeverity("voc", reading.voc)} />
        <SensorCard label="PM2.5 Dust" value={reading.pm25} unit="µg/m³" icon={CloudRain} severity={getSeverity("pm25", reading.pm25)} />
      </div>

      {/* Section 2: Line Chart */}
      <div className="bg-card rounded-md border p-4 shadow-sm">
        <h3 className="text-sm font-semibold mb-3">Air Quality Trends (Last 60 Minutes)</h3>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(214 20% 85%)" />
            <XAxis dataKey="time" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip contentStyle={{ fontSize: 12 }} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Line type="monotone" dataKey="temperature" stroke="#e74c3c" strokeWidth={2} dot={false} name="Temp (°C)" />
            <Line type="monotone" dataKey="co" stroke="#f39c12" strokeWidth={2} dot={false} name="CO (ppm)" />
            <Line type="monotone" dataKey="pm25" stroke="#3498db" strokeWidth={2} dot={false} name="PM2.5 (µg/m³)" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Section 3: Alert Panel */}
        <div className="bg-card rounded-md border p-4 shadow-sm">
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-danger" />
            Active Safety Alerts
          </h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {alerts.map((a) => (
              <div
                key={a.id}
                className={`text-xs rounded-md p-2.5 border ${
                  a.alertType === "critical"
                    ? "bg-danger/10 border-danger/30"
                    : a.alertType === "warning"
                    ? "bg-warning/10 border-warning/30"
                    : "bg-safe/10 border-safe/30"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium">{a.sensor} – {a.zone}</span>
                  {a.alertType === "critical" && (
                    <span className="h-2 w-2 rounded-full bg-danger blink" />
                  )}
                </div>
                <p className="text-muted-foreground">{a.message}</p>
                <div className="flex justify-between mt-1 text-muted-foreground">
                  <span>{a.value}</span>
                  <span>{a.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 4: Zone Map */}
        <div className="bg-card rounded-md border p-4 shadow-sm">
          <h3 className="text-sm font-semibold mb-3">Industrial Zone Map</h3>
          <div className="grid grid-cols-2 gap-3">
            {zones.map((z) => (
              <div
                key={z.id}
                className={`rounded-md p-6 text-center font-semibold text-sm border ${severityBg[z.severity]} ${severityBorder[z.severity]}`}
              >
                Zone {z.id}
                <div className="text-xs font-normal mt-1 opacity-80">
                  {z.severity === "normal" ? "Safe" : z.severity === "warning" ? "Warning" : "Dangerous"}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section 5: Emission Bar Chart */}
      <div className="bg-card rounded-md border p-4 shadow-sm">
        <h3 className="text-sm font-semibold mb-3">Daily Emission Summary</h3>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={emissionData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(214 20% 85%)" />
            <XAxis dataKey="day" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip contentStyle={{ fontSize: 12 }} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="co" fill="#e74c3c" name="CO (ppm)" radius={[2, 2, 0, 0]} />
            <Bar dataKey="voc" fill="#f39c12" name="VOC (ppb)" radius={[2, 2, 0, 0]} />
            <Bar dataKey="dust" fill="#3498db" name="Dust (µg/m³)" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
