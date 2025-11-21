import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Badge } from "./ui/badge";
import { useCart } from "../contexts/CartContext";
import { ShoppingCart, Search } from "lucide-react";
import { toast } from "sonner";
import { Motorcycle } from "../types/motorcycle";

export function CatalogPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [searchQuery, setSearchQuery] = useState("");
  const [motorcycles, setMotorcycles] = useState<Motorcycle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchMotorcycles = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("http://localhost/backend/api/motorcycles.php");
        if (!response.ok) throw new Error("Failed to fetch motorcycles");
        const data = await response.json();
        setMotorcycles(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };
    fetchMotorcycles();
  }, []);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);

  // === FILTERING DAN SORTING ===
  let filteredMotorcycles = motorcycles
    .filter((moto) =>
      selectedCategory === "all" ? true : moto.category === selectedCategory
    )
    .filter(
      (moto) =>
        moto.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        moto.specs.toLowerCase().includes(searchQuery.toLowerCase())
    );

  if (sortBy === "price-low") {
    filteredMotorcycles.sort((a, b) => a.price - b.price);
  } else if (sortBy === "price-high") {
    filteredMotorcycles.sort((a, b) => b.price - a.price);
  } else {
    filteredMotorcycles.sort((a, b) => a.name.localeCompare(b.name));
  }

  if (isLoading)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading motorcycles...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center text-red-600">
          <p>Error: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* === Header === */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Motorcycle Catalog</h1>
          <p className="text-gray-600">
            Pilih motor Honda impian Anda dari koleksi lengkap kami.
          </p>
        </div>

        {/* === Search Bar === */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Cari motor berdasarkan nama atau spesifikasi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border border-gray-300 rounded-lg py-2 pl-10 pr-4 focus:ring-2 focus:ring-red-600 focus:outline-none"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
          </div>
        </div>

        {/* === Filters === */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1">
            <label className="block text-sm mb-2 text-gray-700">Category</label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="sport">Sport</SelectItem>
                <SelectItem value="scooter">Scooter</SelectItem>
                <SelectItem value="adventure">Adventure</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1">
            <label className="block text-sm mb-2 text-gray-700">Sort By</label>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* === Results Count === */}
        <div className="mb-4 text-gray-600">
          Showing {filteredMotorcycles.length} motorcycles
        </div>

        {/* === Grid === */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredMotorcycles.map((motorcycle) => (
            <Card
              key={motorcycle.id}
              className="overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="relative h-64">
                <ImageWithFallback
                  src={motorcycle.image}
                  alt={motorcycle.name}
                  className="w-full h-full object-cover"
                />
                {motorcycle.available && (
                  <Badge className="absolute top-4 left-4 bg-green-600">
                    Available
                  </Badge>
                )}
                <Badge className="absolute top-4 right-4 bg-red-600 capitalize">
                  {motorcycle.category}
                </Badge>
              </div>

              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-2">{motorcycle.name}</h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {motorcycle.specs}
                </p>
                <p className="text-red-600 text-2xl font-bold mb-4">
                  {formatPrice(motorcycle.price)}
                </p>

                <div className="grid grid-cols-2 gap-2">
                  <Link
                    to={`/payment?bike=${motorcycle.id}`}
                    className="col-span-2"
                  >
                    <Button className="w-full bg-red-600 hover:bg-red-700">
                      Buy Now
                    </Button>
                  </Link>

                  <Button
                    variant="outline"
                    className="gap-2"
                    onClick={() => {
                      addToCart({
                        id: motorcycle.id,
                        name: motorcycle.name,
                        price: motorcycle.price,
                        image: motorcycle.image,
                        category: motorcycle.category,
                      });
                      toast.success(`${motorcycle.name} added to cart!`);
                    }}
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Add
                  </Button>

                  <Link to={`/catalog/${motorcycle.id}`}>
                    <Button variant="outline" className="w-full">
                      Details
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredMotorcycles.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">
              Tidak ada motor yang cocok dengan pencarian Anda.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
