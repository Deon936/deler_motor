import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from "recharts";
import { Users, ShoppingBag, DollarSign, Bike, LogOut, Plus, Edit, Trash2, Eye, User, Settings, ChevronDown, CheckCircle, Clock, Package, Truck } from "lucide-react";
import { toast } from "sonner";

export function AdminPanel() {
  const navigate = useNavigate();

  // Base URL untuk gambar
  const BASE_URL = "http://localhost/backend/";
  const API_MOTOR = `${BASE_URL}api/motorcycles.php`;
  const API_CUSTOMER = `${BASE_URL}api/customer.php`;
  const API_ORDERS = `${BASE_URL}api/orders.php`;
  const API_ADVERTISEMENTS = `${BASE_URL}api/advertised_motorcycles.php`;
  const API_PROFILE = `${BASE_URL}api/profile.php`;
  const API_SETTINGS = `${BASE_URL}api/settings.php`;
  const API_CHANGE_PASSWORD = `${BASE_URL}api/change-password.php`;

  // State
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [motorcycles, setMotorcycles] = useState([]);
  const [advertisements, setAdvertisements] = useState([]);
  const [loading, setLoading] = useState(false);

  // Dropdown state
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Inventory form state
  const [motorForm, setMotorForm] = useState({
    id: "",
    name: "",
    category: "",
    price: "",
    image: "",
    specs: "",
    available: 1,
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [motorEditing, setMotorEditing] = useState(false);
  const [motorDialogOpen, setMotorDialogOpen] = useState(false);

  // Customer form state
  const [customerForm, setCustomerForm] = useState({
    id: "",
    name: "",
    email: "",
    phone: "",
    address: "",
    total_orders: 0,
    total_spent: 0,
  });
  const [customerEditing, setCustomerEditing] = useState(false);
  const [customerDialogOpen, setCustomerDialogOpen] = useState(false);

  // Advertisement form state
  const [adForm, setAdForm] = useState({
    id: "",
    name: "",
    category: "",
    price: "",
    image: "",
    description: "",
  });
  const [adEditing, setAdEditing] = useState(false);
  const [adDialogOpen, setAdDialogOpen] = useState(false);
  const [selectedAdFile, setSelectedAdFile] = useState(null);
  const [adImagePreview, setAdImagePreview] = useState("");

  // Order detail state
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderDetailOpen, setOrderDetailOpen] = useState(false);

  // Profile & Settings state
  const [profileData, setProfileData] = useState({
    id: "",
    name: "",
    email: "",
    phone: "",
    address: "",
    role: "",
    created_at: "",
    last_login: ""
  });

  const [settingsData, setSettingsData] = useState({
    email_notifications: true,
    sales_alerts: true,
    low_stock_alerts: true,
    auto_backup: false,
    backup_frequency: "weekly",
    language: "id",
    timezone: "Asia/Jakarta"
  });

  const [passwordForm, setPasswordForm] = useState({
    current_password: "",
    new_password: "",
    confirm_password: ""
  });

  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);
  const [changePasswordDialogOpen, setChangePasswordDialogOpen] = useState(false);

  // Charts demo data
  const salesData = [
    { month: "Jun", sales: 12, revenue: 420000000 },
    { month: "Jul", sales: 18, revenue: 630000000 },
    { month: "Aug", sales: 15, revenue: 525000000 },
    { month: "Sep", sales: 22, revenue: 770000000 },
    { month: "Oct", sales: 25, revenue: 875000000 },
  ];

  // Helper functions
  const formatPrice = (price) => {
    if (price === null || price === undefined || price === "") return "-";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(Number(price));
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
        return "bg-blue-100 text-blue-800";
      case "processing":
        return "bg-purple-100 text-purple-800";
      case "packing":
        return "bg-indigo-100 text-indigo-800";
      case "shipping":
        return "bg-orange-100 text-orange-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "cancelled":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status) => {
    const statusMap = {
      'pending': 'Menunggu',
      'approved': 'Disetujui',
      'processing': 'Diproses',
      'packing': 'Dikemas',
      'shipping': 'Dikirim',
      'completed': 'Selesai',
      'rejected': 'Ditolak',
      'cancelled': 'Dibatalkan'
    };
    return statusMap[status] || status;
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return <Clock className="w-3 h-3 mr-1" />;
      case "approved":
        return <CheckCircle className="w-3 h-3 mr-1" />;
      case "processing":
        return <Settings className="w-3 h-3 mr-1" />;
      case "packing":
        return <Package className="w-3 h-3 mr-1" />;
      case "shipping":
        return <Truck className="w-3 h-3 mr-1" />;
      case "completed":
        return <CheckCircle className="w-3 h-3 mr-1" />;
      default:
        return <Clock className="w-3 h-3 mr-1" />;
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "unpaid":
        return "bg-red-100 text-red-800";
      case "expired":
        return "bg-gray-100 text-gray-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentStatusText = (status) => {
    const statusMap = {
      'paid': 'Lunas',
      'pending': 'Menunggu Verifikasi',
      'unpaid': 'Belum Bayar',
      'expired': 'Kadaluarsa',
      'failed': 'Gagal'
    };
    return statusMap[status] || status;
  };

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("userEmail");
    navigate("/login");
  };

  // Profile functions
  const fetchProfile = async () => {
    try {
      const res = await fetch(API_PROFILE, {
        credentials: 'include'
      });
      const data = await res.json();
      
      if (data.success) {
        setProfileData(data.data);
      } else {
        toast.error(data.message || "Gagal memuat profil");
      }
    } catch (err) {
      console.error('Fetch Profile Error:', err);
      toast.error("Gagal memuat profil");
    }
  };

  const updateProfile = async (e) => {
    e.preventDefault();
    
    if (!profileData.name?.trim() || !profileData.email?.trim()) {
      toast.error("Nama dan email wajib diisi");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(API_PROFILE, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify(profileData),
      });
      
      const data = await res.json();
      
      if (data.success) {
        toast.success(data.message);
        setProfileDialogOpen(false);
        await fetchProfile();
      } else {
        toast.error(data.message || "Gagal mengupdate profil");
      }
    } catch (err) {
      console.error('Update Profile Error:', err);
      toast.error("Terjadi kesalahan server");
    } finally {
      setLoading(false);
    }
  };

  // Settings functions
  const fetchSettings = async () => {
    try {
      const res = await fetch(API_SETTINGS, {
        credentials: 'include'
      });
      const data = await res.json();
      
      if (data.success) {
        setSettingsData(data.data);
      } else {
        toast.error(data.message || "Gagal memuat pengaturan");
      }
    } catch (err) {
      console.error('Fetch Settings Error:', err);
      toast.error("Gagal memuat pengaturan");
    }
  };

  const updateSettings = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      const res = await fetch(API_SETTINGS, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify(settingsData),
      });
      
      const data = await res.json();
      
      if (data.success) {
        toast.success(data.message);
        setSettingsDialogOpen(false);
      } else {
        toast.error(data.message || "Gagal mengupdate pengaturan");
      }
    } catch (err) {
      console.error('Update Settings Error:', err);
      toast.error("Terjadi kesalahan server");
    } finally {
      setLoading(false);
    }
  };

  // Password functions
  const changePassword = async (e) => {
    e.preventDefault();
    
    if (!passwordForm.current_password || !passwordForm.new_password || !passwordForm.confirm_password) {
      toast.error("Semua field password harus diisi");
      return;
    }
    
    if (passwordForm.new_password !== passwordForm.confirm_password) {
      toast.error("Password baru tidak cocok");
      return;
    }
    
    if (passwordForm.new_password.length < 6) {
      toast.error("Password baru minimal 6 karakter");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(API_CHANGE_PASSWORD, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify(passwordForm),
      });
      
      const data = await res.json();
      
      if (data.success) {
        toast.success(data.message);
        setChangePasswordDialogOpen(false);
        setPasswordForm({
          current_password: "",
          new_password: "",
          confirm_password: ""
        });
      } else {
        toast.error(data.message || "Gagal mengubah password");
      }
    } catch (err) {
      console.error('Change Password Error:', err);
      toast.error("Terjadi kesalahan server");
    } finally {
      setLoading(false);
    }
  };

  // Handler functions
  const handleProfile = async () => {
    setDropdownOpen(false);
    await fetchProfile();
    setProfileDialogOpen(true);
  };

  const handleSettings = async () => {
    setDropdownOpen(false);
    await fetchSettings();
    setSettingsDialogOpen(true);
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleSettingsChange = (name, value) => {
    setSettingsData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({ ...prev, [name]: value }));
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownOpen && !event.target.closest('.dropdown-container')) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  // File handling functions
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Hanya file gambar yang diizinkan (JPEG, PNG, GIF, WebP)");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error("Ukuran file maksimal 5MB");
        return;
      }

      setSelectedFile(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);

      setMotorForm(prev => ({ ...prev, image: "" }));
    }
  };

  const clearFileSelection = () => {
    setSelectedFile(null);
    setImagePreview("");
  };

  // API Functions - Motorcycles
  const fetchMotorcycles = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_MOTOR);
      const text = await res.text();
      
      let data;
      try {
        data = text ? JSON.parse(text) : [];
      } catch (parseError) {
        console.error('JSON Parse Error:', parseError);
        toast.error("Invalid response from server");
        return;
      }

      if (Array.isArray(data)) {
        setMotorcycles(data);
      } else if (data && data.message) {
        if (res.ok) {
          setMotorcycles([]);
        } else {
          toast.error(data.message);
          setMotorcycles([]);
        }
      } else {
        setMotorcycles([]);
      }
    } catch (err) {
      console.error('Fetch Error:', err);
      toast.error("Gagal memuat inventory: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomers = async () => {
    try {
      const res = await fetch(API_CUSTOMER);
      const data = await res.json();
      
      if (Array.isArray(data)) {
        setCustomers(data);
      } else if (data.message && !res.ok) {
        setCustomers([]);
        toast.error(data.message);
      } else if (Array.isArray(data.customers)) {
        setCustomers(data.customers);
      } else {
        setCustomers(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error('Fetch Customers Error:', err);
      toast.error("Gagal memuat customers.");
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch(API_ORDERS);
      const data = await res.json();
      
      if (data.success && Array.isArray(data.data)) {
        setOrders(data.data);
      } else if (Array.isArray(data)) {
        setOrders(data);
      } else {
        setOrders([]);
        toast.error("Format data orders tidak valid");
      }
    } catch (err) {
      console.error('Fetch Orders Error:', err);
      toast.error("Gagal memuat orders: " + err.message);
    }
  };

  // API Functions - Advertisements
  const fetchAdvertisements = async () => {
    try {
      const res = await fetch(API_ADVERTISEMENTS);
      const data = await res.json();
      
      if (data.success && Array.isArray(data.data)) {
        setAdvertisements(data.data);
      } else if (Array.isArray(data)) {
        setAdvertisements(data);
      } else {
        setAdvertisements([]);
      }
    } catch (err) {
      console.error('Fetch Ads Error:', err);
      toast.error("Gagal memuat data iklan");
    }
  };

  const openAddAd = () => {
    setAdForm({
      id: "",
      name: "",
      category: "",
      price: "",
      image: "",
      description: "",
    });
    setAdEditing(false);
    setAdDialogOpen(true);
    setSelectedAdFile(null);
    setAdImagePreview("");
  };

  const openEditAd = (ad) => {
    setAdForm({
      id: ad.id,
      name: ad.name,
      category: ad.category,
      price: ad.price,
      image: ad.image || "",
      description: ad.description || "",
    });
    setAdEditing(true);
    setAdDialogOpen(true);
    
    if (ad.image) {
      const fullImageUrl = ad.image.startsWith('http') ? ad.image : `${BASE_URL}${ad.image}`;
      setAdImagePreview(fullImageUrl);
    } else {
      setAdImagePreview("");
    }
    setSelectedAdFile(null);
  };

  const handleAdChange = (e) => {
    const { name, value } = e.target;
    setAdForm((prev) => ({ ...prev, [name]: value }));
    
    if (name === 'image' && value) {
      setSelectedAdFile(null);
      setAdImagePreview("");
    }
  };

  const submitAd = async (e) => {
    e.preventDefault();
    
    if (!adForm.name?.trim()) {
      toast.error("Nama iklan harus diisi.");
      return;
    }
    if (!adForm.category?.trim()) {
      toast.error("Kategori harus diisi.");
      return;
    }
    if (!adForm.price || Number(adForm.price) <= 0) {
      toast.error("Harga harus diisi dengan nilai yang valid.");
      return;
    }

    try {
      setLoading(true);
      
      const adData = {
        id: adForm.id || '',
        name: adForm.name.trim(),
        category: adForm.category.trim(),
        price: Number(adForm.price),
        description: adForm.description?.trim() || '',
        image: adForm.image || ''
      };

      const method = adEditing ? "PUT" : "POST";
      const res = await fetch(API_ADVERTISEMENTS, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(adData),
      });
      
      const data = await res.json();

      if (data.success) {
        toast.success(data.message);
        setAdDialogOpen(false);
        setSelectedAdFile(null);
        setAdImagePreview("");
        await fetchAdvertisements();
      } else {
        toast.error(data.message || `Gagal ${adEditing ? 'mengupdate' : 'menambahkan'} iklan.`);
      }
    } catch (err) {
      console.error('Submit Ad Error:', err);
      toast.error("Terjadi kesalahan server: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteAd = async (id) => {
    if (!window.confirm("Yakin hapus iklan ini?")) return;
    
    try {
      const res = await fetch(`${API_ADVERTISEMENTS}?id=${id}`, {
        method: "DELETE",
      });
      
      const data = await res.json();

      if (data.success) {
        toast.success(data.message || "Iklan berhasil dihapus.");
        await fetchAdvertisements();
      } else {
        toast.error(data.message || "Gagal menghapus iklan.");
      }
    } catch (err) {
      console.error('Delete Ad Error:', err);
      toast.error("Terjadi kesalahan saat menghapus: " + err.message);
    }
  };

  const updateOrderStatus = async (id, status) => {
    try {
      const res = await fetch(API_ORDERS, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ id, status }),
      });
      
      const data = await res.json();
      if (data.success) {
        toast.success(`Status order berhasil diubah menjadi: ${getStatusText(status)}`);
        fetchOrders();
      } else {
        toast.error(data.message || "Gagal memperbarui status order");
      }
    } catch (err) {
      toast.error("Gagal memperbarui status: " + err.message);
    }
  };

  const updatePaymentStatus = async (id, payment_status) => {
    try {
      const res = await fetch(API_ORDERS, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ id, payment_status }),
      });
      
      const data = await res.json();
      if (data.success) {
        toast.success(`Status pembayaran berhasil diubah menjadi: ${getPaymentStatusText(payment_status)}`);
        fetchOrders();
      } else {
        toast.error(data.message || "Gagal memperbarui status pembayaran");
      }
    } catch (err) {
      toast.error("Gagal memperbarui status pembayaran: " + err.message);
    }
  };

  const deleteOrder = async (id) => {
    if (!window.confirm("Yakin hapus order ini?")) return;
    
    try {
      const res = await fetch(`${API_ORDERS}?id=${id}`, { 
        method: "DELETE" 
      });
      const data = await res.json();
      
      if (data.success) {
        toast.success(data.message || "Order berhasil dihapus");
        fetchOrders();
      } else {
        toast.error(data.message || "Gagal menghapus order");
      }
    } catch (err) {
      toast.error("Terjadi kesalahan saat menghapus order: " + err.message);
    }
  };

  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
    setOrderDetailOpen(true);
  };

  // Motorcycle CRUD
  const openAddMotor = () => {
    setMotorForm({
      id: "",
      name: "",
      category: "",
      price: "",
      image: "",
      specs: "",
      available: 1,
    });
    setMotorEditing(false);
    setMotorDialogOpen(true);
    setSelectedFile(null);
    setImagePreview("");
  };

  const openEditMotor = (item) => {
    setMotorForm({
      id: item.id,
      name: item.name,
      category: item.category,
      price: item.price,
      image: item.image || "",
      specs: item.specs || "",
      available: item.available ? 1 : 0,
    });
    setMotorEditing(true);
    setMotorDialogOpen(true);
    
    if (item.image) {
      const fullImageUrl = item.image.startsWith('http') ? item.image : `${BASE_URL}${item.image}`;
      setImagePreview(fullImageUrl);
    } else {
      setImagePreview("");
    }
    setSelectedFile(null);
  };

  const handleMotorChange = (e) => {
    const { name, value } = e.target;
    setMotorForm((prev) => ({ ...prev, [name]: value }));
    
    if (name === 'image' && value) {
      setSelectedFile(null);
      setImagePreview("");
    }
  };

  const submitMotor = async (e) => {
    e.preventDefault();
    
    if (!motorForm.name?.trim()) {
      toast.error("Nama motor harus diisi.");
      return;
    }
    if (!motorForm.category?.trim()) {
      toast.error("Kategori harus diisi.");
      return;
    }
    if (!motorForm.price || Number(motorForm.price) <= 0) {
      toast.error("Harga harus diisi dengan nilai yang valid.");
      return;
    }

    try {
      setLoading(true);
      
      const formData = new FormData();
      formData.append('id', motorForm.id || '');
      formData.append('name', motorForm.name.trim());
      formData.append('category', motorForm.category.trim());
      formData.append('price', Number(motorForm.price));
      formData.append('specs', motorForm.specs?.trim() || '');
      formData.append('description', motorForm.specs?.trim() || '');
      formData.append('features', '');
      formData.append('available', motorForm.available == 1 || motorForm.available === true ? '1' : '0');
      
      if (selectedFile) {
        formData.append('image', selectedFile);
      } else if (motorForm.image) {
        formData.append('image', motorForm.image);
      }

      const method = motorEditing ? "PUT" : "POST";
      const res = await fetch(API_MOTOR, {
        method,
        body: formData,
      });
      
      const text = await res.text();
      let data;
      try {
        data = text ? JSON.parse(text) : {};
      } catch (parseError) {
        toast.error("Invalid response from server");
        return;
      }

      if (res.ok && data.success !== false) {
        const successMessage = data.message || (motorEditing ? "Motor berhasil diupdate." : "Motor berhasil ditambahkan.");
        toast.success(successMessage);
        setMotorDialogOpen(false);
        setSelectedFile(null);
        setImagePreview("");
        await fetchMotorcycles();
      } else {
        const errorMessage = data.message || `Gagal ${motorEditing ? 'mengupdate' : 'menambahkan'} motor.`;
        toast.error(errorMessage);
      }
    } catch (err) {
      console.error('Submit Error:', err);
      toast.error("Terjadi kesalahan server: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteMotor = async (id) => {
    if (!window.confirm("Yakin hapus motor ini?")) return;
    
    try {
      const deleteUrl = `${API_MOTOR}?id=${id}`;
      const res = await fetch(deleteUrl, { 
        method: "DELETE",
        headers: { "Accept": "application/json" }
      });
      
      const text = await res.text();
      let data;
      try {
        data = text ? JSON.parse(text) : {};
      } catch (parseError) {
        toast.error("Invalid response from server");
        return;
      }

      if (res.ok && data.success !== false) {
        toast.success(data.message || "Motor berhasil dihapus.");
        await fetchMotorcycles();
      } else {
        toast.error(data.message || "Gagal menghapus motor.");
      }
    } catch (err) {
      console.error('Delete Error:', err);
      toast.error("Terjadi kesalahan saat menghapus: " + err.message);
    }
  };

  // Customer CRUD
  const openAddCustomer = () => {
    setCustomerForm({
      id: "",
      name: "",
      email: "",
      phone: "",
      address: "",
      total_orders: 0,
      total_spent: 0,
    });
    setCustomerEditing(false);
    setCustomerDialogOpen(true);
  };

  const openEditCustomer = (c) => {
    setCustomerForm({
      id: c.id,
      name: c.name,
      email: c.email,
      phone: c.phone,
      address: c.address || "",
      total_orders: c.total_orders || 0,
      total_spent: c.total_spent || 0,
    });
    setCustomerEditing(true);
    setCustomerDialogOpen(true);
  };

  const handleCustomerChange = (e) => {
    const { name, value } = e.target;
    setCustomerForm((prev) => ({ ...prev, [name]: value }));
  };

  const submitCustomer = async (e) => {
    e.preventDefault();
    if (!customerForm.name || !customerForm.email) {
      toast.error("Nama dan email wajib diisi.");
      return;
    }

    try {
      const method = customerEditing ? "PUT" : "POST";
      const res = await fetch(API_CUSTOMER, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(customerForm),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || (customerEditing ? "Customer updated." : "Customer created."));
        setCustomerDialogOpen(false);
        fetchCustomers();
      } else {
        toast.error(data.message || "Gagal menyimpan customer.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Terjadi kesalahan server.");
    }
  };

  const deleteCustomer = async (id) => {
    if (!window.confirm("Yakin hapus customer ini?")) return;
    try {
      const res = await fetch(`${API_CUSTOMER}?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || "Customer deleted.");
        fetchCustomers();
      } else {
        toast.error(data.message || "Gagal menghapus customer.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Terjadi kesalahan saat menghapus.");
    }
  };

  // Computed stats
  const totalRevenue = orders.reduce((sum, order) => sum + (Number(order.total_price) || 0), 0);
  const totalOrders = orders.length;
  const totalCustomers = customers.length;
  const totalInventory = motorcycles.length;
  const totalAds = advertisements.length;

  // Order status counts
  const orderStatusCounts = {
    pending: orders.filter(o => o.status === 'pending').length,
    approved: orders.filter(o => o.status === 'approved').length,
    processing: orders.filter(o => o.status === 'processing').length,
    packing: orders.filter(o => o.status === 'packing').length,
    shipping: orders.filter(o => o.status === 'shipping').length,
    completed: orders.filter(o => o.status === 'completed').length,
  };

  // Effects
  useEffect(() => {
    fetchMotorcycles();
    fetchCustomers();
    fetchOrders();
    fetchAdvertisements();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-red-600 text-white px-3 py-1 rounded font-bold">HONDA</div>
            <span className="text-gray-800">Admin Panel</span>
          </div>
          <div className="flex items-center gap-4">
            {loading && (
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                Loading...
              </Badge>
            )}
            
            {/* Dropdown User Menu */}
            <div className="relative dropdown-container">
              <Button 
                variant="outline" 
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="gap-2"
              >
                <User className="w-4 h-4" />
                Admin
                <ChevronDown className={`w-4 h-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
              </Button>
              
              {dropdownOpen && (
                <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                  <div className="py-1">
                    <button
                      onClick={handleProfile}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <User className="w-4 h-4 mr-2" />
                      Profile
                    </button>
                    <button
                      onClick={handleSettings}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </button>
                    <div className="border-t border-gray-100 my-1"></div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl mb-2">Dashboard</h1>
          <p className="text-gray-600">Welcome back, Admin</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card><CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-2xl text-red-600">{formatPrice(totalRevenue)}</p>
              </div>
              <DollarSign className="w-10 h-10 text-red-600 opacity-50" />
            </div>
          </CardContent></Card>

          <Card><CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Orders</p>
                <p className="text-2xl">{totalOrders}</p>
              </div>
              <ShoppingBag className="w-10 h-10 text-blue-600 opacity-50" />
            </div>
          </CardContent></Card>

          <Card><CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Customers</p>
                <p className="text-2xl">{totalCustomers}</p>
              </div>
              <Users className="w-10 h-10 text-green-600 opacity-50" />
            </div>
          </CardContent></Card>

          <Card><CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Inventory</p>
                <p className="text-2xl">{totalInventory}</p>
              </div>
              <Bike className="w-10 h-10 text-purple-600 opacity-50" />
            </div>
          </CardContent></Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader><CardTitle>Sales Overview</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="sales" fill="#dc2626" name="Units Sold" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Revenue Trend</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" stroke="#dc2626" name="Revenue (IDR)" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="advertisements">Iklan</TabsTrigger>
          </TabsList>

          {/* ORDERS */}
          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Order Management</CardTitle>
                <div className="flex items-center gap-4 mt-2">
                  <Badge variant="outline" className="bg-gray-100">
                    Total: {orders.length} orders
                  </Badge>
                  <div className="flex gap-1 flex-wrap">
                    <Badge className="bg-yellow-100 text-yellow-800">Pending: {orderStatusCounts.pending}</Badge>
                    <Badge className="bg-blue-100 text-blue-800">Approved: {orderStatusCounts.approved}</Badge>
                    <Badge className="bg-purple-100 text-purple-800">Processing: {orderStatusCounts.processing}</Badge>
                    <Badge className="bg-indigo-100 text-indigo-800">Packing: {orderStatusCounts.packing}</Badge>
                    <Badge className="bg-orange-100 text-orange-800">Shipping: {orderStatusCounts.shipping}</Badge>
                    <Badge className="bg-green-100 text-green-800">Completed: {orderStatusCounts.completed}</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Motorcycle</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Payment</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Bukti Bayar</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                          No orders available.
                        </TableCell>
                      </TableRow>
                    )}
                    {orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">#{order.id}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{order.customer_name}</div>
                            <div className="text-sm text-gray-500">{order.customer_phone}</div>
                            {order.customer_email && (
                              <div className="text-xs text-gray-400">{order.customer_email}</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{order.motorcycle_name}</div>
                            <div className="text-sm text-gray-500">{order.color}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {formatDate(order.order_date)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <Badge 
                              variant="outline" 
                              className={`capitalize ${
                                order.payment_method === 'credit' 
                                  ? 'bg-blue-50 text-blue-700 border-blue-200' 
                                  : 'bg-green-50 text-green-700 border-green-200'
                              }`}
                            >
                              {order.payment_method === 'credit' ? 'Kredit' : 'Cash'}
                            </Badge>
                            {order.payment_method === 'credit' && (
                              <div className="text-xs text-gray-500">
                                {order.down_payment_percent}% DP
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">
                          {formatPrice(order.total_price)}
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(order.status)}>
                            {getStatusIcon(order.status)}
                            {getStatusText(order.status)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            {order.payment_proof ? (
                              <>
                                <img 
                                  src={`${BASE_URL}${order.payment_proof}`}
                                  alt="Bukti Pembayaran"
                                  className="w-12 h-12 object-cover rounded border cursor-pointer"
                                  onClick={() => window.open(`${BASE_URL}${order.payment_proof}`, '_blank')}
                                />
                                <Badge 
                                  variant={order.payment_status === 'paid' ? 'default' : 'secondary'}
                                  className={getPaymentStatusColor(order.payment_status)}
                                >
                                  {getPaymentStatusText(order.payment_status)}
                                </Badge>
                                {order.payment_status === 'pending' && (
                                  <div className="flex gap-1 mt-1">
                                    <Button 
                                      size="sm" 
                                      className="bg-green-600 hover:bg-green-700 text-xs h-6"
                                      onClick={() => updatePaymentStatus(order.id, 'paid')}
                                    >
                                      ✓ Setujui
                                    </Button>
                                    <Button 
                                      size="sm" 
                                      variant="destructive"
                                      className="text-xs h-6"
                                      onClick={() => updatePaymentStatus(order.id, 'failed')}
                                    >
                                      ✗ Tolak
                                    </Button>
                                  </div>
                                )}
                              </>
                            ) : (
                              <Badge 
                                variant="secondary" 
                                className="bg-red-100 text-red-800"
                              >
                                {getPaymentStatusText(order.payment_status)}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-2">
                            {/* View Details Button */}
                            <div className="flex gap-1">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => viewOrderDetails(order)}
                                className="flex-1"
                              >
                                <Eye className="w-3 h-3 mr-1" />
                                Detail
                              </Button>
                              
                              {(order.status === "rejected" || order.status === "cancelled") && (
                                <Button 
                                  variant="destructive" 
                                  size="sm"
                                  onClick={() => deleteOrder(order.id)}
                                  className="px-2"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              )}
                            </div>

                            {/* Status Actions */}
                            <div className="flex flex-wrap gap-1">
                              {/* Pending -> Approved/Rejected */}
                              {order.status === "pending" && (
                                <>
                                  <Button 
                                    size="sm"
                                    onClick={() => updateOrderStatus(order.id, "approved")}
                                    className="bg-green-600 hover:bg-green-700 text-xs h-7 flex-1"
                                  >
                                    Approve
                                  </Button>
                                  <Button 
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => updateOrderStatus(order.id, "rejected")}
                                    className="text-xs h-7 flex-1"
                                  >
                                    Reject
                                  </Button>
                                </>
                              )}
                              
                              {/* Approved -> Processing */}
                              {order.status === "approved" && (
                                <Button 
                                  size="sm"
                                  onClick={() => updateOrderStatus(order.id, "processing")}
                                  className="bg-purple-600 hover:bg-purple-700 text-xs h-7 w-full"
                                >
                                  Proses Order
                                </Button>
                              )}
                              
                              {/* Processing -> Packing */}
                              {order.status === "processing" && (
                                <Button 
                                  size="sm"
                                  onClick={() => updateOrderStatus(order.id, "packing")}
                                  className="bg-indigo-600 hover:bg-indigo-700 text-xs h-7 w-full"
                                >
                                  Proses Packing
                                </Button>
                              )}
                              
                              {/* Packing -> Shipping */}
                              {order.status === "packing" && (
                                <Button 
                                  size="sm"
                                  onClick={() => updateOrderStatus(order.id, "shipping")}
                                  className="bg-orange-600 hover:bg-orange-700 text-xs h-7 w-full"
                                >
                                  Kirim Barang
                                </Button>
                              )}
                              
                              {/* Shipping -> Completed */}
                              {order.status === "shipping" && (
                                <Button 
                                  size="sm"
                                  onClick={() => updateOrderStatus(order.id, "completed")}
                                  className="bg-green-600 hover:bg-green-700 text-xs h-7 w-full"
                                >
                                  Selesaikan
                                </Button>
                              )}
                              
                              {/* Completed - No actions needed */}
                              {order.status === "completed" && (
                                <div className="text-xs text-green-600 text-center w-full">
                                  <CheckCircle className="w-3 h-3 inline mr-1" />
                                  Order Selesai
                                </div>
                              )}
                              
                              {/* Rejected - Option to delete */}
                              {order.status === "rejected" && (
                                <div className="text-xs text-red-600 text-center w-full">
                                  ❌ Ditolak
                                </div>
                              )}
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* CUSTOMERS */}
          <TabsContent value="customers">
            <Card>
              <CardHeader className="flex justify-between items-center">
                <CardTitle>Customer Database</CardTitle>
                <Button onClick={openAddCustomer} className="bg-red-600 hover:bg-red-700 gap-2">
                  <Plus className="w-4 h-4" /> Add Customer
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Orders</TableHead>
                      <TableHead>Total Spent</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customers.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                          No customers found.
                        </TableCell>
                      </TableRow>
                    )}
                    {customers.map((c) => (
                      <TableRow key={c.id}>
                        <TableCell>{c.name}</TableCell>
                        <TableCell>{c.email}</TableCell>
                        <TableCell>{c.phone}</TableCell>
                        <TableCell>{c.total_orders ?? 0}</TableCell>
                        <TableCell>{formatPrice(c.total_spent ?? 0)}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => openEditCustomer(c)}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="destructive" size="sm" onClick={() => deleteCustomer(c.id)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* INVENTORY */}
          <TabsContent value="inventory">
            <Card>
              <CardHeader className="flex items-center justify-between">
                <CardTitle>Motorcycle Inventory</CardTitle>
                <div className="flex items-center gap-4">
                  <Badge variant={loading ? "secondary" : "outline"}>
                    {loading ? "Loading..." : `${motorcycles.length} items`}
                  </Badge>
                  <Button onClick={openAddMotor} className="bg-red-600 hover:bg-red-700 gap-2">
                    <Plus className="w-4 h-4" /> Add Motorcycle
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Image</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Specs</TableHead>
                      <TableHead>Available</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {motorcycles.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                          {loading ? "Loading motorcycles..." : "No motorcycles found."}
                        </TableCell>
                      </TableRow>
                    ) : (
                      motorcycles.map((m) => (
                        <TableRow key={m.id}>
                          <TableCell>
                            {m.image ? (
                              <img 
                                src={m.image.startsWith('http') ? m.image : `${BASE_URL}${m.image}`}
                                alt={m.name}
                                className="w-12 h-12 object-cover rounded"
                                onError={(e) => {
                                  e.target.src = "https://via.placeholder.com/50x50?text=No+Image";
                                }}
                              />
                            ) : (
                              <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                                <Bike className="w-6 h-6 text-gray-400" />
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="font-medium">{m.name}</TableCell>
                          <TableCell>
                            <Badge className="capitalize">{m.category}</Badge>
                          </TableCell>
                          <TableCell>{formatPrice(m.price)}</TableCell>
                          <TableCell className="max-w-xs truncate">{m.specs || "-"}</TableCell>
                          <TableCell>
                            <Badge 
                              variant={m.available ? "default" : "secondary"} 
                              className={m.available ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
                            >
                              {m.available ? "Tersedia" : "Tidak"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" onClick={() => openEditMotor(m)}>
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button variant="destructive" size="sm" onClick={() => deleteMotor(m.id)}>
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ADVERTISEMENTS */}
          <TabsContent value="advertisements">
            <Card>
              <CardHeader className="flex items-center justify-between">
                <CardTitle>Management Iklan Motor</CardTitle>
                <div className="flex items-center gap-4">
                  <Badge variant={loading ? "secondary" : "outline"}>
                    {loading ? "Loading..." : `${advertisements.length} iklan`}
                  </Badge>
                  <Button onClick={openAddAd} className="bg-red-600 hover:bg-red-700 gap-2">
                    <Plus className="w-4 h-4" /> Tambah Iklan
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Gambar</TableHead>
                      <TableHead>Nama</TableHead>
                      <TableHead>Kategori</TableHead>
                      <TableHead>Harga</TableHead>
                      <TableHead>Deskripsi</TableHead>
                      <TableHead>Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {advertisements.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                          {loading ? "Memuat iklan..." : "Belum ada iklan."}
                        </TableCell>
                      </TableRow>
                    ) : (
                      advertisements.map((ad) => (
                        <TableRow key={ad.id}>
                          <TableCell>
                            {ad.image ? (
                              <img 
                                src={ad.image.startsWith('http') ? ad.image : `${BASE_URL}${ad.image}`}
                                alt={ad.name}
                                className="w-12 h-12 object-cover rounded"
                                onError={(e) => {
                                  e.target.src = "https://via.placeholder.com/50x50?text=No+Image";
                                }}
                              />
                            ) : (
                              <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                                <Bike className="w-6 h-6 text-gray-400" />
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="font-medium">{ad.name}</TableCell>
                          <TableCell>
                            <Badge className="capitalize">{ad.category}</Badge>
                          </TableCell>
                          <TableCell>{formatPrice(ad.price)}</TableCell>
                          <TableCell className="max-w-xs truncate">{ad.description || "-"}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" onClick={() => openEditAd(ad)}>
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button variant="destructive" size="sm" onClick={() => deleteAd(ad.id)}>
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Dialog: Order Details */}
      <Dialog open={orderDetailOpen} onOpenChange={setOrderDetailOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Order Details #{selectedOrder?.id}</DialogTitle>
            <DialogDescription>
              Detail lengkap informasi order
            </DialogDescription>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="space-y-6">
              {/* Customer Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Data Pribadi</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div><strong>Nama:</strong> {selectedOrder.customer_name}</div>
                    <div><strong>NIK KTP:</strong> {selectedOrder.nik_ktp}</div>
                    <div><strong>NIK KK:</strong> {selectedOrder.nik_kk}</div>
                    <div><strong>TTL:</strong> {selectedOrder.birth_place}, {formatDate(selectedOrder.birth_date)}</div>
                    <div><strong>Pekerjaan:</strong> {selectedOrder.occupation}</div>
                    <div><strong>Alamat:</strong> {selectedOrder.address}</div>
                    <div><strong>Telepon:</strong> {selectedOrder.customer_phone}</div>
                    <div><strong>Email:</strong> {selectedOrder.customer_email}</div>
                  </CardContent>
                </Card>

                {/* Spouse Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Data Pasangan/Avalis</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {selectedOrder.spouse_name ? (
                      <>
                        <div><strong>Nama:</strong> {selectedOrder.spouse_name}</div>
                        <div><strong>Hubungan:</strong> {selectedOrder.spouse_relationship}</div>
                        <div><strong>NIK:</strong> {selectedOrder.spouse_nik}</div>
                        <div><strong>Pekerjaan:</strong> {selectedOrder.spouse_occupation}</div>
                        <div><strong>Telepon:</strong> {selectedOrder.spouse_phone}</div>
                        <div><strong>Email:</strong> {selectedOrder.spouse_email}</div>
                        <div><strong>Alamat:</strong> {selectedOrder.spouse_address}</div>
                      </>
                    ) : (
                      <div className="text-gray-500">Tidak ada data pasangan/avalis</div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Order Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Data Pembelian</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><strong>Motor:</strong> {selectedOrder.motorcycle_name}</div>
                    <div><strong>Warna:</strong> {selectedOrder.color}</div>
                    <div><strong>Harga:</strong> {formatPrice(selectedOrder.total_price)}</div>
                    <div><strong>Metode Bayar:</strong> 
                      <Badge className="ml-2 capitalize">
                        {selectedOrder.payment_method}
                      </Badge>
                    </div>
                  </div>

                  {selectedOrder.payment_method === 'credit' && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Detail Kredit</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div><strong>DP:</strong> {formatPrice(selectedOrder.down_payment)}</div>
                        <div><strong>Persentase DP:</strong> {selectedOrder.down_payment_percent}%</div>
                        <div><strong>Tenor:</strong> {selectedOrder.loan_term} bulan</div>
                        <div><strong>Cicilan/Bulan:</strong> {formatPrice(selectedOrder.monthly_installment)}</div>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><strong>Alamat Survey:</strong> {selectedOrder.survey_address}</div>
                    <div><strong>Kontak Darurat:</strong> {selectedOrder.emergency_phone}</div>
                  </div>
                </CardContent>
              </Card>

              {/* Status Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Status Order</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <Badge className={getStatusColor(selectedOrder.status)}>
                      {getStatusIcon(selectedOrder.status)}
                      {getStatusText(selectedOrder.status)}
                    </Badge>
                    <div className="text-sm text-gray-500">
                      Dibuat: {formatDate(selectedOrder.created_at)}
                    </div>
                    {selectedOrder.updated_at !== selectedOrder.created_at && (
                      <div className="text-sm text-gray-500">
                        Diupdate: {formatDate(selectedOrder.updated_at)}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Payment Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Informasi Pembayaran</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 mb-4">
                    <Badge className={getPaymentStatusColor(selectedOrder.payment_status)}>
                      {getPaymentStatusText(selectedOrder.payment_status)}
                    </Badge>
                    {selectedOrder.payment_date && (
                      <div className="text-sm text-gray-500">
                        Tanggal Bayar: {formatDate(selectedOrder.payment_date)}
                      </div>
                    )}
                  </div>
                  
                  {selectedOrder.payment_proof && (
                    <div>
                      <Label className="text-sm font-medium mb-2">Bukti Pembayaran</Label>
                      <div className="flex items-center gap-3">
                        <img 
                          src={`${BASE_URL}${selectedOrder.payment_proof}`}
                          alt="Bukti Pembayaran"
                          className="w-32 h-32 object-contain rounded-lg border cursor-pointer"
                          onClick={() => window.open(`${BASE_URL}${selectedOrder.payment_proof}`, '_blank')}
                        />
                        <div className="flex-1">
                          <p className="text-sm text-gray-600">Klik gambar untuk melihat ukuran penuh</p>
                          {selectedOrder.payment_status === 'pending' && (
                            <div className="flex gap-2 mt-2">
                              <Button 
                                size="sm"
                                onClick={() => updatePaymentStatus(selectedOrder.id, 'paid')}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                Setujui Pembayaran
                              </Button>
                              <Button 
                                size="sm"
                                variant="destructive"
                                onClick={() => updatePaymentStatus(selectedOrder.id, 'failed')}
                              >
                                Tolak Pembayaran
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog: Add/Edit Motorcycle */}
      <Dialog open={motorDialogOpen} onOpenChange={setMotorDialogOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{motorEditing ? "Edit Motorcycle" : "Add Motorcycle"}</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={submitMotor} className="space-y-4">
            <div className="grid grid-cols-1 gap-3">
              <div>
                <Label htmlFor="name" className="text-sm font-medium">Nama Motor *</Label>
                <Input 
                  id="name"
                  name="name" 
                  value={motorForm.name} 
                  onChange={handleMotorChange} 
                  required 
                  className="mt-1"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="category" className="text-sm font-medium">Kategori *</Label>
                  <Input 
                    id="category"
                    name="category" 
                    value={motorForm.category} 
                    onChange={handleMotorChange} 
                    required 
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="price" className="text-sm font-medium">Harga *</Label>
                  <Input 
                    id="price"
                    name="price" 
                    type="number" 
                    value={motorForm.price} 
                    onChange={handleMotorChange} 
                    required 
                    className="mt-1"
                    min="0"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Gambar Motor</Label>
              
              {(imagePreview || motorForm.image) && (
                <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                  <div className="relative">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="w-12 h-12 object-cover rounded border"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute -top-1 -right-1 w-4 h-4 p-0 rounded-full"
                      onClick={clearFileSelection}
                    >
                      <X className="w-2 h-2" />
                    </Button>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-600 truncate">
                      {selectedFile ? selectedFile.name : "Gambar saat ini"}
                    </p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Input 
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <Label 
                    htmlFor="image-upload" 
                    className="flex items-center justify-center gap-1 px-3 py-2 border border-gray-300 rounded-md text-xs cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    Upload File
                  </Label>
                </div>
                
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedFile(null);
                    setImagePreview("");
                    setMotorForm(prev => ({ ...prev, image: "" }));
                  }}
                  className="text-xs h-9"
                >
                  Gunakan URL
                </Button>
              </div>

              {!selectedFile && (
                <Input 
                  name="image" 
                  value={motorForm.image} 
                  onChange={handleMotorChange} 
                  placeholder="https://example.com/image.jpg"
                  className="text-xs"
                />
              )}

              <p className="text-xs text-gray-500">
                Format: JPEG, PNG, GIF, WebP • Maksimal 5MB
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <div>
                <Label htmlFor="specs" className="text-sm font-medium">Spesifikasi</Label>
                <Input 
                  id="specs"
                  name="specs" 
                  value={motorForm.specs} 
                  onChange={handleMotorChange} 
                  placeholder="Spesifikasi teknis motor"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="available" className="text-sm font-medium">Status Ketersediaan</Label>
                <Select 
                  name="available" 
                  value={motorForm.available.toString()} 
                  onValueChange={(value) => setMotorForm(prev => ({ ...prev, available: parseInt(value) }))}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Tersedia</SelectItem>
                    <SelectItem value="0">Tidak Tersedia</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setMotorDialogOpen(false);
                  setSelectedFile(null);
                  setImagePreview("");
                }}
                size="sm"
              >
                Batal
              </Button>
              <Button 
                type="submit" 
                className="bg-red-600 hover:bg-red-700"
                disabled={loading}
                size="sm"
              >
                {loading ? "Memproses..." : (motorEditing ? "Update" : "Tambah")}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog: Add/Edit Customer */}
      <Dialog open={customerDialogOpen} onOpenChange={setCustomerDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{customerEditing ? "Edit Customer" : "Add Customer"}</DialogTitle>
            <DialogDescription>
              {customerEditing ? "Update customer data" : "Add new customer"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={submitCustomer} className="space-y-4 mt-4">
            <div>
              <Label>Name</Label>
              <Input name="name" value={customerForm.name} onChange={handleCustomerChange} required />
            </div>
            <div>
              <Label>Email</Label>
              <Input name="email" type="email" value={customerForm.email} onChange={handleCustomerChange} required />
            </div>
            <div>
              <Label>Phone</Label>
              <Input name="phone" value={customerForm.phone} onChange={handleCustomerChange} />
            </div>
            <div>
              <Label>Address</Label>
              <Input name="address" value={customerForm.address} onChange={handleCustomerChange} />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="submit" className="bg-red-600 hover:bg-red-700">
                {customerEditing ? "Update" : "Add"}
              </Button>
              <Button variant="outline" onClick={() => setCustomerDialogOpen(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog: Add/Edit Advertisement */}
      <Dialog open={adDialogOpen} onOpenChange={setAdDialogOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{adEditing ? "Edit Iklan Motor" : "Tambah Iklan Motor"}</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={submitAd} className="space-y-4">
            <div className="grid grid-cols-1 gap-3">
              <div>
                <Label htmlFor="ad-name" className="text-sm font-medium">Nama Motor *</Label>
                <Input 
                  id="ad-name"
                  name="name" 
                  value={adForm.name} 
                  onChange={handleAdChange} 
                  required 
                  className="mt-1"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="ad-category" className="text-sm font-medium">Kategori *</Label>
                  <Input 
                    id="ad-category"
                    name="category" 
                    value={adForm.category} 
                    onChange={handleAdChange} 
                    required 
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="ad-price" className="text-sm font-medium">Harga *</Label>
                  <Input 
                    id="ad-price"
                    name="price" 
                    type="number" 
                    value={adForm.price} 
                    onChange={handleAdChange} 
                    required 
                    className="mt-1"
                    min="0"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">URL Gambar Iklan</Label>
              
              {adImagePreview && (
                <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                  <img 
                    src={adImagePreview} 
                    alt="Preview" 
                    className="w-12 h-12 object-cover rounded border"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-600 truncate">
                      Gambar saat ini
                    </p>
                  </div>
                </div>
              )}

              <Input 
                name="image" 
                value={adForm.image} 
                onChange={handleAdChange} 
                placeholder="https://example.com/image.jpg"
                className="text-sm"
              />

              <p className="text-xs text-gray-500">
                Masukkan URL gambar lengkap untuk iklan
              </p>
            </div>

            <div>
              <Label htmlFor="ad-description" className="text-sm font-medium">Deskripsi Iklan</Label>
              <Input 
                id="ad-description"
                name="description" 
                value={adForm.description} 
                onChange={handleAdChange} 
                placeholder="Deskripsi menarik untuk iklan"
                className="mt-1"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setAdDialogOpen(false);
                  setSelectedAdFile(null);
                  setAdImagePreview("");
                }}
                size="sm"
              >
                Batal
              </Button>
              <Button 
                type="submit" 
                className="bg-red-600 hover:bg-red-700"
                disabled={loading}
                size="sm"
              >
                {loading ? "Memproses..." : (adEditing ? "Update" : "Tambah")}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog: Profile */}
      <Dialog open={profileDialogOpen} onOpenChange={setProfileDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Profile Admin</DialogTitle>
            <DialogDescription>
              Kelola informasi profil Anda
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={updateProfile} className="space-y-4">
            <div className="space-y-3">
              <div>
                <Label htmlFor="profile-name" className="text-sm font-medium">Nama Lengkap *</Label>
                <Input 
                  id="profile-name"
                  name="name" 
                  value={profileData.name} 
                  onChange={handleProfileChange} 
                  required 
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="profile-email" className="text-sm font-medium">Email *</Label>
                <Input 
                  id="profile-email"
                  name="email" 
                  type="email" 
                  value={profileData.email} 
                  onChange={handleProfileChange} 
                  required 
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="profile-phone" className="text-sm font-medium">Telepon</Label>
                <Input 
                  id="profile-phone"
                  name="phone" 
                  value={profileData.phone || ''} 
                  onChange={handleProfileChange} 
                  className="mt-1"
                  placeholder="+628123456789"
                />
              </div>
              
              <div>
                <Label htmlFor="profile-address" className="text-sm font-medium">Alamat</Label>
                <Input 
                  id="profile-address"
                  name="address" 
                  value={profileData.address || ''} 
                  onChange={handleProfileChange} 
                  className="mt-1"
                  placeholder="Alamat lengkap"
                />
              </div>
              
              {/* Informasi tambahan */}
              <div className="bg-gray-50 p-3 rounded-lg space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Role:</span>
                  <span className="font-medium">{profileData.role}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Bergabung:</span>
                  <span className="font-medium">{formatDate(profileData.created_at)}</span>
                </div>
                {profileData.last_login && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Login Terakhir:</span>
                    <span className="font-medium">{formatDate(profileData.last_login)}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-between items-center pt-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setChangePasswordDialogOpen(true)}
                size="sm"
              >
                Ubah Password
              </Button>
              
              <div className="flex gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setProfileDialogOpen(false)}
                  size="sm"
                >
                  Batal
                </Button>
                <Button 
                  type="submit" 
                  className="bg-red-600 hover:bg-red-700"
                  disabled={loading}
                  size="sm"
                >
                  {loading ? "Menyimpan..." : "Simpan Perubahan"}
                </Button>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog: Change Password */}
      <Dialog open={changePasswordDialogOpen} onOpenChange={setChangePasswordDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Ubah Password</DialogTitle>
            <DialogDescription>
              Masukkan password lama dan password baru Anda
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={changePassword} className="space-y-4">
            <div className="space-y-3">
              <div>
                <Label htmlFor="current-password" className="text-sm font-medium">Password Saat Ini *</Label>
                <Input 
                  id="current-password"
                  name="current_password" 
                  type="password" 
                  value={passwordForm.current_password} 
                  onChange={handlePasswordChange} 
                  required 
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="new-password" className="text-sm font-medium">Password Baru *</Label>
                <Input 
                  id="new-password"
                  name="new_password" 
                  type="password" 
                  value={passwordForm.new_password} 
                  onChange={handlePasswordChange} 
                  required 
                  className="mt-1"
                  minLength={6}
                />
                <p className="text-xs text-gray-500 mt-1">Minimal 6 karakter</p>
              </div>
              
              <div>
                <Label htmlFor="confirm-password" className="text-sm font-medium">Konfirmasi Password Baru *</Label>
                <Input 
                  id="confirm-password"
                  name="confirm_password" 
                  type="password" 
                  value={passwordForm.confirm_password} 
                  onChange={handlePasswordChange} 
                  required 
                  className="mt-1"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setChangePasswordDialogOpen(false)}
                size="sm"
              >
                Batal
              </Button>
              <Button 
                type="submit" 
                className="bg-red-600 hover:bg-red-700"
                disabled={loading}
                size="sm"
              >
                {loading ? "Mengubah..." : "Ubah Password"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog: Settings */}
      <Dialog open={settingsDialogOpen} onOpenChange={setSettingsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Pengaturan Sistem</DialogTitle>
            <DialogDescription>
              Kelola preferensi dan pengaturan aplikasi
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={updateSettings} className="space-y-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-3">Notifikasi</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="email-notifications" className="text-sm">Email Notifications</Label>
                    <div className="flex items-center">
                      <input
                        id="email-notifications"
                        type="checkbox"
                        checked={settingsData.email_notifications}
                        onChange={(e) => handleSettingsChange('email_notifications', e.target.checked)}
                        className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="sales-alerts" className="text-sm">Sales Alerts</Label>
                    <div className="flex items-center">
                      <input
                        id="sales-alerts"
                        type="checkbox"
                        checked={settingsData.sales_alerts}
                        onChange={(e) => handleSettingsChange('sales_alerts', e.target.checked)}
                        className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="low-stock-alerts" className="text-sm">Low Stock Alerts</Label>
                    <div className="flex items-center">
                      <input
                        id="low-stock-alerts"
                        type="checkbox"
                        checked={settingsData.low_stock_alerts}
                        onChange={(e) => handleSettingsChange('low_stock_alerts', e.target.checked)}
                        className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="text-sm font-medium mb-3">Backup & Keamanan</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="auto-backup" className="text-sm">Auto Backup</Label>
                    <div className="flex items-center">
                      <input
                        id="auto-backup"
                        type="checkbox"
                        checked={settingsData.auto_backup}
                        onChange={(e) => handleSettingsChange('auto_backup', e.target.checked)}
                        className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                      />
                    </div>
                  </div>
                  
                  {settingsData.auto_backup && (
                    <div>
                      <Label htmlFor="backup-frequency" className="text-sm">Frekuensi Backup</Label>
                      <Select 
                        value={settingsData.backup_frequency} 
                        onValueChange={(value) => handleSettingsChange('backup_frequency', value)}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="daily">Harian</SelectItem>
                          <SelectItem value="weekly">Mingguan</SelectItem>
                          <SelectItem value="monthly">Bulanan</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="text-sm font-medium mb-3">Preferensi</h3>
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="language" className="text-sm">Bahasa</Label>
                    <Select 
                      value={settingsData.language} 
                      onValueChange={(value) => handleSettingsChange('language', value)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="id">Bahasa Indonesia</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="timezone" className="text-sm">Zona Waktu</Label>
                    <Select 
                      value={settingsData.timezone} 
                      onValueChange={(value) => handleSettingsChange('timezone', value)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Asia/Jakarta">WIB (Jakarta)</SelectItem>
                        <SelectItem value="Asia/Makassar">WITA (Makassar)</SelectItem>
                        <SelectItem value="Asia/Jayapura">WIT (Jayapura)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setSettingsDialogOpen(false)}
                size="sm"
              >
                Batal
              </Button>
              <Button 
                type="submit" 
                className="bg-red-600 hover:bg-red-700"
                disabled={loading}
                size="sm"
              >
                {loading ? "Menyimpan..." : "Simpan Pengaturan"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}