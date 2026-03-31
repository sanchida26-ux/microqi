// Thresholds
export const THRESHOLDS = {
  temperature: 40,
  humidity: 80,
  co: 50,
  voc: 300,
  pm25: 100,
};

export type AlertSeverity = "critical" | "warning" | "normal";

export interface SensorReading {
  temperature: number;
  humidity: number;
  co: number;
  voc: number;
  pm25: number;
}

export interface SensorNode {
  nodeId: string;
  zone: string;
  temperature: number;
  co: number;
  voc: number;
  status: AlertSeverity;
}

export interface Alert {
  id: string;
  sensor: string;
  zone: string;
  alertType: AlertSeverity;
  value: string;
  time: string;
  message: string;
}

function rand(min: number, max: number) {
  return Math.round((Math.random() * (max - min) + min) * 10) / 10;
}

export function generateReading(): SensorReading {
  const severityRand = Math.random();
  
  let temperature, co, voc, pm25;
  
  if (severityRand < 0.33) {
    // Safe range (Green)
    temperature = rand(18, 32);
    co = rand(5, 35);
    voc = rand(50, 250);
    pm25 = rand(10, 70);
  } else if (severityRand < 0.66) {
    // Warning range (Yellow) - 75-100% of threshold
    temperature = rand(30, 40);
    co = rand(37.5, 50);
    voc = rand(225, 300);
    pm25 = rand(75, 100);
  } else {
    // Critical range (Red) - above threshold
    temperature = rand(40, 45);
    co = rand(50, 80);
    voc = rand(300, 420);
    pm25 = rand(100, 140);
  }
  
  return {
    temperature,
    humidity: rand(30, 70),
    co,
    voc,
    pm25,
  };
}

export function getSeverity(key: keyof typeof THRESHOLDS, value: number): AlertSeverity {
  const t = THRESHOLDS[key];
  if (value > t) return "critical";
  if (value > t * 0.75) return "warning";
  return "normal";
}

export function getZoneSeverity(reading: SensorReading): AlertSeverity {
  const severities = [
    getSeverity("temperature", reading.temperature),
    getSeverity("co", reading.co),
    getSeverity("voc", reading.voc),
    getSeverity("pm25", reading.pm25),
  ];
  if (severities.includes("critical")) return "critical";
  if (severities.includes("warning")) return "warning";
  return "normal";
}

export function generateTimeSeriesData(points = 12) {
  const now = Date.now();
  return Array.from({ length: points }, (_, i) => ({
    time: new Date(now - (points - 1 - i) * 5 * 60000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    temperature: rand(18, 32),
    co: rand(5, 35),
    pm25: rand(10, 70),
  }));
}

export function generateSensorNodes(): SensorNode[] {
  return [
    { nodeId: "SN-001", zone: "Zone 1" },
    { nodeId: "SN-002", zone: "Zone 2" },
    { nodeId: "SN-003", zone: "Zone 3" },
    { nodeId: "SN-004", zone: "Zone 4" },
    { nodeId: "SN-005", zone: "Zone 1" },
    { nodeId: "SN-006", zone: "Zone 3" },
  ].map((n) => {
    const temp = rand(18, 45);
    const co = rand(5, 80);
    const voc = rand(50, 500);
    const severities = [
      getSeverity("temperature", temp),
      getSeverity("co", co),
      getSeverity("voc", voc),
    ];
    const status: AlertSeverity = severities.includes("critical")
      ? "critical"
      : severities.includes("warning")
      ? "warning"
      : "normal";
    return { ...n, temperature: temp, co, voc, status };
  });
}

let alertCounter = 1000;
export function generateAlerts(count = 8): Alert[] {
  const sensors = ["Temp Sensor", "CO Detector", "PM2.5 Sensor", "VOC Sensor"];
  const zones = ["Zone 1", "Zone 2", "Zone 3", "Zone 4"];
  const types: AlertSeverity[] = ["critical", "warning", "normal"];
  const messages = [
    "High Temperature detected",
    "Toxic CO Gas detected",
    "PM2.5 levels exceeded safe limits",
    "VOC concentration elevated",
    "Humidity above threshold",
    "Sensor reading normal",
  ];
  return Array.from({ length: count }, () => {
    const type = types[Math.floor(Math.random() * types.length)];
    const sensor = sensors[Math.floor(Math.random() * sensors.length)];
    const zone = zones[Math.floor(Math.random() * zones.length)];
    const value =
      sensor === "Temp Sensor"
        ? `${rand(28, 45)}°C`
        : sensor === "CO Detector"
        ? `${rand(10, 80)} ppm`
        : sensor === "PM2.5 Sensor"
        ? `${rand(20, 150)} µg/m³`
        : `${rand(100, 500)} ppb`;
    return {
      id: `ALT-${++alertCounter}`,
      sensor,
      zone,
      alertType: type,
      value,
      time: new Date(Date.now() - Math.random() * 3600000).toLocaleTimeString(),
      message: `${messages[Math.floor(Math.random() * messages.length)]} in ${zone}`,
    };
  });
}

export function generateEmissionData() {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  return days.map((day) => ({
    day,
    co: rand(20, 60),
    voc: rand(150, 400),
    dust: rand(30, 120),
  }));
}
