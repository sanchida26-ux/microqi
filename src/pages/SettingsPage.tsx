import { useState, useEffect } from "react";
import { THRESHOLDS } from "@/lib/mockData";
import { settingsAPI } from "@/lib/api";

export default function SettingsPage() {
  const [values, setValues] = useState({ ...THRESHOLDS });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState("");

  // Load settings on mount
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await settingsAPI.getSettings();
      setValues({
        temperature: data.temperature || THRESHOLDS.temperature,
        humidity: data.humidity || THRESHOLDS.humidity,
        co: data.co || THRESHOLDS.co,
        voc: data.voc || THRESHOLDS.voc,
        pm25: data.pm25 || THRESHOLDS.pm25,
      });
    } catch (err: any) {
      setError(err.message || "Failed to load settings");
      setValues({ ...THRESHOLDS });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");
      setSaveSuccess(false);
      await settingsAPI.saveSettings(values);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => setValues({ ...THRESHOLDS });

  if (loading) {
    return (
      <div className="max-w-md space-y-5">
        <h2 className="text-lg font-semibold">Alert Thresholds</h2>
        <div className="bg-card rounded-md border p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md space-y-5">
      <h2 className="text-lg font-semibold">Alert Thresholds</h2>
      <div className="bg-card rounded-md border p-5 shadow-sm space-y-4">
        {error && (
          <div className="bg-danger/10 border border-danger rounded p-3 text-sm text-danger">
            {error}
          </div>
        )}
        
        {saveSuccess && (
          <div className="bg-safe/10 border border-safe rounded p-3 text-sm text-safe">
            Settings saved successfully!
          </div>
        )}

        {([
          ["temperature", "Temperature (°C)"],
          ["humidity", "Humidity (%)"],
          ["co", "CO Gas (ppm)"],
          ["voc", "VOC Level (ppb)"],
          ["pm25", "PM2.5 (µg/m³)"],
        ] as const).map(([key, label]) => (
          <div key={key}>
            <label className="text-sm font-medium block mb-1">{label}</label>
            <input
              type="number"
              className="w-full px-3 py-1.5 text-sm border rounded-md bg-background focus:outline-none focus:ring-1 focus:ring-ring"
              value={values[key]}
              onChange={(e) => setValues((v) => ({ ...v, [key]: Number(e.target.value) }))}
              disabled={saving}
            />
          </div>
        ))}
        <div className="flex gap-2 pt-2">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-1.5 text-sm bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? "Saving..." : "Save Settings"}
          </button>
          <button
            onClick={handleReset}
            disabled={saving}
            className="px-4 py-1.5 text-sm border rounded-md hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Reset Defaults
          </button>
        </div>
      </div>
    </div>
  );
}
