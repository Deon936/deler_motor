import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Facebook, Instagram, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-red-600 text-white px-3 py-1 rounded">
                HONDA
              </div>
              <span>Daya Motor</span>
            </div>
            <p className="text-gray-400 text-sm">
              Your trusted Honda motorcycle dealer in Cikampek. Quality bikes, excellent service.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/catalog" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Catalog
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white transition-colors text-sm">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-gray-400 text-sm">
                <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>Dealer Honda Daya Motor Cikampek, Jl. Jend. Sudirman No.144, Wancimekar, Kec. Kota Baru, Karawang, Jawa Barat 41373</span>
              </li>
              <li className="flex items-center gap-2 text-gray-400 text-sm">
                <Phone className="w-5 h-5 flex-shrink-0" />
                <span>+62 81573567708</span>
              </li>
              <li className="flex items-center gap-2 text-gray-400 text-sm">
                <Mail className="w-5 h-5 flex-shrink-0" />
                <span>infodayamotor@gmail.com</span>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="mb-4">Follow Us</h3>
            <div className="flex gap-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800 p-2 rounded-full hover:bg-red-600 transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800 p-2 rounded-full hover:bg-red-600 transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800 p-2 rounded-full hover:bg-red-600 transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
            <div className="mt-6">
              <p className="text-gray-400 text-sm">Business Hours:</p>
              <p className="text-sm mt-1">Mon - Sat: 08:00 - 17:00</p>
              <p className="text-sm">Sunday: Closed</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; 2025 Daya Motor Cikampek. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
