import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Eye, EyeOff, Mail, Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";
import { toast } from "sonner";

export function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();

  const API_BASE = "http://localhost/backend/api";

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError("Nama lengkap harus diisi");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      setError("Email harus diisi");
      return false;
    }
    if (!emailRegex.test(formData.email)) {
      setError("Format email tidak valid");
      return false;
    }

    if (!formData.phone.trim()) {
      setError("Nomor telepon harus diisi");
      return false;
    }

    if (!formData.password) {
      setError("Password harus diisi");
      return false;
    }
    if (formData.password.length < 6) {
      setError("Password minimal 6 karakter");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Password dan konfirmasi password tidak cocok");
      return false;
    }

    return true;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (error) setError("");
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) return;

    setLoading(true);
    try {
      const requestData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password
      };

      console.log("🚀 Sending registration request:", requestData);

      const response = await fetch(`${API_BASE}/register.php`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      console.log("📡 Response received, status:", response.status);

      const data = await response.json();
      
      console.log("✅ Parsed response data:", data);

      if (data.status === "success") {
        toast.success("Registrasi berhasil! Silakan login.");
        navigate("/login", { 
          replace: true,
          state: { 
            registeredEmail: formData.email,
            message: "Registrasi berhasil! Silakan login dengan akun Anda." 
          }
        });
      } else {
        throw new Error(data.message || "Registrasi gagal");
      }
    } catch (err) {
      console.error("💥 Registration error:", err);
      const errorMessage = err.message || "Terjadi kesalahan saat registrasi. Silakan coba lagi.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    toast.info("Fitur pendaftaran dengan Google akan segera hadir!");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
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
            Buat Akun Baru
          </h1>
          <p className="text-gray-600">
            Daftar untuk memulai perjalanan Honda Anda
          </p>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl">
              Form Pendaftaran
            </CardTitle>
            <CardDescription>
              Isi informasi Anda untuk membuat akun
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="break-words">{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Nama Lengkap *</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={loading}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={loading}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="phone">Nomor Telepon *</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="081234567890"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={loading}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="password">Password *</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Minimal 6 karakter"
                        value={formData.password}
                        onChange={handleChange}
                        disabled={loading}
                        minLength={6}
                        required
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
                  
                  <div>
                    <Label htmlFor="confirmPassword">Konfirmasi Password *</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showPassword ? "text" : "password"}
                        placeholder="Ulangi password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        disabled={loading}
                        minLength={6}
                        required
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
                </div>
              </div>

              <div className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg">
                <input 
                  type="checkbox" 
                  className="mt-1 rounded border-gray-300 text-red-600 focus:ring-red-500" 
                  required 
                  disabled={loading}
                />
                <span className="text-sm text-gray-600">
                  Saya setuju dengan Terms of Service dan Privacy Policy
                </span>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-red-600 hover:bg-red-700 text-white"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Mendaftarkan...
                  </>
                ) : (
                  "Daftar Sekarang"
                )}
              </Button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">Atau</span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={handleGoogleRegister}
                disabled={loading}
                className="w-full"
              >
                <Mail className="w-4 h-4 mr-2" />
                Daftar dengan Google
              </Button>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Sudah punya akun?{" "}
                  <Link 
                    to="/login" 
                    className="text-red-600 hover:text-red-700 font-medium"
                  >
                    Login di sini
                  </Link>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}