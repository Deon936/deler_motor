import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { CreditCard, Wallet, CheckCircle, User, Phone, MapPin, FileText, Loader2, Shield, Banknote, QrCode, Store, ArrowLeft, Copy, Download, Upload, Camera } from "lucide-react";
import { useCart } from "../contexts/CartContext";
import { toast } from "sonner";

// 🔹 PERBAIKAN: Update API Base URL ke Express.js
const API_BASE = "http://localhost:5000/api";

// Tipe Data untuk Form
interface FormData {
    fullName: string;
    nickname: string;
    nikKK: string;
    nikKTP: string;
    birthPlace: string;
    birthDate: string;
    occupation: string;
    address: string;
    phone: string;
    email: string;
    stnkName: string;
    spouseName: string;
    spousePhone: string;
    spouseRelationship: string;
    spouseNik: string;
    spouseOccupation: string;
    spouseAddress: string;
    spouseEmail: string;
    motorcycleType: string;
    motorcyclePrice: number;
    downPayment: string;
    installmentPeriod: string;
    color: string;
    surveyAddress: string;
    emergencyPhone: string;
}

interface BikeData {
    id: number;
    name: string;
    price: number;
    category: string;
    image?: string;
}

interface ManualPaymentData {
    id: number;
    payment_code: string;
    payment_method: 'bank_transfer' | 'ewallet' | 'qr_code' | 'cash';
    bank_name?: string;
    account_number?: string;
    account_holder?: string;
    ewallet_type?: string;
    ewallet_number?: string;
    ewallet_name?: string;
    qr_content?: string;
    cash_pickup_address?: string;
    amount: number;
    status: 'pending' | 'paid' | 'expired' | 'cancelled';
    expired_at: string;
    created_at: string;
}

