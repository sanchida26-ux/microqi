import { useState, useEffect } from "react";
import { Eye, EyeOff, Lock, RefreshCw, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AdminData {
  users: any[];
  settings: any[];
  componentValues: any[];
}

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [data, setData] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedTable, setSelectedTable] = useState<"users" | "settings" | "componentValues">("users");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    fetch(`http://localhost:5000/api/admin/data?password=${encodeURIComponent(password)}`)
      .then((res) => {
        if (!res.ok) throw new Error("Invalid password");
        return res.json();
      })
      .then((data) => {
        setData(data);
        setIsAuthenticated(true);
        localStorage.setItem("adminPassword", password);
      })
      .catch((err) => {
        setError(err.message || "Failed to authenticate");
      })
      .finally(() => setLoading(false));
  };

  const handleRefresh = () => {
    if (!isAuthenticated) return;
    setLoading(true);
    setError("");

    fetch(`http://localhost:5000/api/admin/data?password=${encodeURIComponent(password)}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to refresh");
        return res.json();
      })
      .then((data) => setData(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword("");
    setData(null);
    localStorage.removeItem("adminPassword");
  };

  useEffect(() => {
    const savedPassword = localStorage.getItem("adminPassword");
    if (savedPassword) {
      setPassword(savedPassword);
      // Auto-login if password is saved
      setTimeout(() => {
        setPassword(savedPassword);
        fetch(`http://localhost:5000/api/admin/data?password=${encodeURIComponent(savedPassword)}`)
          .then((res) => res.json())
          .then((data) => {
            setData(data);
            setIsAuthenticated(true);
          })
          .catch(() => {
            localStorage.removeItem("adminPassword");
          });
      }, 100);
    }
  }, []);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-sm bg-card rounded-lg border p-6 shadow-lg">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-sm text-muted-foreground mt-1">Enter admin password to view database</p>
          </div>

          {error && (
            <div className="bg-danger/10 border border-danger rounded p-3 text-sm text-danger mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Admin Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter admin password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2 text-sm border rounded-md bg-background focus:outline-none focus:ring-1 focus:ring-ring"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Authenticating..." : "Access Admin Panel"}
            </Button>
          </form>

          <p className="text-center text-[10px] text-muted-foreground mt-4">
            Default password: <code className="bg-muted px-1 py-0.5 rounded">admin123</code>
          </p>
        </div>
      </div>
    );
  }

  const tableData = data ? data[selectedTable] : [];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm bg-destructive text-destructive-foreground rounded-md hover:opacity-90"
          >
            Logout
          </button>
        </div>

        {/* Table Selector */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {(["users", "settings", "componentValues"] as const).map((table) => (
            <button
              key={table}
              onClick={() => setSelectedTable(table)}
              className={`px-4 py-2 text-sm rounded-md transition-colors ${
                selectedTable === table
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {table} ({data?.[table]?.length || 0})
            </button>
          ))}
        </div>

        {/* Refresh Button */}
        <div className="mb-4 flex gap-2">
          <Button
            onClick={handleRefresh}
            disabled={loading}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>

        {/* Data Table */}
        <div className="bg-card rounded-lg border shadow-sm overflow-auto">
          {tableData.length > 0 ? (
            <table className="w-full text-sm">
              <thead className="bg-muted border-b">
                <tr>
                  {Object.keys(tableData[0] || {}).map((key) => (
                    <th key={key} className="px-4 py-3 text-left font-medium text-muted-foreground">
                      {key}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableData.map((row, idx) => (
                  <tr key={idx} className="border-b hover:bg-muted/50 transition-colors">
                    {Object.values(row).map((value: any, colIdx) => (
                      <td key={colIdx} className="px-4 py-3">
                        {typeof value === "object" ? JSON.stringify(value) : String(value)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-8 text-center text-muted-foreground">
              No data in {selectedTable} table
            </div>
          )}
        </div>

        {/* Summary Stats */}
        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="bg-card rounded-lg border p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Total Users</p>
            <p className="text-2xl font-bold mt-1">{data?.users?.length || 0}</p>
          </div>
          <div className="bg-card rounded-lg border p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Settings Records</p>
            <p className="text-2xl font-bold mt-1">{data?.settings?.length || 0}</p>
          </div>
          <div className="bg-card rounded-lg border p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Component Values</p>
            <p className="text-2xl font-bold mt-1">{data?.componentValues?.length || 0}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
