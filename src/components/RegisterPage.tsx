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
    address: "",
    id_number: ""
  });
  const navigate = useNavigate();

  // 🔹 PERBAIKAN: Update API URL ke backend Express.js
  const API_BASE = "http://localhost:5000/api";

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

    // Validasi nomor telepon (minimal 10 digit, maksimal 15 digit)
    const phoneRegex = /^[0-9]{10,15}$/;
    if (!phoneRegex.test(formData.phone.replace(/\D/g, ''))) {
      setError("Format nomor telepon tidak valid (10-15 digit angka)");
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
    
    // Format phone number input
    if (name === "phone") {
      // Hanya allow angka dan format nomor telepon
      const formattedValue = value.replace(/\D/g, '');
      setFormData(prev => ({
        ...prev,
        [name]: formattedValue
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // 🔹 PERBAIKAN: Fungsi register yang disesuaikan dengan backend Express
  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) return;

    setLoading(true);
    try {
      // 🔹 PERBAIKAN: Sesuaikan dengan struktur data backend Express
      const requestData = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone,
        password: formData.password,
        address: formData.address.trim(),
        id_number: formData.id_number.trim()
      };

      console.log("🚀 Sending registration request:", requestData);

      const response = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      console.log("📡 Response status:", response.status);

      const data = await response.json();
      
      console.log("✅ Parsed response data:", data);

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      if (data.success) {
        // 🔹 PERBAIKAN: Handle OTP verification flow
        if (data.data?.needs_verification || data.data?.otp_code) {
          toast.success("Registrasi berhasil! Silakan verifikasi email Anda.");
          navigate("/verify-otp", { 
            replace: true,
            state: { 
              userId: data.data.user_id || data.data.id,
              email: formData.email,
              message: "Kode OTP telah dikirim ke email Anda" 
            }
          });
        } else {
          toast.success("Registrasi berhasil! Silakan login.");
          navigate("/login", { 
            replace: true,
            state: { 
              registeredEmail: formData.email,
              message: "Registrasi berhasil! Silakan login dengan akun Anda." 
            }
          });
        }
      } else {
        throw new Error(data.message || "Registrasi gagal");
      }
    } catch (err) {
      console.error("💥 Registration error:", err);
      
      // 🔹 PERBAIKAN: Handle specific error cases
      let errorMessage = err.message || "Terjadi kesalahan saat registrasi. Silakan coba lagi.";
      
      if (err.message.includes("Failed to fetch")) {
        errorMessage = "Gagal terhubung ke server. Periksa koneksi internet Anda.";
      } else if (err.message.includes("Email already exists") || err.message.includes("already registered")) {
        errorMessage = "Email sudah terdaftar. Silakan gunakan email lain.";
      } else if (err.message.includes("Invalid email format")) {
        errorMessage = "Format email tidak valid.";
      } else if (err.message.includes("Password must be at least")) {
        errorMessage = "Password harus minimal 6 karakter.";
      } else if (err.message.includes("Phone number already exists")) {
        errorMessage = "Nomor telepon sudah terdaftar. Silakan gunakan nomor lain.";
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    toast.info("Fitur pendaftaran dengan Google akan segera hadir!");
  };

  // 🔹 PERBAIKAN: Handle enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !loading) {
      handleRegister(e);
    }
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

            {/* 🔹 PERBAIKAN: Demo info */}
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-sm text-blue-800 font-medium">
                Testing Info:
              </p>
              <p className="text-xs text-blue-700 mt-1">
                • Gunakan email yang belum terdaftar<br/>
                • Password minimal 6 karakter<br/>
                • Sistem akan mengirim OTP ke email
              </p>
            </div>

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
                    onKeyPress={handleKeyPress}
                    disabled={loading}
                    required
                    className="transition-all duration-200"
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
                    onKeyPress={handleKeyPress}
                    disabled={loading}
                    required
                    className="transition-all duration-200"
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
                    onKeyPress={handleKeyPress}
                    disabled={loading}
                    required
                    className="transition-all duration-200"
                  />
                  <p className="text-xs text-gray-500 mt-1">Format: 10-15 digit angka</p>
                </div>

                {/* 🔹 PERBAIKAN: Tambahan fields opsional */}
                <div>
                  <Label htmlFor="address">Alamat (Opsional)</Label>
                  <Input
                    id="address"
                    name="address"
                    type="text"
                    placeholder="Jl. Contoh No. 123"
                    value={formData.address}
                    onChange={handleChange}
                    onKeyPress={handleKeyPress}
                    disabled={loading}
                    className="transition-all duration-200"
                  />
                </div>

                <div>
                  <Label htmlFor="id_number">Nomor KTP (Opsional)</Label>
                  <Input
                    id="id_number"
                    name="id_number"
                    type="text"
                    placeholder="3273xxxxxxxxxxxx"
                    value={formData.id_number}
                    onChange={handleChange}
                    onKeyPress={handleKeyPress}
                    disabled={loading}
                    className="transition-all duration-200"
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
                        onKeyPress={handleKeyPress}
                        disabled={loading}
                        minLength={6}
                        required
                        className="pr-10 transition-all duration-200"
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
                        onKeyPress={handleKeyPress}
                        disabled={loading}
                        minLength={6}
                        required
                        className="pr-10 transition-all duration-200"
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
                </div>
              </div>

              <div className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg">
                <input 
                  type="checkbox" 
                  className="mt-1 rounded border-gray-300 text-red-600 focus:ring-red-500 cursor-pointer" 
                  required 
                  disabled={loading}
                />
                <span className="text-sm text-gray-600 select-none">
                  Saya setuju dengan <Link to="/terms" className="text-red-600 hover:underline">Terms of Service</Link> dan <Link to="/privacy" className="text-red-600 hover:underline">Privacy Policy</Link>
                </span>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-red-600 hover:bg-red-700 text-white transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
                className="w-full border-gray-300 hover:bg-gray-50 transition-colors duration-200"
              >
                <svg className="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                  <path fill="#4285F4" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.91 3.57 30.77 1 24 1 15.3 1 7.85 5.25 3.15 11.51l7.98 6.19C12.43 12.9 17.7 9.5 24 9.5z"/>
                  <path fill="#34A853" d="M46.7 24.5c0-.98-.08-1.72-.25-2.65H24v4.61h12.42c-.47 2.47-2.73 4.34-5.92 4.34-3.5 0-6.44-2.5-7.42-5.83l-7.98 6.19c.92 3.86 4.6 6.64 8.78 6.64 6.2 0 11.12-4.14 12.51-10.26z"/>
                  <path fill="#FBBC05" d="M10.94 28.52c-.22-.61-.35-1.28-.35-1.99s.13-1.38.35-1.99L2.91 18.25C1.65 21.01 1 23.63 1 26.5s.65 5.49 1.91 8.25l7.03-5.48z"/>
                  <path fill="#EA4335" d="M24 43c4.52 0 8.67-1.64 11.97-4.4l-7.98-6.19c-1.74 1.4-3.97 2.21-5.99 2.21-4.3 0-7.98-2.93-9.2-6.83l-7.99 6.19C7.85 41.75 15.3 46 24 46z"/>
                  <path fill="none" d="M0 0h48v48H0z"/>
                </svg>
                Daftar dengan Google
              </Button>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Sudah punya akun?{" "}
                  <Link 
                    to="/login" 
                    className="text-red-600 hover:text-red-700 font-medium transition-colors duration-200"
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