export function PaymentPage() {
    const [searchParams] = useSearchParams();
    const bikeId = searchParams.get("bike");
    const fromCart = searchParams.get("from") === "cart";
    const navigate = useNavigate();
    
    // State Pembayaran & Order
    const [paymentMethod, setPaymentMethod] = useState<"credit" | "cash">("credit");
    const [showSuccess, setShowSuccess] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [motorcycles, setMotorcycles] = useState<BikeData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [paymentStep, setPaymentStep] = useState<'form' | 'payment' | 'upload'>('form');
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'bank_transfer' | 'ewallet' | 'qr_code' | 'cash'>('bank_transfer');
    const [createdOrderId, setCreatedOrderId] = useState<number | null>(null);
    const [paymentDetails, setPaymentDetails] = useState<ManualPaymentData | null>(null);
    
    // State Upload Bukti Pembayaran
    const [paymentProof, setPaymentProof] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    // State NIK Validation
    const [isValidatingNIK, setIsValidatingNIK] = useState(false);
    const [nikValidation, setNikValidation] = useState<{valid?: boolean, message?: string, details?: any}>({});
    
    const { cartItems, getTotalPrice, clearCart } = useCart();

    // Get user data from localStorage
    const userEmail = localStorage.getItem("userEmail") || "";
    const userName = localStorage.getItem("userName") || "";
    const userPhone = localStorage.getItem("userPhone") || "";
    const userId = localStorage.getItem("userId") || null; 

    // Form state
    const [formData, setFormData] = useState<FormData>({
        fullName: userName,
        nickname: "",
        nikKK: "",
        nikKTP: "",
        birthPlace: "",
        birthDate: "",
        occupation: "",
        address: "",
        phone: userPhone,
        email: userEmail,
        stnkName: userName,
        spouseName: "",
        spousePhone: "",
        spouseRelationship: "",
        spouseNik: "",
        spouseOccupation: "",
        spouseAddress: "",
        spouseEmail: "",
        motorcycleType: "",
        motorcyclePrice: 0,
        downPayment: "20",
        installmentPeriod: "24",
        color: "",
        surveyAddress: "",
        emergencyPhone: "",
    });

    // 🔹 PERBAIKAN: Fetch motorcycles data dari Express.js API
    useEffect(() => {
        const fetchMotorcycles = async () => {
            try {
                const response = await fetch(`${API_BASE}/motorcycles`);
                const data = await response.json();
                
                console.log("📨 Motorcycles response:", data);
                
                if (data.success && Array.isArray(data.data)) {
                    setMotorcycles(data.data);
                    
                    // Set initial bike selection
                    if (bikeId) {
                        const selectedBike = data.data.find((bike: BikeData) => bike.id.toString() === bikeId);
                        if (selectedBike) {
                            setFormData(prev => ({
                                ...prev,
                                motorcycleType: selectedBike.name,
                                motorcyclePrice: selectedBike.price
                            }));
                        }
                    } else if (data.data.length > 0) {
                        // Default to first bike if no bikeId
                        setFormData(prev => ({
                            ...prev,
                            motorcycleType: data.data[0].name,
                            motorcyclePrice: data.data[0].price
                        }));
                    }
                } else {
                    toast.error('Gagal memuat data motor');
                }
            } catch (error) {
                console.error('Error fetching motorcycles:', error);
                toast.error('Gagal memuat data motor');
            } finally {
                setIsLoading(false);
            }
        };

        fetchMotorcycles();
    }, [bikeId]);

    // Get selected bike
    const selectedBike = bikeId 
        ? motorcycles.find(bike => bike.id.toString() === bikeId)
        : motorcycles[0];

    const orderTotal = fromCart ? getTotalPrice() : (selectedBike?.price || 0);
    const orderItems = fromCart 
        ? cartItems.map(item => `${item.name} (x${item.quantity})`).join(", ")
        : selectedBike?.name || "Motor tidak tersedia";

    const motorcycleId = fromCart && cartItems.length > 0 
        ? parseInt(cartItems[0].id.toString()) 
        : (selectedBike?.id || 0);

    const motorcycleQuantity = fromCart ? cartItems.reduce((acc, item) => acc + item.quantity, 0) : 1;

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(price);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSelectChange = (name: keyof FormData, value: string) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // 🔹 PERBAIKAN: Validasi NIK dengan endpoint Express.js
    const validateNIK = async (nik: string) => {
        if (nik.length !== 16) {
            setNikValidation({ valid: false, message: 'NIK harus 16 digit' });
            return;
        }
        
        setIsValidatingNIK(true);
        try {
            const res = await fetch(`${API_BASE}/validate-nik`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nik })
            });
            
            const data = await res.json();
            
            if (data.success) {
                setNikValidation({ 
                    valid: true, 
                    message: 'NIK valid',
                    details: data.data 
                });
                toast.success('NIK valid');
                
                // Auto-fill birth date if available
                if (data.data.birth_date && !formData.birthDate) {
                    setFormData(prev => ({
                        ...prev,
                        birthDate: data.data.birth_date
                    }));
                }
            } else {
                setNikValidation({ 
                    valid: false, 
                    message: data.message || 'NIK tidak valid' 
                });
                toast.error(data.message || 'NIK tidak valid');
            }
        } catch (error) {
            console.error('NIK validation error:', error);
            toast.error('Gagal validasi NIK');
            setNikValidation({ valid: false, message: 'Gagal validasi NIK' });
        } finally {
            setIsValidatingNIK(false);
        }
    };

    useEffect(() => {
        if (formData.nikKTP.length === 16) {
            const timer = setTimeout(() => {
                validateNIK(formData.nikKTP);
            }, 1000);
            return () => clearTimeout(timer);
        } else if (formData.nikKTP.length > 0) {
            setNikValidation({ valid: false, message: 'NIK harus 16 digit' });
        } else {
            setNikValidation({});
        }
    }, [formData.nikKTP]);

    // Calculate credit with interest
    const calculateCredit = () => {
        const dpPercent = parseInt(formData.downPayment) / 100;
        const months = parseInt(formData.installmentPeriod);
        const price = orderTotal;
        
        const downPaymentAmount = price * dpPercent;
        const loanAmount = price - downPaymentAmount;
        
        const annualInterestRate = 8.5; 
        const monthlyInterestRate = annualInterestRate / 100 / 12;
        
        let monthlyInstallment = 0;
        let totalInterest = 0;
        let totalPayment = 0;
        
        if (months > 0 && monthlyInterestRate > 0) {
            monthlyInstallment = loanAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, months) / (Math.pow(1 + monthlyInterestRate, months) - 1);
            totalInterest = (monthlyInstallment * months) - loanAmount;
            totalPayment = monthlyInstallment * months + downPaymentAmount;
        }

        return {
            downPaymentAmount: Math.round(downPaymentAmount),
            loanAmount: Math.round(loanAmount),
            monthlyInstallment: Math.round(monthlyInstallment),
            totalInterest: Math.round(totalInterest),
            totalPayment: Math.round(totalPayment)
        };
    };

    const creditCalculation = calculateCredit();

    // Calculate cash discount
    const calculateCashTotal = () => {
        const adminFee = 1500000;
        const cashDiscount = 2000000;
        return orderTotal + adminFee - cashDiscount;
    };

    const cashTotal = calculateCashTotal();

    // 🔹 PERBAIKAN: Process Order dengan Express.js API
    const processOrder = async () => {
        setIsSubmitting(true);

        const validationError = validateForm();
        if (validationError) {
            toast.error(validationError);
            setIsSubmitting(false);
            return;
        }
        
        const orderData = {
            customer_name: formData.fullName,
            nik_kk: formData.nikKK,
            nik_ktp: formData.nikKTP,
            birth_place: formData.birthPlace,
            birth_date: formData.birthDate,
            occupation: formData.occupation,
            address: formData.address,
            customer_phone: formData.phone,
            stnk_name: formData.stnkName,
            
            motorcycle_id: motorcycleId,
            motorcycle_name: orderItems,
            total_price: orderTotal,
            color: formData.color,
            quantity: motorcycleQuantity,
            motorcycle_type: formData.motorcycleType,

            user_id: userId ? userId : undefined,
            nickname: formData.nickname || undefined,
            customer_email: formData.email || undefined,
            survey_address: formData.surveyAddress,
            emergency_phone: formData.emergencyPhone || undefined,
            
            spouse_name: formData.spouseName || undefined,
            spouse_phone: formData.spousePhone || undefined,
            spouse_relationship: formData.spouseRelationship || undefined,
            spouse_nik: formData.spouseNik || undefined,
            spouse_occupation: formData.spouseOccupation || undefined,
            spouse_address: formData.spouseAddress || undefined,
            spouse_email: formData.spouseEmail || undefined,
            
            payment_method: paymentMethod,
            down_payment: paymentMethod === 'credit' ? creditCalculation.downPaymentAmount : cashTotal,
            down_payment_percent: parseInt(formData.downPayment),
            loan_term: paymentMethod === 'credit' ? parseInt(formData.installmentPeriod) : 0,
            monthly_installment: paymentMethod === 'credit' ? creditCalculation.monthlyInstallment : 0,
            
            status: 'pending',
            payment_status: 'unpaid'
        };

        console.log('📤 Sending order data:', orderData);

        try {
            const res = await fetch(`${API_BASE}/orders`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData)
            });

            const data = await res.json();
            console.log('📨 Order response:', data);
            
            if (data.success) {
                const orderId = data.data?.id || data.order_id;
                setCreatedOrderId(orderId);
                
                toast.success(`Order ${paymentMethod === 'credit' ? 'Kredit' : 'Cash'} berhasil dibuat!`);
                setPaymentStep('payment');
                
                if (fromCart) clearCart();
                
            } else {
                console.error('Error response dari server:', data);
                const errorMsg = data.message || 'Gagal membuat pesanan.';
                toast.error(errorMsg);
            }
        } catch (error) {
            console.error('Error submitting order:', error);
            toast.error('Terjadi kesalahan koneksi. Silakan coba lagi.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // 🔹 PERBAIKAN: Process Payment dengan Express.js API
    const processPayment = async () => {
        if (!selectedPaymentMethod) {
            toast.error('Pilih metode pembayaran terlebih dahulu');
            return;
        }

        if (!createdOrderId) {
            toast.error('Order ID tidak ditemukan');
            return;
        }

        setIsSubmitting(true);
        try {
            const amountToPay = paymentMethod === 'credit' 
                ? creditCalculation.downPaymentAmount 
                : cashTotal;

            const paymentData = {
                order_id: createdOrderId,
                payment_method: selectedPaymentMethod,
                amount: amountToPay
            };

            console.log('📤 Sending payment data:', paymentData);

            const res = await fetch(`${API_BASE}/payment`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(paymentData)
            });

            const data = await res.json();
            console.log('📨 Payment response:', data);
            
            if (data.success) {
                setPaymentDetails(data.data);
                
                let successMessage = `Instruksi pembayaran berhasil dibuat!`;
                
                if (selectedPaymentMethod === 'bank_transfer') {
                    successMessage = `Silakan transfer ke rekening ${data.data.bank_name}: ${data.data.account_number}`;
                } else if (selectedPaymentMethod === 'ewallet') {
                    successMessage = `Silakan transfer ke ${data.data.ewallet_type}: ${data.data.ewallet_number}`;
                } else if (selectedPaymentMethod === 'qr_code') {
                    successMessage = 'QR Code berhasil dibuat. Silakan scan untuk pembayaran.';
                } else if (selectedPaymentMethod === 'cash') {
                    successMessage = 'Silakan datang ke lokasi untuk pembayaran cash.';
                }
                
                toast.success(successMessage);
                setPaymentStep('upload');
                
            } else {
                toast.error(data.message || 'Gagal membuat instruksi pembayaran');
            }
        } catch (error) {
            console.error('Payment error:', error);
            toast.error('Terjadi kesalahan saat memproses pembayaran');
        } finally {
            setIsSubmitting(false);
        }
    };

    // 🔹 PERBAIKAN: Upload Bukti Pembayaran dengan Express.js API
    const uploadPaymentProof = async () => {
        if (!paymentProof || !createdOrderId) {
            toast.error('Pilih file bukti pembayaran terlebih dahulu');
            return;
        }

        setIsUploading(true);
        setUploadProgress(0);

        try {
            // Convert file to base64
            const base64Data = await convertFileToBase64(paymentProof);
            
            const payload = {
                order_id: createdOrderId,
                filename: paymentProof.name,
                file: base64Data,
                payment_method: selectedPaymentMethod
            };

            console.log('📤 Uploading payment proof:', {
                order_id: createdOrderId,
                filename: paymentProof.name,
                fileSize: base64Data.length
            });

            const response = await fetch(`${API_BASE}/upload-payment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();
            console.log('📨 Upload response:', data);

            if (data.success) {
                toast.success('Bukti pembayaran berhasil diupload!');
                setShowSuccess(true);
            } else {
                toast.error(data.message || 'Gagal upload bukti pembayaran');
            }
        } catch (error) {
            console.error('Upload error:', error);
            toast.error('Terjadi kesalahan saat upload bukti pembayaran');
        } finally {
            setIsUploading(false);
            setUploadProgress(0);
        }
    };

    // Helper function to convert file to base64
    const convertFileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = error => reject(error);
        });
    };

    // Handle file selection
    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validasi tipe file
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'application/pdf'];
            if (!allowedTypes.includes(file.type)) {
                toast.error('Hanya file JPG, PNG, GIF, atau PDF yang diizinkan');
                return;
            }

            // Validasi ukuran file (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                toast.error('Ukuran file maksimal 5MB');
                return;
            }

            setPaymentProof(file);
        }
    };

    // Validasi Form
    const validateForm = () => {
        const requiredFields: (keyof FormData)[] = [
            'fullName', 'nikKK', 'nikKTP', 'birthPlace', 'birthDate', 'occupation', 
            'address', 'phone', 'stnkName', 'color', 'surveyAddress' 
        ];
        
        for (const field of requiredFields) {
            if (!formData[field]) {
                return `Field "${field}" wajib diisi.`;
            }
        }
        
        if (formData.nikKTP.length !== 16 || !nikValidation.valid) {
            return 'NIK KTP tidak valid atau belum divalidasi.';
        }

        if (paymentMethod === 'credit') {
            const creditRequiredFields: (keyof FormData)[] = [
                'spouseName', 'spousePhone', 'spouseNik', 'spouseAddress'
            ];
            for (const field of creditRequiredFields) {
                if (!formData[field]) {
                    return `Field Pasangan/Avalis (${field}) wajib diisi untuk Kredit.`;
                }
            }
        }
        
        return null;
    };

    // Handle Submit Form Order
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await processOrder();
    };

    // Handle Submit Pembayaran
    const handlePaymentSubmit = async () => {
        await processPayment();
    };

    // Komponen Upload Bukti Pembayaran
    const UploadPaymentProof = () => (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Upload className="w-5 h-5" />
                    Upload Bukti Pembayaran
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="bg-blue-50 p-4 rounded border border-blue-300">
                    <h3 className="font-bold text-lg text-blue-800 mb-3">Informasi Pembayaran</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-600">Kode Pembayaran</p>
                            <p className="font-semibold">{paymentDetails?.payment_code}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Total Bayar</p>
                            <p className="font-semibold text-red-600 text-xl">
                                {paymentDetails && formatPrice(paymentDetails.amount)}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Metode Pembayaran</p>
                            <p className="font-semibold capitalize">
                                {paymentDetails?.payment_method === 'bank_transfer' ? 'Transfer Bank' : 
                                 paymentDetails?.payment_method === 'ewallet' ? 'E-Wallet' : 
                                 paymentDetails?.payment_method === 'qr_code' ? 'QR Code' : 'Cash'}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Batas Waktu</p>
                            <p className="font-semibold">
                                {paymentDetails && new Date(paymentDetails.expired_at).toLocaleString('id-ID')}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="border rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">Upload Bukti Pembayaran</h3>
                    
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="paymentProof" className="mb-2 block">
                                Pilih File Bukti Pembayaran *
                            </Label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                                <input
                                    type="file"
                                    id="paymentProof"
                                    accept=".jpg,.jpeg,.png,.gif,.pdf"
                                    onChange={handleFileSelect}
                                    className="hidden"
                                />
                                <label htmlFor="paymentProof" className="cursor-pointer">
                                    <Camera className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                                    <p className="text-lg font-medium mb-1">
                                        {paymentProof ? paymentProof.name : 'Klik untuk memilih file'}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        Format: JPG, PNG, GIF, PDF (Maks. 5MB)
                                    </p>
                                    <Button 
                                        variant="outline" 
                                        className="mt-3"
                                        onClick={() => document.getElementById('paymentProof')?.click()}
                                    >
                                        <Upload className="w-4 h-4 mr-2" />
                                        Pilih File
                                    </Button>
                                </label>
                            </div>
                            {paymentProof && (
                                <div className="mt-2 p-3 bg-green-50 rounded border border-green-200">
                                    <p className="text-green-700 flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4" />
                                        File terpilih: {paymentProof.name} ({(paymentProof.size / 1024 / 1024).toFixed(2)} MB)
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="bg-yellow-50 p-4 rounded border border-yellow-200">
                            <h4 className="font-semibold text-yellow-800 mb-2">Perhatian:</h4>
                            <ul className="text-sm text-yellow-700 space-y-1 list-disc list-inside">
                                <li>Pastikan bukti pembayaran jelas terbaca</li>
                                <li>File harus menunjukkan nominal, tanggal, dan metode pembayaran</li>
                                <li>Proses verifikasi membutuhkan waktu 1-2 jam kerja</li>
                                <li>Status pembayaran akan diperbarui setelah verifikasi</li>
                            </ul>
                        </div>

                        <div className="flex gap-3">
                            <Button 
                                variant="outline"
                                onClick={() => setPaymentStep('payment')}
                                disabled={isUploading}
                            >
                                Kembali
                            </Button>
                            <Button 
                                onClick={uploadPaymentProof}
                                disabled={!paymentProof || isUploading}
                                className="bg-green-600 hover:bg-green-700 flex-1"
                            >
                                {isUploading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Mengupload...
                                    </>
                                ) : (
                                    <>
                                        <Upload className="w-4 h-4 mr-2" />
                                        Upload Bukti Pembayaran
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );

    // Payment Methods Component
    const PaymentMethods = () => {
        const renderPaymentInstructions = () => {
            if (!selectedPaymentMethod) return null;

            const amountToPay = paymentMethod === 'credit' 
                ? creditCalculation.downPaymentAmount 
                : cashTotal;

            switch (selectedPaymentMethod) {
                case 'bank_transfer':
                    return (
                        <div className="bg-blue-50 p-4 rounded border border-blue-200">
                            <h4 className="font-semibold text-blue-800 mb-3">Instruksi Transfer Bank</h4>
                            <div className="space-y-3">
                                <div className="bg-white p-3 rounded border">
                                    <p className="font-semibold">Bank Central Asia (BCA)</p>
                                    <p className="text-2xl font-mono text-red-600">1234567890</p>
                                    <p className="text-sm text-gray-600">a.n. HONDA DAYA MOTOR</p>
                                </div>
                                <div className="bg-white p-3 rounded border">
                                    <p className="font-semibold">Bank Mandiri</p>
                                    <p className="text-2xl font-mono text-red-600">0987654321</p>
                                    <p className="text-sm text-gray-600">a.n. HONDA DAYA MOTOR</p>
                                </div>
                            </div>
                            <div className="mt-4 text-sm text-blue-700">
                                <p><strong>Langkah-langkah:</strong></p>
                                <ol className="list-decimal list-inside space-y-1 mt-2">
                                    <li>Transfer ke salah satu rekening di atas</li>
                                    <li>Jumlah transfer: <strong>{formatPrice(amountToPay)}</strong></li>
                                    <li>Simpan bukti transfer</li>
                                    <li>Upload bukti transfer setelah pembayaran</li>
                                </ol>
                            </div>
                        </div>
                    );

                case 'ewallet':
                    return (
                        <div className="bg-green-50 p-4 rounded border border-green-200">
                            <h4 className="font-semibold text-green-800 mb-3">Instruksi E-Wallet</h4>
                            <div className="space-y-3">
                                <div className="bg-white p-3 rounded border">
                                    <p className="font-semibold">DANA</p>
                                    <p className="text-2xl font-mono text-red-600">081234567890</p>
                                    <p className="text-sm text-gray-600">a.n. HONDA DAYA MOTOR</p>
                                </div>
                                <div className="bg-white p-3 rounded border">
                                    <p className="font-semibold">Gopay</p>
                                    <p className="text-2xl font-mono text-red-600">081234567890</p>
                                    <p className="text-sm text-gray-600">a.n. HONDA DAYA MOTOR</p>
                                </div>
                            </div>
                            <div className="mt-4 text-sm text-green-700">
                                <p><strong>Langkah-langkah:</strong></p>
                                <ol className="list-decimal list-inside space-y-1 mt-2">
                                    <li>Transfer ke salah satu nomor e-wallet di atas</li>
                                    <li>Jumlah transfer: <strong>{formatPrice(amountToPay)}</strong></li>
                                    <li>Simpan bukti transfer</li>
                                    <li>Upload bukti transfer setelah pembayaran</li>
                                </ol>
                            </div>
                        </div>
                    );

                case 'qr_code':
                    return (
                        <div className="bg-purple-50 p-4 rounded border border-purple-200">
                            <h4 className="font-semibold text-purple-800 mb-3">Pembayaran QRIS</h4>
                            <div className="text-center">
                                <div className="bg-white p-4 inline-block rounded border">
                                    <div className="w-64 h-64 bg-gray-200 flex items-center justify-center mb-3">
                                        <QrCode className="w-16 h-16 text-gray-400" />
                                        <p className="text-sm text-gray-500">QR Code akan muncul setelah pembayaran dibuat</p>
                                    </div>
                                    <p className="text-sm text-gray-600">Scan QR code di atas menggunakan aplikasi e-wallet atau mobile banking Anda</p>
                                </div>
                            </div>
                        </div>
                    );

                case 'cash':
                    return (
                        <div className="bg-orange-50 p-4 rounded border border-orange-200">
                            <h4 className="font-semibold text-orange-800 mb-3">Pembayaran Cash</h4>
                            <div className="bg-white p-4 rounded border">
                                <p className="font-semibold">Lokasi Pembayaran:</p>
                                <p className="mt-2 text-sm whitespace-pre-line">
                                    Jl. Raya Cikampek No. 123{"\n"}
                                    Buka: Senin-Jumat 09:00-17:00{"\n"}
                                    Sabtu: 09:00-14:00
                                </p>
                                <div className="mt-3 p-3 bg-yellow-100 rounded">
                                    <p className="text-sm font-semibold text-yellow-800">📞 Hubungi kami:</p>
                                    <p className="text-sm">Telepon: (021) 1234-5678</p>
                                    <p className="text-sm">WhatsApp: 0812-3456-7890</p>
                                </div>
                            </div>
                        </div>
                    );

                default:
                    return null;
            }
        };

        const amountToPay = paymentMethod === 'credit' 
            ? creditCalculation.downPaymentAmount 
            : cashTotal;

        return (
            <div className="border rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">
                    Pilih Metode Pembayaran untuk {paymentMethod === 'credit' ? 'Down Payment' : 'Pembayaran Cash'}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <Card 
                        className={`cursor-pointer border-2 transition-all ${
                            selectedPaymentMethod === 'bank_transfer' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'
                        }`}
                        onClick={() => setSelectedPaymentMethod('bank_transfer')}
                    >
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <Banknote className="w-6 h-6 text-blue-600" />
                                <div>
                                    <p className="font-semibold">Transfer Bank</p>
                                    <p className="text-sm text-gray-600">BCA, BRI, Mandiri, dll</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card 
                        className={`cursor-pointer border-2 transition-all ${
                            selectedPaymentMethod === 'ewallet' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-green-300'
                        }`}
                        onClick={() => setSelectedPaymentMethod('ewallet')}
                    >
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <Wallet className="w-6 h-6 text-green-600" />
                                <div>
                                    <p className="font-semibold">E-Wallet</p>
                                    <p className="text-sm text-gray-600">DANA, Gopay, OVO, LinkAja</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card 
                        className={`cursor-pointer border-2 transition-all ${
                            selectedPaymentMethod === 'qr_code' ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-purple-300'
                        }`}
                        onClick={() => setSelectedPaymentMethod('qr_code')}
                    >
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <QrCode className="w-6 h-6 text-purple-600" />
                                <div>
                                    <p className="font-semibold">QRIS</p>
                                    <p className="text-sm text-gray-600">Scan QR Code</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card 
                        className={`cursor-pointer border-2 transition-all ${
                            selectedPaymentMethod === 'cash' ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-orange-300'
                        }`}
                        onClick={() => setSelectedPaymentMethod('cash')}
                    >
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <Store className="w-6 h-6 text-orange-600" />
                                <div>
                                    <p className="font-semibold">Cash</p>
                                    <p className="text-sm text-gray-600">Bayar di Tempat</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {renderPaymentInstructions()}

                <div className="bg-gray-50 p-4 rounded border mt-4">
                    <p className="text-sm text-gray-600 mb-2">
                        {paymentMethod === 'credit' ? 'Total Down Payment (DP) yang harus dibayar:' : 'Total Pembayaran Cash:'}
                    </p>
                    <p className="text-2xl font-bold text-red-600">
                        {formatPrice(amountToPay)}
                    </p>
                </div>
            </div>
        );
    };
    
    // NIK Field dengan validasi
    const renderNIKField = () => (
        <div>
            <Label htmlFor="nikKTP" className="flex items-center gap-2 mb-2">
                NIK KTP *
                {formData.nikKTP && (
                    <div className="flex items-center gap-1 text-sm">
                        {isValidatingNIK ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                        ) : nikValidation.valid ? (
                            <Shield className="w-3 h-3 text-green-600" />
                        ) : (
                            <Shield className="w-3 h-3 text-red-600" />
                        )}
                        <span className={nikValidation.valid ? 'text-green-600' : 'text-red-600'}>
                            {nikValidation.message || (formData.nikKTP.length === 16 ? 'Validasi OK' : 'Masukkan 16 digit')}
                        </span>
                    </div>
                )}
            </Label>
            <Input
                id="nikKTP"
                name="nikKTP"
                value={formData.nikKTP}
                onChange={handleInputChange}
                placeholder="16 digit NIK"
                maxLength={16}
                required
                className={formData.nikKTP.length === 16 ? 
                    (nikValidation.valid ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50') : ''
                }
            />
        </div>
    );

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
                    <p>Memuat data motor...</p>
                </div>
            </div>
        );
    }

    if (showSuccess) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
                <Card className="max-w-2xl w-full">
                    <CardContent className="pt-6">
                        <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                        <h2 className="text-2xl text-center mb-2">Pembayaran Berhasil!</h2>
                        <p className="text-center text-gray-600 mb-6">
                            Terima kasih telah melakukan pembayaran. Pesanan Anda sedang diproses.
                        </p>
                        
                        {paymentDetails && (
                            <div className="mt-6 space-y-6">
                                {/* Informasi Umum */}
                                <div className="bg-blue-50 p-4 rounded border border-blue-300">
                                    <h3 className="font-bold text-lg text-blue-800 mb-3">Detail Pembayaran</h3>
                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <p className="text-sm text-gray-600">Kode Pembayaran</p>
                                            <p className="font-semibold">{paymentDetails.payment_code}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Total Bayar</p>
                                            <p className="font-semibold text-red-600 text-xl">
                                                {formatPrice(paymentDetails.amount)}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Batas Waktu</p>
                                            <p className="font-semibold">
                                                {new Date(paymentDetails.expired_at).toLocaleString('id-ID')}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Status</p>
                                            <p className="font-semibold capitalize">{paymentDetails.status}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-3 justify-center mt-6">
                                    <Button 
                                        variant="outline" 
                                        onClick={() => navigate("/profile")}
                                    >
                                        Lihat Pesanan Saya
                                    </Button>
                                    <Button 
                                        onClick={() => navigate("/")}
                                        className="bg-red-600 hover:bg-red-700"
                                    >
                                        Kembali ke Beranda
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <div className="mb-8 text-center">
                    <h1 className="text-4xl mb-2">
                        {paymentStep === 'form' ? 'Form Pembelian Motor' : 
                         paymentStep === 'payment' ? 'Pembayaran' : 
                         'Upload Bukti Pembayaran'}
                    </h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="w-5 h-5" />
                                    Ringkasan Pesanan
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-sm text-gray-600">Items Pesanan</p>
                                        <p className="text-sm font-medium">{orderItems}</p>
                                    </div>
                                    
                                    {paymentMethod === 'credit' ? (
                                        <div className="bg-blue-50 p-3 rounded border border-blue-200">
                                            <p className="text-sm font-medium text-blue-900">Simulasi Kredit</p>
                                            <div className="mt-2 space-y-1 text-sm">
                                                <div className="flex justify-between">
                                                    <span>DP {formData.downPayment}%:</span>
                                                    <span className="font-medium">{formatPrice(creditCalculation.downPaymentAmount)}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>Pinjaman:</span>
                                                    <span className="font-medium">{formatPrice(creditCalculation.loanAmount)}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>Cicilan {formData.installmentPeriod} bln:</span>
                                                    <span className="font-medium text-red-600">{formatPrice(creditCalculation.monthlyInstallment)}/bln</span>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="bg-green-50 p-3 rounded border border-green-200">
                                            <p className="text-sm font-medium text-green-900">Keuntungan Cash</p>
                                            <div className="mt-2 space-y-1 text-sm">
                                                <div className="flex justify-between">
                                                    <span>Harga Normal:</span>
                                                    <span className="font-medium">{formatPrice(orderTotal)}</span>
                                                </div>
                                                <div className="flex justify-between text-green-600">
                                                    <span>Diskon Cash:</span>
                                                    <span className="font-medium">-{formatPrice(2000000)}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>Biaya Admin:</span>
                                                    <span className="font-medium">{formatPrice(1500000)}</span>
                                                </div>
                                                <div className="flex justify-between font-bold border-t pt-1 mt-1">
                                                    <span>Total Bayar:</span>
                                                    <span className="text-red-600">{formatPrice(cashTotal)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="border-t pt-4">
                                        <div className="flex justify-between text-lg font-bold">
                                            <span>Total {paymentMethod === 'credit' ? 'DP' : 'Cash'}</span>
                                            <span className="text-red-600">
                                                {paymentMethod === 'credit' 
                                                    ? formatPrice(creditCalculation.downPaymentAmount)
                                                    : formatPrice(cashTotal)
                                                }
                                            </span>
                                        </div>
                                    </div>
                                    
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Form / Payment Step */}
                    <div className="lg:col-span-3">
                        {paymentStep === 'form' ? (
                            <Card>
                                <CardHeader>
                                    <CardTitle>
                                        Langkah 1: Lengkapi Data & Pilih Metode
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        
                                        {/* Metode Pembayaran */}
                                        <div className="space-y-4">
                                            <Label>Pilih Metode Pembelian</Label>
                                            <Tabs value={paymentMethod} onValueChange={(val) => setPaymentMethod(val as "credit" | "cash")}>
                                                <TabsList className="grid w-full grid-cols-2">
                                                    <TabsTrigger value="credit" className="flex gap-2"><CreditCard className="w-4 h-4" /> Kredit</TabsTrigger>
                                                    <TabsTrigger value="cash" className="flex gap-2"><Wallet className="w-4 h-4" /> Cash</TabsTrigger>
                                                </TabsList>
                                            </Tabs>
                                        </div>
                                        
                                        {/* Data Pribadi */}
                                        <h3 className="text-xl font-semibold border-b pb-2 flex items-center gap-2"><User className="w-5 h-5 text-red-600"/> Data Pribadi</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <Label htmlFor="fullName">Nama Lengkap *</Label>
                                                <Input id="fullName" name="fullName" value={formData.fullName} onChange={handleInputChange} required />
                                            </div>
                                            <div>
                                                <Label htmlFor="stnkName">Nama di STNK *</Label>
                                                <Input id="stnkName" name="stnkName" value={formData.stnkName} onChange={handleInputChange} required />
                                            </div>
                                            {renderNIKField()}
                                            <div>
                                                <Label htmlFor="nikKK">NIK KK *</Label>
                                                <Input id="nikKK" name="nikKK" value={formData.nikKK} onChange={handleInputChange} placeholder="16 digit NIK KK" maxLength={16} required />
                                            </div>
                                            <div>
                                                <Label htmlFor="birthPlace">Tempat Lahir *</Label>
                                                <Input id="birthPlace" name="birthPlace" value={formData.birthPlace} onChange={handleInputChange} required />
                                            </div>
                                            <div>
                                                <Label htmlFor="birthDate">Tanggal Lahir *</Label>
                                                <Input id="birthDate" name="birthDate" type="date" value={formData.birthDate} onChange={handleInputChange} required />
                                            </div>
                                            <div>
                                                <Label htmlFor="occupation">Pekerjaan *</Label>
                                                <Input id="occupation" name="occupation" value={formData.occupation} onChange={handleInputChange} required />
                                            </div>
                                        </div>

                                        {/* Kontak & Alamat */}
                                        <h3 className="text-xl font-semibold border-b pb-2 flex items-center gap-2"><Phone className="w-5 h-5 text-red-600"/> Kontak & Alamat</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <Label htmlFor="phone">No. Handphone *</Label>
                                                <Input id="phone" name="phone" value={formData.phone} onChange={handleInputChange} required />
                                            </div>
                                            <div>
                                                <Label htmlFor="color">Warna Motor yang Dipilih *</Label>
                                                <Input id="color" name="color" value={formData.color} onChange={handleInputChange} required />
                                            </div>
                                            <div className="md:col-span-2">
                                                <Label htmlFor="address">Alamat Tinggal Sesuai KTP *</Label>
                                                <Textarea id="address" name="address" value={formData.address} onChange={handleInputChange} required />
                                            </div>
                                            <div className="md:col-span-2">
                                                <Label htmlFor="surveyAddress">Alamat Survey/Pengiriman *</Label>
                                                <Textarea id="surveyAddress" name="surveyAddress" value={formData.surveyAddress} onChange={handleInputChange} required />
                                            </div>
                                        </div>

                                        {/* Simulasi Kredit - Hanya untuk Kredit */}
                                        {paymentMethod === 'credit' && (
                                            <>
                                                <h3 className="text-xl font-semibold border-b pb-2 flex items-center gap-2 mt-8"><CreditCard className="w-5 h-5 text-red-600"/> Simulasi Kredit</h3>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                                        <Label htmlFor="downPayment">Uang Muka (DP) %</Label>
                                                        <Select onValueChange={(v) => handleSelectChange('downPayment', v)} value={formData.downPayment}>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Pilih % DP" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="10">10%</SelectItem>
                                                                <SelectItem value="20">20%</SelectItem>
                                                                <SelectItem value="30">30%</SelectItem>
                                                                <SelectItem value="40">40%</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    <div>
                                                        <Label htmlFor="installmentPeriod">Tenor Cicilan (Bulan)</Label>
                                                        <Select onValueChange={(v) => handleSelectChange('installmentPeriod', v)} value={formData.installmentPeriod}>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Pilih Tenor" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="12">12 Bulan</SelectItem>
                                                                <SelectItem value="24">24 Bulan</SelectItem>
                                                                <SelectItem value="36">36 Bulan</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                </div>

                                                {/* Data Pasangan/Avalis - Hanya untuk Kredit */}
                                                <h3 className="text-xl font-semibold border-b pb-2 flex items-center gap-2 mt-8"><Shield className="w-5 h-5 text-red-600"/> Data Pasangan/Avalis *</h3>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                                        <Label htmlFor="spouseName">Nama Pasangan/Avalis *</Label>
                                                        <Input id="spouseName" name="spouseName" value={formData.spouseName} onChange={handleInputChange} required />
                                                    </div>
                                                    <div>
                                                        <Label htmlFor="spouseNik">NIK Pasangan/Avalis *</Label>
                                                        <Input id="spouseNik" name="spouseNik" value={formData.spouseNik} onChange={handleInputChange} placeholder="16 digit NIK" maxLength={16} required />
                                                    </div>
                                                    <div>
                                                        <Label htmlFor="spousePhone">No. Handphone Pasangan *</Label>
                                                        <Input id="spousePhone" name="spousePhone" value={formData.spousePhone} onChange={handleInputChange} required />
                                                    </div>
                                                    <div className="md:col-span-2">
                                                        <Label htmlFor="spouseAddress">Alamat Pasangan *</Label>
                                                        <Textarea id="spouseAddress" name="spouseAddress" value={formData.spouseAddress} onChange={handleInputChange} required />
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                        
                                        <Button 
                                            type="submit" 
                                            className="w-full bg-red-600 hover:bg-red-700"
                                            disabled={isSubmitting || isValidatingNIK || (formData.nikKTP.length === 16 && !nikValidation.valid)}
                                        >
                                            {isSubmitting ? (
                                                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sedang Memproses...</>
                                            ) : (
                                                `Lanjut ke Pembayaran ${paymentMethod === 'credit' ? 'DP' : 'Cash'}`
                                            )}
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        ) : paymentStep === 'payment' ? (
                            // Payment Step (Langkah 2)
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <ArrowLeft className="w-5 h-5 cursor-pointer" onClick={() => setPaymentStep('form')} />
                                        Langkah 2: Pembayaran {paymentMethod === 'credit' ? 'Down Payment' : 'Cash'}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <PaymentMethods />
                                    <Button 
                                        onClick={handlePaymentSubmit} 
                                        className="w-full bg-red-600 hover:bg-red-700 mt-6"
                                        disabled={isSubmitting || !selectedPaymentMethod}
                                    >
                                        {isSubmitting ? (
                                            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Memproses Pembayaran...</>
                                        ) : (
                                            'Konfirmasi Pembayaran'
                                        )}
                                    </Button>
                                </CardContent>
                            </Card>
                        ) : (
                            // Upload Bukti Pembayaran (Langkah 3)
                            <UploadPaymentProof />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
