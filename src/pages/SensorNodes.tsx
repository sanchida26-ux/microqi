import { useState, useEffect } from "react";
import { generateSensorNodes, type SensorNode, type AlertSeverity } from "@/lib/mockData";

const statusBadge: Record<AlertSeverity, string> = {
  normal: "bg-safe text-safe-foreground",
  warning: "bg-warning text-warning-foreground",
  critical: "bg-danger text-danger-foreground",
};

export default function SensorNodesPage() {
  const [nodes, setNodes] = useState<SensorNode[]>(generateSensorNodes());

  useEffect(() => {
    const interval = setInterval(() => setNodes(generateSensorNodes()), 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-[1000px] space-y-4">
      <h2 className="text-lg font-semibold">Sensor Nodes</h2>
      <div className="bg-card rounded-md border shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted text-muted-foreground text-xs uppercase">
            <tr>
              <th className="text-left px-4 py-2.5">Node ID</th>
              <th className="text-left px-4 py-2.5">Zone</th>
              <th className="text-right px-4 py-2.5">Temp (°C)</th>
              <th className="text-right px-4 py-2.5">CO (ppm)</th>
              <th className="text-right px-4 py-2.5">VOC (ppb)</th>
              <th className="text-center px-4 py-2.5">Status</th>
            </tr>
          </thead>
          <tbody>
            {nodes.map((n) => (
              <tr key={n.nodeId} className="border-t">
                <td className="px-4 py-2.5 font-mono text-xs">{n.nodeId}</td>
                <td className="px-4 py-2.5">{n.zone}</td>
                <td className="px-4 py-2.5 text-right">{n.temperature}</td>
                <td className="px-4 py-2.5 text-right">{n.co}</td>
                <td className="px-4 py-2.5 text-right">{n.voc}</td>
                <td className="px-4 py-2.5 text-center">
                  <span className={`text-xs px-2 py-0.5 rounded ${statusBadge[n.status]}`}>
                    {n.status === "normal" ? "Normal" : n.status === "warning" ? "Warning" : "Critical"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
