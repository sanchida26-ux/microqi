import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, User, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import microqiLogo from "@/assets/microqi-logo.png";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isRegister, setIsRegister] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (isRegister) {
        await register(email, password);
      } else {
        await login(email, password);
      }
      navigate("/");
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-navbar items-center justify-center p-12">
        <div className="text-center space-y-6 max-w-md">
          <img src={microqiLogo} alt="MICRO-QI Logo" className="h-28 mx-auto invert brightness-200" />
          <h2 className="text-2xl font-bold text-navbar-foreground">
            Industrial Air Safety Monitoring
          </h2>
          <p className="text-navbar-foreground/70 text-sm leading-relaxed">
            Real-time monitoring of temperature, humidity, toxic gases, and particulate matter across industrial zones. Keeping your workforce safe with intelligent alerts.
          </p>
          <div className="grid grid-cols-3 gap-4 pt-6">
            {[
              { label: "Sensors", value: "24" },
              { label: "Zones", value: "4" },
              { label: "Uptime", value: "99.8%" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-bold text-navbar-foreground">{stat.value}</div>
                <div className="text-xs text-navbar-foreground/60">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel - Login form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm space-y-8">
          <div className="text-center lg:hidden">
            <img src={microqiLogo} alt="MICRO-QI Logo" className="h-20 mx-auto mb-4" />
          </div>
          <div className="text-center">
            <h1 className="text-xl font-bold text-foreground">{isRegister ? "Create Account" : "Welcome Back"}</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {isRegister ? "Sign up for monitoring dashboard" : "Sign in to your monitoring dashboard"}
            </p>
          </div>

          {error && (
            <div className="bg-danger/10 border border-danger rounded-md p-3 flex gap-2">
              <AlertCircle className="h-4 w-4 text-danger flex-shrink-0 mt-0.5" />
              <p className="text-sm text-danger">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Email Address
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="operator@microqi.io"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10"
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

            {!isRegister && (
              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 text-muted-foreground">
                  <input type="checkbox" className="rounded border-input" />
                  Remember me
                </label>
                <a href="#" className="text-primary hover:underline">Forgot password?</a>
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (isRegister ? "Creating account..." : "Signing in...") : (isRegister ? "Sign Up" : "Sign In")}
            </Button>
          </form>

          <div className="text-center text-sm">
            {isRegister ? (
              <>
                <span className="text-muted-foreground">Already have an account? </span>
                <button
                  onClick={() => {
                    setIsRegister(false);
                    setError("");
                  }}
                  className="text-primary hover:underline font-medium"
                >
                  Sign In
                </button>
              </>
            ) : (
              <>
                <span className="text-muted-foreground">Don't have an account? </span>
                <button
                  onClick={() => {
                    setIsRegister(true);
                    setError("");
                  }}
                  className="text-primary hover:underline font-medium"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>

          <p className="text-center text-[10px] text-muted-foreground">
            MicroQI v1.0 – Prototype • Industrial Use Only
          </p>
        </div>
      </div>
    </div>
  );
}
