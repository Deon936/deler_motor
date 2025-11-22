import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { ShoppingCart, Search } from "lucide-react";
import { toast } from "sonner";

const API_BASE_URL = "http://localhost:5000/api";

interface Motorcycle {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  specs: string;
  description?: string;
  features?: string;
  available: boolean;
  created_at: string;
  updated_at: string;
}

export function CatalogPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [motorcycles, setMotorcycles] = useState<Motorcycle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMotorcycles = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        console.log("🔄 Fetching motorcycles from API...");
        const response = await fetch(`${API_BASE_URL}/motorcycles`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        console.log("✅ API Response:", result);
        
        if (result.success && Array.isArray(result.data)) {
          setMotorcycles(result.data);
          console.log(`📦 Loaded ${result.data.length} motorcycles`);
        } else {
          throw new Error("Invalid response format from API");
        }
        
      } catch (err) {
        console.error("❌ Error fetching motorcycles:", err);
        setError(err instanceof Error ? err.message : "Failed to load motorcycles");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMotorcycles();
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Filter motorcycles based on category and search
  const filteredMotorcycles = motorcycles.filter(moto => {
    const matchesCategory = selectedCategory === "all" || moto.category === selectedCategory;
    const matchesSearch = 
      moto.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (moto.specs && moto.specs.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (moto.description && moto.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  const handleAddToCart = (motorcycle: Motorcycle) => {
    // For now, just show a toast. You can integrate with your cart context later
    toast.success(`${motorcycle.name} added to cart!`);
    console.log("Added to cart:", motorcycle);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading motorcycles...</p>
          <p className="text-sm text-gray-500 mt-2">Fetching from API</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center text-red-600 max-w-md">
          <h2 className="text-xl font-bold mb-2">Failed to Load Catalog</h2>
          <p className="mb-4 bg-red-50 p-3 rounded">{error}</p>
          <div className="space-y-2">
            <button
              onClick={() => window.location.reload()}
              className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Try Again
            </button>
            <p className="text-sm text-gray-600">
              API: {API_BASE_URL}/motorcycles
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Honda Motorcycle Catalog
          </h1>
          <p className="text-gray-600 text-lg">
            Discover our complete range of Honda motorcycles
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow text-center">
            <div className="text-2xl font-bold text-gray-900">{motorcycles.length}</div>
            <div className="text-gray-600">Total Motorcycles</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow text-center">
            <div className="text-2xl font-bold text-green-600">
              {motorcycles.filter(m => m.available).length}
            </div>
            <div className="text-gray-600">Available Now</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow text-center">
            <div className="text-2xl font-bold text-red-600">
              {new Set(motorcycles.map(m => m.category)).size}
            </div>
            <div className="text-gray-600">Categories</div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Motorcycles
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by name, specs, or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="all">All Categories</option>
                <option value="sport">Sport</option>
                <option value="scooter">Scooter</option>
                <option value="adventure">Adventure</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Info */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600">
            Showing <span className="font-semibold">{filteredMotorcycles.length}</span> of{" "}
            <span className="font-semibold">{motorcycles.length}</span> motorcycles
          </p>
          {(searchQuery || selectedCategory !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="text-red-600 hover:text-red-700 font-medium"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Motorcycles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredMotorcycles.map((motorcycle) => (
            <Card
              key={motorcycle.id}
              className="overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-200"
            >
              {/* Image */}
              <div className="relative h-48 bg-gray-100">
                <img
                  src={motorcycle.image}
                  alt={motorcycle.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "https://via.placeholder.com/300x200/FF6B6B/FFFFFF?text=No+Image";
                  }}
                />
                <div className="absolute top-3 left-3 space-y-1">
                  <Badge className={`
                    ${motorcycle.available 
                      ? 'bg-green-600 hover:bg-green-700' 
                      : 'bg-gray-500 hover:bg-gray-600'
                    }
                  `}>
                    {motorcycle.available ? 'Available' : 'Out of Stock'}
                  </Badge>
                  <Badge className="bg-red-600 capitalize">
                    {motorcycle.category}
                  </Badge>
                </div>
              </div>

              {/* Content */}
              <CardContent className="p-4">
                <h3 className="font-bold text-lg mb-2 text-gray-900">
                  {motorcycle.name}
                </h3>
                
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {motorcycle.description}
                </p>

                <div className="text-xs text-gray-500 mb-2">
                  <strong>Specs:</strong> {motorcycle.specs}
                </div>

                {motorcycle.features && (
                  <div className="text-xs text-gray-500 mb-3">
                    <strong>Features:</strong> {motorcycle.features}
                  </div>
                )}

                <div className="flex items-center justify-between mb-4">
                  <span className="text-red-600 font-bold text-xl">
                    {formatPrice(motorcycle.price)}
                  </span>
                  <span className="text-xs text-gray-500">
                    ID: {motorcycle.id}
                  </span>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-2">
                  <Link 
                    to={`/payment?motorcycle=${motorcycle.id}`} 
                    className="col-span-2"
                  >
                    <Button 
                      className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold"
                      disabled={!motorcycle.available}
                    >
                      {motorcycle.available ? 'Buy Now' : 'Out of Stock'}
                    </Button>
                  </Link>
                  
                  <Button
                    variant="outline"
                    onClick={() => handleAddToCart(motorcycle)}
                    disabled={!motorcycle.available}
                    className="flex items-center gap-2"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Add to Cart
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

        {/* Empty State */}
        {filteredMotorcycles.length === 0 && !isLoading && (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No motorcycles found
            </h3>
            <p className="text-gray-600 mb-4 max-w-md mx-auto">
              {searchQuery || selectedCategory !== 'all' 
                ? "No motorcycles match your search criteria. Try adjusting your filters."
                : "No motorcycles are currently available in the catalog."
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
