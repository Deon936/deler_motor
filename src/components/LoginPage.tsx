import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Eye, EyeOff, AlertCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";

const API_URL = "http://localhost/backend/api";

export function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  // Cek apakah login untuk admin
  const isAdminLogin = window.location.pathname === "/superadmin-login";
  const redirectTo = isAdminLogin ? "/admin" : "/profile";

  // 🔹 Validasi form dasar
  const validateForm = () => {
    if (!email.trim()) return setError("Email wajib diisi"), false;
    if (!password.trim()) return setError("Password wajib diisi"), false;
    return true;
  };

  // 🔹 Fungsi login utama
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!validateForm()) return;
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/login.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.status === "success") {
        const user = data.user;

        // Simpan user info ke localStorage
        localStorage.setItem("userEmail", user.email);
        localStorage.setItem("userName", user.name);
        localStorage.setItem("userRole", user.role);
        localStorage.setItem("userId", user.id);
        localStorage.setItem("isAuthenticated", "true");

        if (user.role === "customer") {
          localStorage.setItem("userPhone", user.phone || "");
          localStorage.setItem("userAddress", user.address || "");
        }

        // Arahkan sesuai role
        navigate(user.role === "admin" ? "/admin" : "/profile", { replace: true });
      } else {
        setError(data.message || "Login gagal");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Gagal terhubung ke server");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Simpan / muat kembali email (Remember Me)
  useEffect(() => {
    const savedEmail = localStorage.getItem("savedEmail");
    const remember = localStorage.getItem("rememberMe") === "true";
    if (remember && savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  useEffect(() => {
    if (rememberMe && email) {
      localStorage.setItem("savedEmail", email);
      localStorage.setItem("rememberMe", "true");
    } else if (!rememberMe) {
      localStorage.removeItem("savedEmail");
      localStorage.setItem("rememberMe", "false");
    }
  }, [rememberMe, email]);

  // 🔹 Isi otomatis untuk akun demo
  const handleDemoLogin = () => {
    if (isAdminLogin) {
      setEmail("admin@dayamotor.com");
      setPassword("admin123");
    } else {
      setEmail("demo@customer.com");
      setPassword("demo123");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="bg-red-600 text-white px-3 py-1 rounded font-bold text-sm">
              HONDA
            </div>
            <span className="text-gray-800 font-semibold">
              Daya Motor Cikampek
            </span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isAdminLogin ? "Admin Login" : "Welcome Back"}
          </h1>
          <p className="text-gray-600">
            {isAdminLogin
              ? "Restricted access for administrators only"
              : "Login to your account"}
          </p>
        </div>

        {/* Card Login */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl">
              {isAdminLogin ? "Admin Portal" : "User Login"}
            </CardTitle>
            <CardDescription>
              {isAdminLogin
                ? "Authorized personnel only"
                : "Enter your credentials"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  required
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    required
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    disabled={loading}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {!isAdminLogin && (
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="form-checkbox h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                      disabled={loading}
                    />
                    <span className="text-sm text-gray-600">Remember me</span>
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-sm text-red-600 font-medium hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-red-600 hover:bg-red-700 text-white"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  "Login"
                )}
              </Button>
            </form>

            <div className="mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleDemoLogin}
                disabled={loading}
                className="w-full"
              >
                Fill Demo Credentials
              </Button>
            </div>

            {!isAdminLogin && (
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Don't have an account?{" "}
                  <Link
                    to="/register"
                    className="text-red-600 hover:text-red-700 font-medium"
                  >
                    Register
                  </Link>
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
