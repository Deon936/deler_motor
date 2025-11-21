import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Card, CardContent } from "./ui/card";
import { Award, Users, Wrench, Clock, Trophy, Heart } from "lucide-react";

export function AboutPage() {
  const values = [
    {
      icon: Award,
      title: "Quality",
      description: "Komitmen kami untuk menyediakan produk Honda original berkualitas tinggi",
    },
    {
      icon: Users,
      title: "Customer First",
      description: "Kepuasan pelanggan adalah prioritas utama kami",
    },
    {
      icon: Heart,
      title: "Integrity",
      description: "Transparansi dan kejujuran dalam setiap transaksi",
    },
    {
      icon: Trophy,
      title: "Excellence",
      description: "Pelayanan terbaik dengan tim profesional berpengalaman",
    },
  ];

  const achievements = [
    {
      number: "15+",
      label: "Years of Experience",
    },
    {
      number: "10,000+",
      label: "Happy Customers",
    },
    {
      number: "100%",
      label: "Original Products",
    },
    {
      number: "24/7",
      label: "Customer Support",
    },
  ];

  const team = [
    {
      name: "Budi Hartono",
      position: "General Manager",
      description: "Memimpin Daya Motor Cikampek selama 15 tahun",
    },
    {
      name: "Siti Rahma",
      position: "Sales Manager",
      description: "Expert dalam solusi pembiayaan motor",
    },
    {
      name: "Ahmad Fauzi",
      position: "Service Manager",
      description: "Berpengalaman 20 tahun dalam teknisi Honda",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative h-96 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50 z-10" />
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1671354925315-229af5178a83?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3RvcmN5Y2xlJTIwZGVhbGVyfGVufDF8fHx8MTc2MTMyNzI1M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="About Us"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-20 text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="text-5xl mb-4">About Daya Motor Cikampek</h1>
          <p className="text-xl">Your Trusted Honda Partner Since 2010</p>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl mb-6">Our Story</h2>
              <p className="text-gray-700 mb-4">
                Daya Motor Cikampek didirikan pada tahun 2010 dengan visi untuk menjadi dealer Honda terpercaya di wilayah Cikampek dan sekitarnya. Selama lebih dari 15 tahun, kami telah melayani ribuan pelanggan dengan dedikasi penuh.
              </p>
              <p className="text-gray-700 mb-4">
                Sebagai authorized dealer Honda, kami berkomitmen untuk menyediakan produk original dengan harga kompetitif dan pelayanan after-sales yang memuaskan. Tim profesional kami siap membantu Anda menemukan motor Honda yang tepat sesuai kebutuhan.
              </p>
              <p className="text-gray-700">
                Dengan fasilitas showroom modern dan service center lengkap, kami terus berinovasi untuk memberikan pengalaman terbaik bagi setiap pelanggan.
              </p>
            </div>
            <div className="relative h-96">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1672257278876-b9142b7493cc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxIb25kYSUyMG1vdG9yY3ljbGUlMjBzaG93cm9vbXxlbnwxfHx8fDE3NjEzMjcyNTJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Our Showroom"
                className="w-full h-full object-cover rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="py-16 bg-red-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {achievements.map((achievement, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl mb-2">{achievement.number}</div>
                <div className="text-sm md:text-base text-red-100">{achievement.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl mb-4">Our Values</h2>
            <p className="text-gray-600">Nilai-nilai yang kami pegang teguh dalam melayani pelanggan</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card key={index}>
                <CardContent className="pt-6 text-center">
                  <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <value.icon className="w-8 h-8 text-red-600" />
                  </div>
                  <h3 className="mb-2">{value.title}</h3>
                  <p className="text-gray-600 text-sm">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl mb-4">Meet Our Team</h2>
            <p className="text-gray-600">Tim profesional yang siap melayani Anda</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card key={index}>
                <CardContent className="pt-6 text-center">
                  <div className="bg-gray-200 w-32 h-32 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Users className="w-16 h-16 text-gray-400" />
                  </div>
                  <h3 className="mb-1">{member.name}</h3>
                  <p className="text-red-600 mb-3">{member.position}</p>
                  <p className="text-gray-600 text-sm">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Facilities */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl mb-4">Our Facilities</h2>
            <p className="text-gray-600">Fasilitas lengkap untuk kenyamanan Anda</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="pt-6">
                <div className="relative h-48 mb-4">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1672257278876-b9142b7493cc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxIb25kYSUyMG1vdG9yY3ljbGUlMjBzaG93cm9vbXxlbnwxfHx8fDE3NjEzMjcyNTJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                    alt="Showroom"
                    className="w-full h-full object-cover rounded"
                  />
                </div>
                <h3 className="mb-2">Modern Showroom</h3>
                <p className="text-gray-600 text-sm">
                  Showroom luas dengan display motor lengkap dan area test ride
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="relative h-48 mb-4">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1636761358757-0a616eb9e17e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3RvcmN5Y2xlJTIwd29ya3Nob3B8ZW58MXx8fHwxNzYxMzI3MjU0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                    alt="Service Center"
                    className="w-full h-full object-cover rounded"
                  />
                </div>
                <h3 className="mb-2">Service Center</h3>
                <p className="text-gray-600 text-sm">
                  Bengkel resmi Honda dengan teknisi bersertifikat
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="relative h-48 mb-4 bg-gray-200 rounded flex items-center justify-center">
                  <Wrench className="w-16 h-16 text-gray-400" />
                </div>
                <h3 className="mb-2">Spare Parts</h3>
                <p className="text-gray-600 text-sm">
                  Stok spare parts original Honda lengkap dan ready stock
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
