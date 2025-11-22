import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, AlertCircle, Loader2 } from "lucide-react";
import * as React from 'react';

// ===============================================
// UI COMPONENTS (Integrasi dari ./ui ke satu file)
// ===============================================

// Komponen Button (Sesuai shadcn/ui minimal)
const Button = React.forwardRef(({ className = "", variant = "default", size = "default", disabled, children, ...props }, ref) => {
  const baseClasses = "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
  
  const variantClasses = {
    default: "bg-red-600 text-white hover:bg-red-700",
    outline: "border border-input bg-white hover:bg-gray-100 hover:text-gray-900",
    ghost: "hover:bg-gray-100",
    destructive: "bg-red-500 text-white hover:bg-red-600",
  }[variant];
  
  const sizeClasses = {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3",
    lg: "h-11 rounded-md px-8",
  }[size];

  return (
    <button
      className={`${baseClasses} ${variantClasses} ${sizeClasses} ${className}`}
      disabled={disabled}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  );
});
Button.displayName = "Button";

// Komponen Input (Sesuai shadcn/ui minimal)
const Input = React.forwardRef(({ className = "", type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={`flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = "Input";

// Komponen Label (Sesuai shadcn/ui minimal)
const Label = React.forwardRef(({ className = "", ...props }, ref) => (
  <label
    ref={ref}
    className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 block mb-1 ${className}`}
    {...props}
  />
));
Label.displayName = "Label";

// Komponen Card (Sesuai shadcn/ui minimal)
const Card = React.forwardRef(({ className = "", ...props }, ref) => (
  <div
    ref={ref}
    className={`rounded-xl border bg-white text-gray-900 shadow-md ${className}`}
    {...props}
  />
));
Card.displayName = "Card";

const CardHeader = React.forwardRef(({ className = "", ...props }, ref) => (
  <div
    ref={ref}
    className={`flex flex-col space-y-1.5 p-6 ${className}`}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef(({ className = "", ...props }, ref) => (
  <h3
    ref={ref}
    className={`text-2xl font-semibold leading-none tracking-tight ${className}`}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef(({ className = "", ...props }, ref) => (
  <p
    ref={ref}
    className={`text-sm text-gray-500 ${className}`}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef(({ className = "", ...props }, ref) => (
  <div ref={ref} className={`p-6 pt-0 ${className}`} {...props} />
));
CardContent.displayName = "CardContent";

// Komponen Alert (Sesuai shadcn/ui minimal)
const Alert = React.forwardRef(({ className = "", variant, ...props }, ref) => {
  const baseClasses = "relative w-full rounded-lg border p-4 [&>svg]:absolute [&>svg]:text-gray-950 [&>svg]:left-4 [&>svg]:top-4 [&>svg+div]:translate-y-[-3px] [&:has(svg)]:pl-11";
  
  const variantClasses = {
    default: "bg-white text-gray-900",
    destructive: "border-red-500/50 text-red-700 [&>svg]:text-red-500 border-red-500 bg-red-50/50",
  }[variant] || "bg-white text-gray-900";

  return (
    <div
      ref={ref}
      role="alert"
      className={`${baseClasses} ${variantClasses} ${className}`}
      {...props}
    />
  );
});
Alert.displayName = "Alert";

const AlertDescription = React.forwardRef(({ className = "", ...props }, ref) => (
  <div
    ref={ref}
    className={`text-sm [&_p]:leading-relaxed ${className}`}
    {...props}
  />
));
AlertDescription.displayName = "AlertDescription";

// ===============================================
// KOMPONEN UTAMA (LoginPage)
// ===============================================

// API URL ke backend Express.js
const API_URL = "http://localhost:5000/api";

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
  
  // Validasi form dasar
  const validateForm = () => {
    if (!email.trim()) {
      setError("Email wajib diisi");
      return false;
    }
    if (!password.trim()) {
      setError("Password wajib diisi");
      return false;
    }
    
    // Validasi format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Format email tidak valid");
      return false;
    }
    
    return true;
  };

  // Fungsi login utama yang disesuaikan dengan backend Express
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!validateForm()) return;
    setLoading(true);

    try {
      console.log("🔄 Attempting login...", { email, isAdminLogin });

      const res = await fetch(`${API_URL}/auth`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          action: "login",
          email: email.trim().toLowerCase(),
          password: password.trim()
        }),
      });

      const data = await res.json();
      console.log("📨 Login response:", data);

      if (!res.ok) {
        // Handle HTTP errors
        throw new Error(data.message || `HTTP error! status: ${res.status}`);
      }

      if (data.status === "success") {
        const user = data.user;

        // Simpan user info ke localStorage sesuai struktur backend
        localStorage.setItem("userEmail", user.email);
        localStorage.setItem("userName", user.name);
        localStorage.setItem("userRole", user.role);
        localStorage.setItem("userId", user.id);
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("userToken", data.token || "valid-token");

        // Simpan data tambahan berdasarkan role
        if (user.role === "customer") {
          localStorage.setItem("userPhone", user.phone || "");
          localStorage.setItem("userAddress", user.address || "");
        }

        // Handle needs_verification untuk OTP
        if (data.needs_verification) {
          console.log("📧 OTP verification required");
          navigate("/verify-otp", { 
            state: { 
              userId: data.user_id || user.id,
              email: user.email 
            } 
          });
          return;
        }

        console.log("✅ Login successful, navigating to:", user.role === "admin" ? "/admin" : "/profile");
        
        // Arahkan sesuai role dengan delay kecil untuk memastikan state tersimpan
        setTimeout(() => {
          navigate(user.role === "admin" ? "/admin" : "/profile", { 
            replace: true 
          });
        }, 100);

      } else {
        setError(data.message || "Login gagal. Periksa kredensial Anda.");
      }
    } catch (err) {
      console.error("❌ Login error:", err);
      
      // Handle specific error cases
      if (err.message.includes("Failed to fetch")) {
        setError("Gagal terhubung ke server. Periksa koneksi internet Anda.");
      } else if (err.message.includes("User not found")) {
        setError("Email tidak terdaftar.");
      } else if (err.message.includes("Invalid password")) {
        setError("Password salah.");
      } else if (err.message.includes("Email belum terverifikasi")) {
        setError("Email belum terverifikasi. Silakan verifikasi email terlebih dahulu.");
      } else {
        setError(err.message || "Terjadi kesalahan saat login");
      }
    } finally {
      setLoading(false);
    }
  };

  // Simpan / muat kembali email (Remember Me)
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

  // Handle enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !loading) {
      handleSubmit(e);
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
                  onKeyPress={handleKeyPress}
                  disabled={loading}
                  required
                  placeholder="Enter your email"
                  className="transition-all duration-200"
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
                    onKeyPress={handleKeyPress}
                    disabled={loading}
                    required
                    placeholder="Enter your password"
                    className="transition-all duration-200 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
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
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="form-checkbox h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500 cursor-pointer"
                      disabled={loading}
                    />
                    <span className="text-sm text-gray-600 select-none">Remember me</span>
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-sm text-red-600 font-medium hover:underline transition-colors duration-200"
                  >
                    Forgot password?
                  </Link>
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-red-600 hover:bg-red-700 text-white transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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

            {!isAdminLogin && (
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Don't have an account?{" "}
                  <Link
                    to="/register"
                    className="text-red-600 hover:text-red-700 font-medium transition-colors duration-200"
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
