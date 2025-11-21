import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Star, MapPin, Phone, Mail, ArrowRight, Award, Users, Wrench } from "lucide-react";
import { AdminLoginButton } from "./AdminLoginButton";

export function LandingPage() {
  const reviews = [
    {
      name: "Budi Santoso",
      rating: 5,
      comment: "Pelayanan sangat memuaskan! Staff ramah dan profesional. Proses kredit juga mudah.",
      date: "October 2025",
    },
    {
      name: "Dewi Lestari",
      rating: 5,
      comment: "Dealer Honda terbaik di Cikampek. Harga kompetitif dan bonus menarik!",
      date: "October 2025",
    },
    {
      name: "Ahmad Ridwan",
      rating: 5,
      comment: "Beli motor di sini sangat puas. Test ride lengkap dan after sales service mantap.",
      date: "September 2025",
    },
  ];

  const features = [
    {
      icon: Award,
      title: "Authorized Dealer",
      description: "Resmi Honda dengan produk original",
    },
    {
      icon: Users,
      title: "Professional Team",
      description: "Tim berpengalaman & bersertifikat",
    },
    {
      icon: Wrench,
      title: "After Sales Service",
      description: "Service center & spare parts lengkap",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50 z-10" />
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1672257278876-b9142b7493cc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxIb25kYSUyMG1vdG9yY3ljbGUlMjBzaG93cm9vbXxlbnwxfHx8fDE3NjEzMjcyNTJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Honda Showroom"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-20 text-center text-white max-w-4xl mx-auto px-4">
          <div className="bg-red-600 text-white px-6 py-2 rounded inline-block mb-4">
            HONDA
          </div>
          <h1 className="text-5xl md:text-6xl mb-6">Daya Motor Cikampek</h1>
          <p className="text-xl mb-8 text-gray-200">
            Your Trusted Honda Motorcycle Dealer in Cikampek
          </p>
          <p className="text-lg mb-8 text-gray-300">
            🎉 Promo Spesial! Dapatkan diskon hingga 5 juta + FREE aksesoris untuk pembelian bulan ini!
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link to="/catalog">
              <Button size="lg" className="bg-red-600 hover:bg-red-700 gap-2">
                Lihat Katalog
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link to="/about">
              <Button size="lg" variant="outline" className="bg-white/10 text-white border-white hover:bg-white/20">
                Tentang Kami
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index}>
                <CardContent className="pt-6 text-center">
                  <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-8 h-8 text-red-600" />
                  </div>
                  <h3 className="mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl mb-4">Customer Reviews</h2>
            <p className="text-gray-600">Apa kata pelanggan kami tentang Daya Motor Cikampek</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.map((review, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4">{review.comment}</p>
                  <div className="border-t pt-4">
                    <p className="text-gray-600">{review.date}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact & Location */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl mb-4">Visit Our Showroom</h2>
            <p className="text-gray-600">Kami siap melayani Anda dengan sepenuh hati</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardContent className="pt-6">
                <h3 className="mb-6">Contact Information</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-gray-700">Jl. Raya Cikampek No. 123</p>
                      <p className="text-gray-700">Cikampek, Karawang</p>
                      <p className="text-gray-700">West Java 41373</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-6 h-6 text-red-600 flex-shrink-0" />
                    <div>
                      <p className="text-gray-700">+62 264 123 4567</p>
                      <p className="text-gray-700">+62 812 3456 7890 (WhatsApp)</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-6 h-6 text-red-600 flex-shrink-0" />
                    <p className="text-gray-700">info@dayamotor.com</p>
                  </div>
                </div>
                <div className="mt-6 pt-6 border-t">
                  <p className="text-gray-700 mb-2">Business Hours:</p>
                  <p className="text-gray-700">Monday - Saturday: 08:00 - 17:00</p>
                  <p className="text-gray-700">Sunday: Closed</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <h3 className="mb-6">Location Map</h3>
                <div className="bg-gray-200 h-80 rounded-lg flex items-center justify-center">
                  <div className="text-center text-gray-600">
                    <MapPin className="w-12 h-12 mx-auto mb-2" />
                    <p>Map Location</p>
                    <p className="text-sm">Daya Motor Cikampek</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-red-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl mb-4">Ready to Own Your Dream Honda?</h2>
          <p className="text-xl mb-8">Proses cepat, kredit mudah, dan penawaran terbaik menanti Anda!</p>
          <Link to="/catalog">
            <Button size="lg" className="bg-white text-red-600 hover:bg-gray-100 gap-2">
              Explore Our Motorcycles
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Admin Login FAB */}
      <AdminLoginButton />
    </div>
  );
}
