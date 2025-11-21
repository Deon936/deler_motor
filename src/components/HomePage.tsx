import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Textarea } from "./ui/textarea";
import { toast } from "sonner";
import { AdminLoginButton } from "./AdminLoginButton";
import {
  ArrowRight,
  Bike,
  CreditCard,
  Shield,
  TrendingUp,
  Star,
} from "lucide-react";

const heroImages = [
  { src: "/images/bg.jpg", alt: "Promo Motor 1" },
];

export function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [motorcycles, setMotorcycles] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingReview, setLoadingReview] = useState(false);
  const [user, setUser] = useState(null);

  const navigate = useNavigate();
  const motorcycleId = 1; // contoh id motor (bisa diganti dinamis nanti)

  // === CEK LOGIN ===
  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
    const userData = {
      id: localStorage.getItem("userId"),
      name: localStorage.getItem("userName"),
      email: localStorage.getItem("userEmail"),
      role: localStorage.getItem("userRole"),
    };
    setUser(isAuthenticated && userData.id ? userData : null);
  }, []);

  // === SLIDER ===
  useEffect(() => {
    const intervalId = setInterval(
      () => setCurrentSlide((prev) => (prev + 1) % heroImages.length),
      5000
    );
    return () => clearInterval(intervalId);
  }, []);

  // === FETCH MOTOR ===
  useEffect(() => {
    const fetchMotorcycles = async () => {
      try {
        const res = await fetch("http://localhost/backend/api/advertised_motorcycles.php");
        const result = await res.json();
        if (result.success && Array.isArray(result.data)) {
          setMotorcycles(result.data);
        } else {
          setMotorcycles([]);
        }
      } catch (err) {
        console.error("Gagal memuat data motor:", err);
        setMotorcycles([]);
      } finally {
        setLoading(false);
      }
    };
    fetchMotorcycles();
  }, []);

  // === FETCH REVIEW ===
  const fetchReviews = async () => {
    try {
      const res = await fetch("http://localhost/backend/api/reviews.php");
      const result = await res.json();
      if (result.success && Array.isArray(result.data)) {
        setReviews(result.data);
      } else {
        setReviews([]);
      }
    } catch (err) {
      console.error("Gagal memuat ulasan:", err);
      setReviews([]);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // === HANDLE ULASAN ===
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Harap login terlebih dahulu untuk memberi ulasan.");
      navigate("/login");
      return;
    }
    if (!rating || !comment.trim()) {
      toast.error("Silakan isi rating dan komentar Anda!");
      return;
    }

    setLoadingReview(true);
    try {
      const res = await fetch("http://localhost/backend/api/reviews.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.id,
          motorcycle_id: motorcycleId,
          rating,
          komentar: comment,
        }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Ulasan berhasil dikirim!");
        setRating(0);
        setComment("");
        fetchReviews();
      } else {
        toast.error(data.message || "Gagal mengirim ulasan");
      }
    } catch (err) {
      toast.error("Terjadi kesalahan koneksi server");
    } finally {
      setLoadingReview(false);
    }
  };

  // === LAYANAN ===
  const services = [
    {
      icon: Bike,
      title: "Test Ride",
      description: "Coba langsung motor impian Anda sebelum membeli",
    },
    {
      icon: CreditCard,
      title: "Kredit Mudah",
      description: "Proses cepat dengan bunga kompetitif",
    },
    {
      icon: Shield,
      title: "Garansi Resmi",
      description: "Garansi Honda resmi untuk semua unit",
    },
    {
      icon: TrendingUp,
      title: "Trade-In",
      description: "Tukar tambah motor lama dengan harga terbaik",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* === HERO === */}
      <section className="relative h-[500px] flex items-center justify-center overflow-hidden">
        {heroImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <img src={image.src} alt={image.alt} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/50" />
          </div>
        ))}
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl mb-6 font-bold drop-shadow-lg">
            {/* Tulisan Selamat Datang di Daya Motor Cikampek telah dihapus */}
          </h1>
          {user ? (
            <p className="text-lg mb-4 bg-black/30 px-4 py-2 rounded-lg inline-block">
               Haii {user.name || "Pelanggan"},
            </p>
          ) : (
            <p className="text-lg mb-4 bg-black/30 px-4 py-2 rounded-lg inline-block">
              🔥 Diskon akhir tahun! Dapatkan potongan hingga Rp5.000.000 + Bonus Aksesoris
            </p>
          )}
          <div className="flex justify-center gap-4 flex-wrap">
            <Link to="/catalog">
              <Button size="lg" className="bg-black text-white hover:bg-gray-800 gap-2">
                Lihat Katalog <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <a href="#popular">
              <Button size="lg" className="bg-black text-white hover:bg-gray-800 gap-2">
                Model Populer <ArrowRight className="w-5 h-5" />
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* === LAYANAN === */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl mb-4 font-semibold">Layanan Kami</h2>
          <p className="text-gray-600 mb-10">Kepuasan Anda adalah prioritas utama kami</p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {services.map((service, i) => (
              <Card key={i} className="hover:shadow-lg transition-all">
                <CardContent className="p-6 text-center">
                  <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <service.icon className="w-8 h-8 text-red-600" />
                  </div>
                  <h3 className="font-semibold mb-2">{service.title}</h3>
                  <p className="text-gray-600 text-sm">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

{/* === MOTOR IKLAN / POPULER === */}
<section className="py-16 bg-gradient-to-b from-white to-gray-100" id="popular">
  <div className="max-w-7xl mx-auto px-4">
    <div className="text-center mb-12">
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
        Motor Iklan & Populer
      </h2>
      <p className="text-gray-600 max-w-2xl mx-auto text-lg">
        Temukan motor terbaik dengan penawaran spesial dari kami
      </p>
    </div>

    {loading ? (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    ) : motorcycles.length === 0 ? (
      <div className="text-center py-12">
        <div className="bg-white rounded-2xl shadow-sm p-8 max-w-md mx-auto">
          <Bike className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Belum ada iklan motor
          </h3>
          <p className="text-gray-500 mb-4">
            Saat ini belum ada motor yang diiklankan. Silakan cek kembali nanti.
          </p>
          <Link to="/catalog">
            <Button className="bg-red-600 hover:bg-red-700 text-white">
              Jelajahi Katalog
            </Button>
          </Link>
        </div>
      </div>
    ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {motorcycles.map((motor) => (
          <Card 
            key={motor.id} 
            className="group hover:shadow-2xl transition-all duration-300 border-0 bg-white rounded-2xl overflow-hidden cursor-pointer transform hover:-translate-y-2"
          >
            <CardHeader className="p-0 relative">
              <div className="relative overflow-hidden">
                <img
                  src={`http://localhost/backend/${motor.image}`}
                  alt={motor.name}
                  className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                    POPULER
                  </span>
                </div>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
              </div>
            </CardHeader>
            
            <CardContent className="p-6">
              <div className="mb-4">
                <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">
                  {motor.name}
                </h3>
                <p className="text-gray-500 text-sm mb-3 bg-gray-100 px-3 py-1 rounded-full inline-block">
                  {motor.category}
                </p>
              </div>

              <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                {motor.description}
              </p>

              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-2xl font-bold text-red-600">
                    Rp {parseFloat(motor.price).toLocaleString("id-ID")}
                  </p>
                  <p className="text-xs text-gray-500">Harga OTR</p>
                </div>
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star 
                      key={star}
                      className="w-4 h-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
              </div>

              <Link to="/catalog">
                <Button className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-red-200">
                  Lihat Detail
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    )}

    {/* CTA Section */}
    {motorcycles.length > 0 && (
      <div className="text-center mt-12">
        <Link to="/catalog">
          <Button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl text-lg font-semibold transition-all duration-300 transform hover:scale-105">
            Lihat Semua Motor
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </Link>
      </div>
    )}
  </div>
</section>

      {/* === REVIEW === */}
      <section className="py-16 bg-white" id="review">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-semibold text-center mb-8">Ulasan Pelanggan</h2>
          {reviews.length === 0 ? (
            <p className="text-center text-gray-500 mb-6">Belum ada ulasan.</p>
          ) : (
            <div className="space-y-4 mb-10">
              {reviews.map((r, i) => (
                <Card key={i} className="shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center mb-2">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className={`w-4 h-4 ${s <= r.rating ? "text-yellow-400" : "text-gray-300"}`} />
                      ))}
                    </div>
                    <p className="text-gray-800 mb-1">{r.komentar || "(tanpa komentar)"}</p>
                    <p className="text-sm text-gray-500">— {r.nama_user || "Anonim"}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Form Ulasan */}
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-lg text-center">
                {user ? "Beri Ulasan Anda" : "Login untuk memberi ulasan"}
              </CardTitle>
            </CardHeader>
            {user && (
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="flex justify-center space-x-1 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHover(star)}
                        onMouseLeave={() => setHover(0)}
                        className={`text-3xl transition ${
                          star <= (hover || rating) ? "text-yellow-400" : "text-gray-300"
                        }`}
                      >
                        ★
                      </button>
                    ))}
                  </div>

                  <Textarea
                    placeholder="Tulis ulasan Anda di sini..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />

                  <Button
                    type="submit"
                    className="w-full bg-black hover:bg-gray-800 text-white"
                    disabled={loadingReview}
                  >
                    {loadingReview ? "Mengirim..." : "Kirim Ulasan"}
                  </Button>
                </form>
              </CardContent>
            )}
          </Card>
        </div>
      </section>

    
    </div>
  );
}