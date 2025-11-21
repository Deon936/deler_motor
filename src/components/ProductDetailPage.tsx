import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useCart } from "../contexts/CartContext";
import { toast } from "sonner";
import { ShoppingCart, ArrowLeft } from "lucide-react";
// Local Motorcycle type (previously imported from ../types/motorcycle)
interface Motorcycle {
  id: number;
  name: string;
  price: number;
  image?: string;
  category: string;
  specs?: string;
  available?: boolean;
}

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [motorcycle, setMotorcycle] = useState<Motorcycle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `http://localhost/backend/api/motorcycles.php?id=${id}`
        );
        if (!response.ok) throw new Error("Failed to fetch motorcycle details");

        const data = await response.json();

        // Tangani bila API mengembalikan array tunggal
        const motoData = Array.isArray(data) ? data[0] : data;

        if (!motoData || Object.keys(motoData).length === 0) {
          throw new Error("Motorcycle not found");
        }

        setMotorcycle(motoData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error occurred");
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

  // === Loading State ===
  if (loading)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-600">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mb-4"></div>
        Loading motorcycle details...
      </div>
    );

  // === Error State ===
  if (error)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-red-600">
        <p className="mb-4">{error}</p>
        <Button onClick={() => window.location.reload()} className="bg-red-600">
          Retry
        </Button>
      </div>
    );

  // === Not Found State ===
  if (!motorcycle)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600 bg-gray-50">
        Motorcycle not found.
      </div>
    );

  // === Success State ===
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <Link to="/catalog">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Catalog
          </Button>
        </Link>

        <Card className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
          {/* === Bagian Gambar === */}
          <div className="relative">
            <ImageWithFallback
              src={motorcycle.image}
              alt={motorcycle.name}
              className="w-full h-80 object-cover rounded-lg"
            />
            {motorcycle.available && (
              <Badge className="absolute top-4 left-4 bg-green-600 text-white">
                Available
              </Badge>
            )}
          </div>

          {/* === Bagian Detail === */}
          <CardContent className="space-y-4">
            <h1 className="text-3xl font-semibold">{motorcycle.name}</h1>

            <Badge className="capitalize bg-red-600 text-white">
              {motorcycle.category}
            </Badge>

            <p className="text-gray-700">{motorcycle.specs}</p>

            <p className="text-3xl text-red-600 font-semibold">
              {formatPrice(motorcycle.price)}
            </p>

            <div className="flex gap-4 pt-4">
              <Button
                className="bg-red-600 hover:bg-red-700 text-white"
                onClick={() => {
                  addToCart({
                    id: motorcycle.id,
                    name: motorcycle.name,
                    price: motorcycle.price,
                    image: motorcycle.image ?? "",
                    category: motorcycle.category,
                  });
                  toast.success(`${motorcycle.name} added to cart!`);
                }}
              >
                <ShoppingCart className="w-4 h-4 mr-2" /> Add to Cart
              </Button>

              <Link to={`/payment?bike=${motorcycle.id}`}>
                <Button variant="outline">Buy Now</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
