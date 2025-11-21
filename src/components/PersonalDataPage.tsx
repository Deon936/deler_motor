import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  User, ShoppingBag, CreditCard, Star, Clock, LogOut, Settings, ChevronRight,
  Calendar, DollarSign, FileText, Download, Eye, Menu, X, ChevronDown
} from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Tabs, TabsContent } from "./ui/tabs";
import { Badge } from "./ui/badge";
import { toast } from "sonner";

const API_CUSTOMERS = "http://localhost/backend/api/profile.php";
const API_ORDERS = "http://localhost/backend/api/orders.php";
const API_PAYMENTS = "http://localhost/backend/api/manual_payment.php";

// Tipe data yang lebih jelas
interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  created_at?: string;
}

interface Order {
  id: number;
  order_code: string;
  customer_name: string;
  motorcycle_name: string;
  total_price: number;
  payment_method: 'cash' | 'credit';
  status: string;
  payment_status: string;
  order_date: string;
  customer_phone?: string;
  down_payment?: number;
  down_payment_percent?: number;
  loan_term?: number;
  monthly_installment?: number;
  payment_proof?: string;
}

interface PaymentHistory {
  id: number;
  order_id: number;
  payment_code: string;
  payment_method: 'bank_transfer' | 'ewallet' | 'qr_code' | 'cash';
  amount: number;
  status: 'pending' | 'paid' | 'expired' | 'cancelled';
  created_at: string;
  expired_at: string;
  bank_name?: string;
  account_number?: string;
  ewallet_type?: string;
  order?: Order;
}

