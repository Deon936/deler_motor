import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "./components/ui/sonner";
import { CartProvider } from "./contexts/CartContext";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { LandingPage } from "./components/LandingPage";
import { HomePage } from "./components/HomePage";
import { CatalogPage } from "./components/CatalogPage";
import { ProductDetailPage } from "./components/ProductDetailPage";
import { AboutPage } from "./components/AboutPage";
import { LoginPage } from "./components/LoginPage";
import { RegisterPage } from "./components/RegisterPage";
import { PaymentPage } from "./components/PaymentPage";
import { PersonalDataPage } from "./components/PersonalDataPage";
import { AdminPanel } from "./components/AdminPanel";
import { CartPage } from "./components/CartPage";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { PaymentStatusPage } from './components/PaymentStatusPage';
import { SpeedInsights } from "@vercel/speed-insights/react"

// Component untuk layout dengan navbar dan footer
const MainLayout = ({ children }: { children: React.ReactNode }) => (
  <>
    <Navbar />
    <main className="flex-1">
      {children}
    </main>
    <Footer />
  </>
);

function App() {
  return (
    <CartProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Routes>
            {/* Pages without navbar and footer */}
            <Route path="/landing" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            {/* Admin Panel (protected, no navbar/footer) */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute requireAdmin>
                  <AdminPanel />
                </ProtectedRoute>
              }
            />

            {/* Regular Pages with navbar and footer */}
            <Route path="/" element={
              <MainLayout>
                <HomePage />
              </MainLayout>
            } />
            
            <Route path="/catalog" element={
              <MainLayout>
                <CatalogPage />
              </MainLayout>
            } />
            
            <Route path="/catalog/:id" element={
              <MainLayout>
                <ProductDetailPage />
              </MainLayout>
            } />
            
            <Route path="/about" element={
              <MainLayout>
                <AboutPage />
              </MainLayout>
            } />
            
            <Route path="/cart" element={
              <MainLayout>
                <CartPage />
              </MainLayout>
            } />
            
            <Route path="/payment" element={
              <MainLayout>
                <PaymentPage />
              </MainLayout>
            } />

            <Route path="/payment-status" element={
              <MainLayout>
                <PaymentStatusPage />
              </MainLayout>
            } />
            
            <Route
              path="/personal-data"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <PersonalDataPage />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            {/* Fallback route untuk 404 */}
            <Route path="*" element={
              <MainLayout>
                <div className="container mx-auto px-4 py-8 text-center">
                  <h1 className="text-2xl font-bold">404 - Halaman Tidak Ditemukan</h1>
                  <p className="mt-4">Halaman yang Anda cari tidak ada.</p>
                </div>
              </MainLayout>
            } />
          </Routes>
          <Toaster />
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;