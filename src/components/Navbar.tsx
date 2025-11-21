import { Link, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Menu,
  X,
  User,
  ShoppingCart,
  Home,
  Info,
  Bike,
  Phone,
  Mail,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useCart } from "../contexts/CartContext";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { getTotalItems } = useCart();

  // === CEK LOGIN STATUS ===
  useEffect(() => {
    const userEmail = localStorage.getItem("userEmail");
    setIsLoggedIn(!!userEmail);
  }, [location]);

  // === SCROLL EFFECT ===
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (path: string) => location.pathname === path;

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  return (
    <>
      {/* === TOP BAR (Desktop only) === */}
      <div className="hidden lg:block bg-red-600 text-white text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-2">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>(021) 1234-5678</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>info@dayamotor.com</span>
              </div>
            </div>
            <div className="text-sm">
              Dealer Resmi Honda - Terpercaya Sejak 1990
            </div>
          </div>
        </div>
      </div>

      {/* === MAIN NAVBAR === */}
      <nav
        className={`bg-white sticky top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "shadow-lg backdrop-blur-lg bg-white/95"
            : "shadow-md"
        }`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex justify-between items-center h-16 lg:h-20">
            
            {/* === LOGO & MOBILE MENU BUTTON === */}
            <div className="flex items-center gap-4">
              {/* Mobile Menu Button */}
              <button
                className="lg:hidden text-gray-700 hover:text-red-600 p-2 transition-colors"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>

              {/* Logo */}
              <Link 
                to="/" 
                className="flex items-center gap-2 lg:gap-3 flex-shrink-0"
                onClick={() => setIsMenuOpen(false)}
              >
                <img
                  src="/images/logo.png"
                  alt="Honda Daya Motor"
                  className="h-10 lg:h-12 w-auto hover:scale-105 transition-transform"
                />
                <span className="hidden sm:block text-lg lg:text-xl font-bold text-red-600">
                  Daya Motor
                </span>
              </Link>
            </div>

            {/* === DESKTOP NAVIGATION === */}
            <div className="hidden lg:flex items-center gap-6 xl:gap-8">
              <NavItem to="/" icon={<Home className="w-4 h-4" />} active={isActive("/")}>
                Home
              </NavItem>

              {/* Product langsung ke Catalog */}
              <NavItem to="/catalog" icon={<Bike className="w-4 h-4" />} active={isActive("/catalog")}>
                Product
              </NavItem>

              <NavItem to="/about" icon={<Info className="w-4 h-4" />} active={isActive("/about")}>
                About
              </NavItem>
            </div>

            {/* === DESKTOP ACTIONS === */}
            <div className="hidden lg:flex items-center gap-3 xl:gap-4">
              {/* Cart */}
              <Link to="/cart" className="relative">
                <Button
                  variant="outline"
                  size="icon"
                  className="text-gray-700 hover:text-red-600 border-gray-200 hover:border-red-300 h-10 w-10 relative transition-all"
                >
                  <ShoppingCart className="w-5 h-5" />
                  {getTotalItems() > 0 && (
                    <Badge className="absolute -top-2 -right-2 bg-red-600 text-white h-5 w-5 flex items-center justify-center p-0 text-xs min-w-0">
                      {getTotalItems()}
                    </Badge>
                  )}
                </Button>
              </Link>

              {/* Auth Buttons */}
              {isLoggedIn ? (
                <Link to="/personal-data">
                  <Button
                    variant="outline"
                    className="gap-2 text-gray-700 hover:text-red-600 border-gray-200 hover:border-red-300 h-10 px-4"
                  >
                    <User className="w-4 h-4" />
                    Account
                  </Button>
                </Link>
              ) : (
                <div className="flex items-center gap-2">
                  <Link to="/login">
                    <Button
                      variant="outline"
                      className="gap-2 text-red-600 border-red-600 hover:bg-red-50 h-10 px-4"
                    >
                      <User className="w-4 h-4" />
                      Login
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button className="bg-red-600 hover:bg-red-700 h-10 px-4">
                      Register
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            {/* === MOBILE CART & AUTH === */}
            <div className="flex lg:hidden items-center gap-2">
              <Link to="/cart" className="relative">
                <Button
                  variant="outline"
                  size="icon"
                  className="text-gray-700 hover:text-red-600 border-gray-200 hover:border-red-300 h-10 w-10 relative"
                >
                  <ShoppingCart className="w-5 h-5" />
                  {getTotalItems() > 0 && (
                    <Badge className="absolute -top-2 -right-2 bg-red-600 text-white h-5 w-5 flex items-center justify-center p-0 text-xs min-w-0">
                      {getTotalItems()}
                    </Badge>
                  )}
                </Button>
              </Link>

              {isLoggedIn ? (
                <Link to="/personal-data">
                  <Button
                    variant="outline"
                    size="icon"
                    className="text-gray-700 hover:text-red-600 border-gray-200 hover:border-red-300 h-10 w-10"
                  >
                    <User className="w-5 h-5" />
                  </Button>
                </Link>
              ) : (
                <Link to="/login">
                  <Button
                    variant="outline"
                    size="icon"
                    className="text-gray-700 hover:text-red-600 border-gray-200 hover:border-red-300 h-10 w-10"
                  >
                    <User className="w-5 h-5" />
                  </Button>
                </Link>
              )}
            </div>
          </div>

          {/* === MOBILE MENU === */}
          {isMenuOpen && (
            <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-t border-gray-200 shadow-lg animate-slide-down max-h-[80vh] overflow-y-auto">
              <div className="p-4 space-y-1">
                <MobileNavItem 
                  to="/" 
                  label="Home" 
                  icon={<Home className="w-5 h-5" />}
                  active={isActive("/")}
                  onClick={() => setIsMenuOpen(false)}
                />

                {/* Product langsung ke catalog */}
                <MobileNavItem 
                  to="/catalog" 
                  label="Product" 
                  icon={<Bike className="w-5 h-5" />}
                  active={isActive("/catalog")}
                  onClick={() => setIsMenuOpen(false)}
                />

                <MobileNavItem 
                  to="/about" 
                  label="About" 
                  icon={<Info className="w-5 h-5" />}
                  active={isActive("/about")}
                  onClick={() => setIsMenuOpen(false)}
                />
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}

// === DESKTOP NAV ITEM COMPONENT ===
function NavItem({
  to,
  icon,
  active,
  children,
}: {
  to: string;
  icon: React.ReactNode;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      to={to}
      className={`flex items-center gap-2 text-lg transition relative py-2 ${
        active 
          ? "text-red-600 font-semibold" 
          : "text-gray-700 hover:text-red-600"
      }`}
    >
      {icon}
      {children}
      {active && (
        <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-red-600 rounded-full transition-all" />
      )}
    </Link>
  );
}

// === MOBILE NAV ITEM COMPONENT ===
function MobileNavItem({
  to,
  label,
  icon,
  active,
  onClick,
}: {
  to: string;
  label: string;
  icon: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center gap-3 py-3 px-2 text-lg rounded-lg transition-colors ${
        active 
          ? "bg-red-50 text-red-600 font-semibold" 
          : "text-gray-700 hover:bg-gray-50"
      }`}
    >
      {icon}
      {label}
    </Link>
  );
}