export function PersonalDataPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");
  const [profile, setProfile] = useState<UserProfile | any>({});
  const [orders, setOrders] = useState<Order[]>([]);
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistory[]>([]);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [loadingPayments, setLoadingPayments] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);

  // Detect screen size
  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setSidebarOpen(true);
        setMobileDropdownOpen(false);
      } else {
        setSidebarOpen(false);
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Close sidebar when clicking on mobile
  useEffect(() => {
    if (sidebarOpen && isMobile) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [sidebarOpen, isMobile]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (isMobile) {
      setSidebarOpen(false);
      setMobileDropdownOpen(false);
    }
  };

  const toggleSidebar = () => {
    if (isMobile) {
      setMobileDropdownOpen(!mobileDropdownOpen);
    } else {
      setSidebarOpen(!sidebarOpen);
    }
  };

  const closeMobileDropdown = () => {
    setMobileDropdownOpen(false);
  };

  // Fetch Data Customer
  const fetchUser = async () => {
    try {
      setLoadingProfile(true);
      const userEmail = localStorage.getItem("userEmail");
      
      if (!userEmail) {
        navigate("/login");
        return;
      }

      const res = await fetch(`${API_CUSTOMERS}?email=${userEmail}`);
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();

      if (data.success) {
        setProfile(data.data);
        if (data.data.id) {
          fetchOrders(data.data.id);
          fetchPaymentHistory(data.data.id);
        }
      } else {
        throw new Error(data.message || "Gagal memuat profil");
      }
    } catch (error: any) {
      console.error("Error fetching profile:", error);
      
      const userData: UserProfile = {
        name: localStorage.getItem("userName") || "supriadi",
        email: localStorage.getItem("userEmail") || "u.indd654@gmail.com",
        phone: localStorage.getItem("userPhone") || "",
        role: localStorage.getItem("userRole") || "customer",
        id: localStorage.getItem("userId") || ""
      };
      
      setProfile(userData);
      if (userData.id) {
        fetchOrders(userData.id);
        fetchPaymentHistory(userData.id);
      }
      
      toast.error("Gagal memuat profil dari server, menggunakan data lokal");
    } finally {
      setLoadingProfile(false);
    }
  };

  // Fetch Data Orders
  const fetchOrders = async (userId: string) => {
    if (!userId) {
      // Data dummy untuk contoh
      const dummyOrders: Order[] = [
        {
          id: 1,
          order_code: "ORD001",
          customer_name: "supriadi",
          motorcycle_name: "Honda Beat Street",
          total_price: 28000000,
          payment_method: 'credit',
          status: 'pending',
          payment_status: 'unpaid',
          order_date: new Date().toISOString(),
          down_payment_percent: 20,
          loan_term: 24,
          monthly_installment: 933333
        },
        {
          id: 2,
          order_code: "ORD002",
          customer_name: "supriadi",
          motorcycle_name: "Yamaha NMAX",
          total_price: 32000000,
          payment_method: 'credit',
          status: 'pending',
          payment_status: 'unpaid',
          order_date: new Date().toISOString(),
          down_payment_percent: 25,
          loan_term: 36,
          monthly_installment: 666667
        }
      ];
      setOrders(dummyOrders);
      setLoadingOrders(false);
      return;
    }
    
    try {
      setLoadingOrders(true);
      const res = await fetch(`${API_ORDERS}?user_id=${userId}`);
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();

      if (data.success) {
        setOrders(data.data || []);
      } else {
        setOrders([]);
        console.log("No orders found or API error:", data.message);
      }
    } catch (error: any) {
      console.error("Error fetching orders:", error);
      setOrders([]);
      toast.error("Gagal memuat pesanan dari server");
    } finally {
      setLoadingOrders(false);
    }
  };

  // Fetch Payment History
  const fetchPaymentHistory = async (userId: string) => {
    if (!userId) {
      setPaymentHistory([]);
      setLoadingPayments(false);
      return;
    }
    
    try {
      setLoadingPayments(true);
      const res = await fetch(`${API_PAYMENTS}?action=get_user_payments&user_id=${userId}`);
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();

      if (data.success) {
        setPaymentHistory(data.payments || []);
      } else {
        setPaymentHistory([]);
        console.log("No payment history found:", data.message);
      }
    } catch (error: any) {
      console.error("Error fetching payment history:", error);
      setPaymentHistory([]);
    } finally {
      setLoadingPayments(false);
    }
  };

  // Calculate Credit Details
  const calculateCreditDetails = (order: Order) => {
    if (order.payment_method !== 'credit') return null;

    const totalPrice = Number(order.total_price) || 0;
    const downPaymentPercent = order.down_payment_percent || 20;
    const loanTerm = order.loan_term || 24;
    const monthlyInstallment = order.monthly_installment || 0;

    const downPaymentAmount = totalPrice * (downPaymentPercent / 100);
    const loanAmount = totalPrice - downPaymentAmount;
    const totalPayment = monthlyInstallment * loanTerm + downPaymentAmount;
    const totalInterest = totalPayment - totalPrice;

    return {
      downPaymentAmount,
      loanAmount,
      monthlyInstallment,
      totalPayment,
      totalInterest,
      loanTerm,
      downPaymentPercent
    };
  };

  // Generate Payment Schedule
  const generatePaymentSchedule = (order: Order) => {
    const creditDetails = calculateCreditDetails(order);
    if (!creditDetails) return [];

    const schedule = [];
    const startDate = new Date(order.order_date);
    
    for (let i = 1; i <= creditDetails.loanTerm; i++) {
      const dueDate = new Date(startDate);
      dueDate.setMonth(dueDate.getMonth() + i);
      
      schedule.push({
        installment: i,
        dueDate: dueDate.toISOString().split('T')[0],
        amount: creditDetails.monthlyInstallment,
        status: i === 1 ? 'down_payment' : 'pending'
      });
    }

    return schedule;
  };

  // Format functions
  const formatCurrency = (num: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(num);

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const formatDateTime = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  // Status badges
  const getStatusBadge = (status: string) => {
    const statusConfig: any = {
      'pending': { variant: 'secondary', label: 'Menunggu' },
      'confirmed': { variant: 'default', label: 'Dikonfirmasi' },
      'processing': { variant: 'default', label: 'Diproses' },
      'completed': { variant: 'default', label: 'Selesai' },
      'cancelled': { variant: 'destructive', label: 'Dibatalkan' },
      'paid': { variant: 'default', label: 'Lunas' },
      'unpaid': { variant: 'secondary', label: 'Belum Bayar' },
      'expired': { variant: 'destructive', label: 'Kadaluarsa' }
    };

    const config = statusConfig[status.toLowerCase()] || { variant: 'secondary', label: status };
    
    return (
      <Badge variant={config.variant} className="mb-1 capitalize">
        {config.label}
      </Badge>
    );
  };

  const getPaymentStatusBadge = (status: string) => {
    const statusConfig: any = {
      'pending': { variant: 'secondary', label: 'Menunggu' },
      'paid': { variant: 'default', label: 'Dibayar' },
      'expired': { variant: 'destructive', label: 'Kadaluarsa' },
      'cancelled': { variant: 'destructive', label: 'Dibatalkan' }
    };

    const config = statusConfig[status] || { variant: 'secondary', label: status };
    
    return (
      <Badge variant={config.variant} className="capitalize">
        {config.label}
      </Badge>
    );
  };

  // Handle actions
  const handleLogout = () => {
    localStorage.clear();
    toast.success("Logout berhasil");
    navigate("/login");
  };

  const viewInstallmentDetails = (order: Order) => {
    setSelectedOrder(order);
  };

  const downloadPaymentSchedule = (order: Order) => {
    const creditDetails = calculateCreditDetails(order);
    if (!creditDetails) return;

    const schedule = generatePaymentSchedule(order);
    
    let content = `JADWAL CICILAN MOTOR\n`;
    content += `===============================\n\n`;
    content += `Order ID: ${order.order_code || order.id}\n`;
    content += `Motor: ${order.motorcycle_name}\n`;
    content += `Total Harga: ${formatCurrency(Number(order.total_price))}\n`;
    content += `Uang Muka: ${creditDetails.downPaymentPercent}% (${formatCurrency(creditDetails.downPaymentAmount)})\n`;
    content += `Jumlah Pinjaman: ${formatCurrency(creditDetails.loanAmount)}\n`;
    content += `Tenor: ${creditDetails.loanTerm} bulan\n`;
    content += `Cicilan per Bulan: ${formatCurrency(creditDetails.monthlyInstallment)}\n\n`;
    content += `JADWAL PEMBAYARAN:\n`;
    content += `-------------------\n`;

    schedule.forEach((item, index) => {
      content += `${index + 1}. ${formatDate(item.dueDate)} - ${formatCurrency(item.amount)}\n`;
    });

    content += `\nTotal Pembayaran: ${formatCurrency(creditDetails.totalPayment)}\n`;
    content += `Total Bunga: ${formatCurrency(creditDetails.totalInterest)}\n`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `jadwal-cicilan-${order.order_code || order.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success("Jadwal cicilan berhasil diunduh");
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // Sidebar Navigation Items dengan badge counts
  const navItems = [
    { key: "profile", label: "Profil Saya", icon: <User className="w-4 h-4" /> },
    { key: "orders", label: "Pesanan", icon: <ShoppingBag className="w-4 h-4" />, badge: orders.length },
    { key: "payments", label: "Pembayaran", icon: <CreditCard className="w-4 h-4" />, badge: 25 },
    { key: "history", label: "Riwayat Cicilan", icon: <Calendar className="w-4 h-4" />, badge: "n" },
    { key: "reviews", label: "Ulasan", icon: <Star className="w-4 h-4" />, badge: "n" },
    { key: "settings", label: "Pengaturan", icon: <Settings className="w-4 h-4" />, badge: 112 },
  ];

  // Sidebar Component
  const Sidebar = () => (
    <>
      {/* Mobile Overlay */}
      {(sidebarOpen || mobileDropdownOpen) && isMobile && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={closeMobileDropdown}
        />
      )}

      {/* Desktop Sidebar */}
      <aside className={`
        ${isMobile ? 'fixed' : 'sticky top-0'} 
        inset-y-0 left-0 z-40
        w-64 bg-white border-r shadow-sm transform transition-transform duration-300 ease-in-out
        flex flex-col h-screen
        ${isMobile 
          ? (mobileDropdownOpen ? 'translate-x-0' : '-translate-x-full') 
          : (sidebarOpen ? 'translate-x-0' : '-translate-x-full')
        }
        md:translate-x-0
      `}>
        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-red-600">Daya Motor</h1>
              <p className="text-sm text-gray-500">Customer Portal</p>
            </div>
            {isMobile && (
              <Button
                variant="ghost"
                size="sm"
                onClick={closeMobileDropdown}
                className="md:hidden"
              >
                <X className="w-5 h-5" />
              </Button>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={() => handleTabChange(item.key)}
              className={`
                w-full flex items-center justify-between px-4 py-4 rounded-lg text-sm transition-all duration-200
                ${activeTab === item.key
                  ? "bg-red-600 text-white shadow-md"
                  : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                }
              `}
            >
              <div className="flex items-center gap-3">
                {item.icon}
                <span className="font-medium">{item.label}</span>
              </div>
              <div className="flex items-center gap-2">
                {item.badge && (
                  <span className={`
                    px-2 py-1 rounded-full text-xs font-medium
                    ${activeTab === item.key 
                      ? "bg-white text-red-600" 
                      : "bg-red-100 text-red-600"
                    }
                  `}>
                    {item.badge}
                  </span>
                )}
                <ChevronRight
                  className={`w-4 h-4 transition-transform duration-200 ${
                    activeTab === item.key ? "rotate-90" : ""
                  }`}
                />
              </div>
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t">
          <div className="mb-4 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium text-gray-700">{profile.name || "supriadi"}</p>
            <p className="text-xs text-gray-500 truncate">{profile.email || "u.indd654@gmail.com"}</p>
          </div>
          <Button
            onClick={handleLogout}
            className="w-full bg-gray-100 text-gray-700 hover:bg-gray-200 gap-2 transition-colors"
            variant="outline"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </aside>
    </>
  );

  // Mobile Dropdown Component
  const MobileDropdown = () => (
    <div className={`
      fixed top-16 left-0 right-0 bg-white border-b shadow-lg z-40
      transition-all duration-300 ease-in-out overflow-hidden
      ${mobileDropdownOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
      md:hidden
    `}>
      <div className="p-4 space-y-2">
        {navItems.map((item) => (
          <button
            key={item.key}
            onClick={() => handleTabChange(item.key)}
            className={`
              w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm transition-all duration-200
              ${activeTab === item.key
                ? "bg-red-600 text-white shadow-md"
                : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              }
            `}
          >
            <div className="flex items-center gap-3">
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </div>
            <div className="flex items-center gap-2">
              {item.badge && (
                <span className={`
                  px-2 py-1 rounded-full text-xs font-medium
                  ${activeTab === item.key 
                    ? "bg-white text-red-600" 
                    : "bg-red-100 text-red-600"
                  }
                `}>
                  {item.badge}
                </span>
              )}
              <ChevronRight
                className={`w-4 h-4 transition-transform duration-200 ${
                  activeTab === item.key ? "rotate-90" : ""
                }`}
              />
            </div>
          </button>
        ))}
        
        {/* User Info & Logout in Mobile Dropdown */}
        <div className="pt-4 border-t">
          <div className="mb-3 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium text-gray-700">{profile.name || "supriadi"}</p>
            <p className="text-xs text-gray-500 truncate">{profile.email || "u.indd654@gmail.com"}</p>
          </div>
          <Button
            onClick={handleLogout}
            className="w-full bg-gray-100 text-gray-700 hover:bg-gray-200 gap-2 transition-colors"
            variant="outline"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 min-h-screen md:ml-0">
        {/* Mobile Header */}
        <div className="md:hidden bg-white border-b shadow-sm sticky top-0 z-30">
          <div className="flex items-center justify-between p-4">
            <div className="text-center flex-1">
              <h1 className="text-lg font-bold text-red-600">Daya Motor</h1>
              <p className="text-xs text-gray-500">Customer Portal</p>
            </div>

            <div className="flex items-center gap-2">
              {/* Current Tab Display */}
              <div className="text-right">
                <p className="text-sm font-medium text-gray-700">
                  {navItems.find(item => item.key === activeTab)?.label}
                </p>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleSidebar}
                className="p-2"
              >
                {mobileDropdownOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
              </Button>
            </div>
          </div>

          {/* Mobile Dropdown */}
          <MobileDropdown />
        </div>

        {/* Content Area */}
        <div className="p-4 md:p-6">
          <Tabs value={activeTab} onValueChange={handleTabChange}>
            
            {/* ===== PROFILE ===== */}
            <TabsContent value="profile" className="mt-0">
              <Card className="shadow-md border-0">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Profil Saya</h2>
                  {loadingProfile ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <p className="text-sm text-gray-500">Nama Lengkap</p>
                        <p className="text-base font-medium">{profile.name || "supriadi"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="text-base font-medium">{profile.email || "u.indd654@gmail.com"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">No. Telepon</p>
                        <p className="text-base font-medium">{profile.phone || "-"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Role</p>
                        <p className="text-base font-medium capitalize">{profile.role || "customer"}</p>
                      </div>
                      <div className="sm:col-span-2">
                        <p className="text-sm text-gray-500">Member Sejak</p>
                        <p className="text-base font-medium">
                          {profile.created_at ? formatDate(profile.created_at) : "1 Januari 2024"}
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* ===== ORDERS ===== */}
            <TabsContent value="orders" className="mt-0">
              <Card className="shadow-md border-0">
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">Daftar Pesanan</h2>
                    <Badge variant="outline" className="bg-gray-100 text-lg px-3 py-1">
                      {orders.length} pesanan
                    </Badge>
                  </div>
                  
                  {loadingOrders ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="text-center py-8">
                      <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">Belum ada pesanan</p>
                      <p className="text-sm text-gray-400 mt-2">
                        Pesanan Anda akan muncul di sini setelah melakukan pembelian
                      </p>
                      <Button 
                        onClick={() => navigate("/motorcycles")}
                        className="mt-4 bg-red-600 hover:bg-red-700"
                      >
                        Lihat Katalog Motor
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => {
                        const creditDetails = calculateCreditDetails(order);
                        
                        return (
                          <div
                            key={order.id}
                            className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-white"
                          >
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <p className="font-semibold text-lg text-red-600">+11</p>
                                  <p className="font-semibold text-lg">{order.motorcycle_name}</p>
                                  <span className="text-xs text-gray-500">#{order.order_code || order.id}</span>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
                                  <div>
                                    <span className="font-medium">Tanggal:</span> {formatDate(order.order_date)}
                                  </div>
                                  <div>
                                    <span className="font-medium">Pembayaran:</span> 
                                    <span className="capitalize"> {order.payment_method}</span>
                                  </div>
                                  {order.payment_method === 'credit' && creditDetails && (
                                    <>
                                      <div>
                                        <span className="font-medium">DP:</span> {formatCurrency(creditDetails.downPaymentAmount)}
                                      </div>
                                      <div>
                                        <span className="font-medium">Cicilan:</span> {formatCurrency(creditDetails.monthlyInstallment)}/bln
                                      </div>
                                    </>
                                  )}
                                </div>
                              </div>
                              <div className="text-right space-y-2">
                                {getStatusBadge(order.status)}
                                <p className="font-semibold text-red-600 text-lg">
                                  {formatCurrency(Number(order.total_price || 0))}
                                </p>
                                {order.payment_method === 'credit' && (
                                  <div className="flex gap-2">
                                    <Button 
                                      size="sm" 
                                      variant="outline"
                                      onClick={() => viewInstallmentDetails(order)}
                                      className="border-gray-300"
                                    >
                                      <Eye className="w-4 h-4 mr-1" />
                                      Detail
                                    </Button>
                                    <Button 
                                      size="sm" 
                                      variant="outline"
                                      onClick={() => downloadPaymentSchedule(order)}
                                      className="border-gray-300"
                                    >
                                      <Download className="w-4 h-4 mr-1" />
                                      Unduh
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* ===== PAYMENTS ===== */}
            <TabsContent value="payments" className="mt-0">
              <Card className="shadow-md border-0">
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Riwayat Pembayaran</h2>
                    <Badge variant="outline" className="bg-gray-100">
                      {paymentHistory.length} transaksi
                    </Badge>
                  </div>
                  
                  {loadingPayments ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
                    </div>
                  ) : paymentHistory.length === 0 ? (
                    <div className="text-center py-8">
                      <CreditCard className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">Belum ada riwayat pembayaran</p>
                      <p className="text-sm text-gray-400 mt-2">
                        Riwayat pembayaran akan muncul di sini setelah Anda melakukan pembayaran
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {paymentHistory.map((payment) => (
                        <div
                          key={payment.id}
                          className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-white"
                        >
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <p className="font-semibold">#{payment.payment_code}</p>
                                {getPaymentStatusBadge(payment.status)}
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
                                <div>
                                  <span className="font-medium">Metode:</span> 
                                  <span className="capitalize"> {payment.payment_method.replace('_', ' ')}</span>
                                </div>
                                <div>
                                  <span className="font-medium">Tanggal:</span> {formatDateTime(payment.created_at)}
                                </div>
                                {payment.bank_name && (
                                  <div>
                                    <span className="font-medium">Bank:</span> {payment.bank_name}
                                  </div>
                                )}
                                {payment.ewallet_type && (
                                  <div>
                                    <span className="font-medium">E-Wallet:</span> {payment.ewallet_type}
                                  </div>
                                )}
                                {payment.order && (
                                  <div className="sm:col-span-2">
                                    <span className="font-medium">Pesanan:</span> {payment.order.motorcycle_name}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-red-600 text-lg">
                                {formatCurrency(Number(payment.amount))}
                              </p>
                              <p className="text-sm text-gray-500">
                                {payment.status === 'pending' && `Batas: ${formatDateTime(payment.expired_at)}`}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Other tabs... */}
            <TabsContent value="history" className="mt-0">
              <Card className="shadow-md border-0">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Riwayat Cicilan</h2>
                  <div className="text-center py-8">
                    <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Belum ada riwayat cicilan</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews" className="mt-0">
              <Card className="shadow-md border-0">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Ulasan</h2>
                  <div className="text-center py-8">
                    <Star className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Belum ada ulasan yang ditulis</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="mt-0">
              <Card className="shadow-md border-0">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Pengaturan</h2>
                  <div className="text-center py-8">
                    <Settings className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Fitur pengaturan akun akan tersedia segera</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Modal Detail Cicilan */}
          {selectedOrder && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold">Detail Cicilan - {selectedOrder.motorcycle_name}</h3>
                    <Button variant="ghost" onClick={() => setSelectedOrder(null)}>×</Button>
                  </div>
                  
                  {(() => {
                    const creditDetails = calculateCreditDetails(selectedOrder);
                    if (!creditDetails) return null;
                    
                    return (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-gray-50 p-3 rounded">
                            <p className="text-sm text-gray-600">Total Harga</p>
                            <p className="font-semibold">{formatCurrency(Number(selectedOrder.total_price))}</p>
                          </div>
                          <div className="bg-gray-50 p-3 rounded">
                            <p className="text-sm text-gray-600">Uang Muka</p>
                            <p className="font-semibold">{formatCurrency(creditDetails.downPaymentAmount)}</p>
                          </div>
                          <div className="bg-gray-50 p-3 rounded">
                            <p className="text-sm text-gray-600">Jumlah Pinjaman</p>
                            <p className="font-semibold">{formatCurrency(creditDetails.loanAmount)}</p>
                          </div>
                          <div className="bg-gray-50 p-3 rounded">
                            <p className="text-sm text-gray-600">Tenor</p>
                            <p className="font-semibold">{creditDetails.loanTerm} bulan</p>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold mb-2">Ringkasan Pembayaran</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span>Harga Motor:</span>
                              <span>{formatCurrency(Number(selectedOrder.total_price))}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Uang Muka:</span>
                              <span>- {formatCurrency(creditDetails.downPaymentAmount)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Jumlah Pinjaman:</span>
                              <span>{formatCurrency(creditDetails.loanAmount)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Total Bunga ({creditDetails.loanTerm} bulan):</span>
                              <span>+ {formatCurrency(creditDetails.totalInterest)}</span>
                            </div>
                            <div className="flex justify-between border-t pt-2 font-semibold">
                              <span>Total Pembayaran:</span>
                              <span className="text-red-600">{formatCurrency(creditDetails.totalPayment)}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex gap-2 flex-col sm:flex-row">
                          <Button 
                            onClick={() => downloadPaymentSchedule(selectedOrder)}
                            variant="outline"
                            className="flex-1"
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Unduh Jadwal
                          </Button>
                          <Button 
                            onClick={() => {
                              navigate(`/payment?order=${selectedOrder.id}`);
                              setSelectedOrder(null);
                            }}
                            className="flex-1 bg-red-600 hover:bg-red-700"
                          >
                            <DollarSign className="w-4 h-4 mr-2" />
                            Bayar Sekarang
                          </Button>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}