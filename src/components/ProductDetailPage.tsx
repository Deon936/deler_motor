import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "./ui/button";
import { useCart } from "../contexts/CartContext";
import { toast } from "sonner";
import { ShoppingCart, ArrowLeft } from "lucide-react";

interface Motorcycle {
  id: number;
  name: string;
  price: number;
  image?: string;
  category: string;
  available?: boolean;
}

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [motorcycle, setMotorcycle] = useState<Motorcycle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useCart();

  const API_BASE = "http://localhost:5000/api";

  useEffect(() => {
    // ... (Logika fetchDetail) ...
    const fetchDetail = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`${API_BASE}/motor-detail?id=${id}`);
        if (!response.ok) throw new Error(`Failed: ${response.status}`);

        const data = await response.json();

        if (data.success && data.data) {
          setMotorcycle(data.data);
        } else throw new Error(data.message || "Motor not found");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchDetail();
  }, [id]);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);

  const getFeatures = () => {
    return ["High Performance", "Modern Design", "Fuel Efficient"];
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-red-600">{error}</p>
        <Button onClick={() => window.location.reload()}>Reload</Button>
      </div>
    );

  if (!motorcycle) return <div>No Data</div>;

  const features = getFeatures();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <Link to="/catalog">
          <Button variant="ghost" className="gap-2 mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to Catalog
          </Button>
        </Link>

        {/* PENERAPAN JARAK (GAP) DI SINI */}
        <div className="grid grid-cols-1 md:grid-cols-2 **gap-10**">
          {/* Sisi Kiri: Gambar */}
          <div className="p-4 border bg-white rounded-xl shadow-lg">
            <img
              src={motorcycle.image ?? "https://via.placeholder.com/600"}
              alt={motorcycle.name}
              className="w-full h-auto object-contain max-h-[400px]"
            />
          </div>

          {/* Sisi Kanan: Detail & Aksi */}
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">{motorcycle.name}</h1>

            <p className="text-4xl font-bold text-red-600">
              {formatPrice(motorcycle.price)}
            </p>
            <p className="text-gray-500 text-sm">Harga OTR Jakarta</p>

            <Button
              className="bg-red-600 w-full"
              disabled={!motorcycle.available}
              onClick={() => {
                addToCart({
                  id: motorcycle.id,
                  name: motorcycle.name,
                  price: motorcycle.price,
                  image: motorcycle.image ?? "",
                  category: motorcycle.category,
                });
                toast.success(`${motorcycle.name} added to cart`);
              }}
            >
              <ShoppingCart className="mr-2" />
              {motorcycle.available ? "Add to Cart" : "Out of Stock"}
            </Button>

            <h3 className="font-semibold text-lg">Fitur Utama</h3>
            <div className="grid grid-cols-2 gap-2">
              {features.map((f, i) => (
                <div key={i} className="p-2 bg-white rounded border text-sm">
                  {f}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
