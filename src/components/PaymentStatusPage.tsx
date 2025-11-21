import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Loader2, AlertTriangle, CheckCircle, Clock, Copy, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

const API_BASE = "http://localhost/backend/api";

interface PaymentInfo {
    external_id: string;
    payment_method: string;
    amount: number;
    status: string; // PENDING, PAID, EXPIRED, dll.
    detail: string; // JSON string dari detail Xendit
}

interface StatusData {
    success: boolean;
    order_status: string; // Status dari Order Model (pending, confirmed, cancelled)
    is_paid: boolean;
    payment_info: PaymentInfo | null;
    order_detail: {
        motorcycle_name: string;
        customer_name: string;
        amount: number;
    };
    message?: string;
}

export function PaymentStatusPage() {
    const [searchParams] = useSearchParams();
    const orderId = searchParams.get('order_id');
    const navigate = useNavigate();

    const [statusData, setStatusData] = useState<StatusData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [detailPayment, setDetailPayment] = useState<any>(null); // Detail VA, QR, etc.

    const formatPrice = (price: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(price);

    // Fetch Payment Status
    const fetchStatus = async () => {
        if (!orderId) {
            toast.error("Order ID tidak ditemukan.");
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        try {
            const res = await fetch(`${API_BASE}/payment_gateway.php?order_id=${orderId}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });
            const data: StatusData = await res.json();

            if (data.success) {
                setStatusData(data);
                if (data.payment_info && data.payment_info.detail) {
                    setDetailPayment(JSON.parse(data.payment_info.detail));
                }
                
                // Stop polling jika sudah terbayar
                if (data.is_paid) {
                    toast.success("Pembayaran telah dikonfirmasi!");
                }
            } else {
                toast.error(data.message || 'Gagal mengambil status pembayaran.');
            }
        } catch (error) {
            console.error('Fetch error:', error);
            toast.error('Terjadi kesalahan koneksi saat cek status.');
        } finally {
            setIsLoading(false);
        }
    };

    // Auto-fetch status every 5 seconds if still pending
    useEffect(() => {
        fetchStatus(); // Fetch saat pertama kali buka

        // Polling setiap 5 detik jika status masih pending
        const interval = setInterval(() => {
            if (statusData && !statusData.is_paid && statusData.order_status === 'pending') {
                fetchStatus();
            }
        }, 5000);

        // Cleanup interval
        return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [orderId, statusData?.is_paid]); 


    if (!orderId) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Card className="max-w-md w-full p-6 text-center">
                    <AlertTriangle className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold">Order ID Hilang</h2>
                    <p className="text-gray-600 mt-2">Mohon kembali ke halaman profil untuk melihat daftar pesanan Anda.</p>
                    <Button onClick={() => navigate('/profile')} className="mt-4">
                        <ArrowLeft className="w-4 h-4 mr-2"/> Ke Profil
                    </Button>
                </Card>
            </div>
        );
    }

    if (isLoading && !statusData) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-red-600" />
                    <p>Memuat dan mengecek status pembayaran...</p>
                </div>
            </div>
        );
    }

    const { order_status, is_paid, order_detail, payment_info } = statusData || {};

    const renderPaymentStatus = () => {
        if (!statusData || !order_detail) {
            return (
                <div className="text-center p-6">
                    <AlertTriangle className="w-12 h-12 text-red-600 mx-auto mb-4" />
                    <p className="text-xl font-semibold">Data Order Tidak Ditemukan</p>
                </div>
            );
        }
        
        // --- Status SUKSES ---
        if (is_paid || order_status === 'confirmed') {
            return (
                <div className="text-center p-6 bg-green-50 rounded-lg">
                    <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4 animate-bounce" />
                    <h2 className="text-3xl font-bold text-green-700 mb-2">PEMBAYARAN SUKSES!</h2>
                    <p className="text-lg text-gray-700">Order Anda <strong className="font-extrabold">{orderId}</strong> telah dikonfirmasi.</p>
                    <p className="mt-4 text-sm text-gray-600">Tim kami akan segera memproses pengiriman motor {order_detail.motorcycle_name}.</p>
                </div>
            );
        }

        // --- Status PENDING (Menunggu Pembayaran) ---
        if (order_status === 'pending' && payment_info) {
            const vaNumber = detailPayment?.account_number;
            const bankCode = detailPayment?.bank_code;
            const expiryDate = detailPayment?.expiration_date ? new Date(detailPayment.expiration_date).toLocaleString() : 'Tidak diketahui';
            const qrCodeUrl = detailPayment?.qr_code_url;
            const paymentCode = detailPayment?.payment_code;
            const checkoutUrl = detailPayment?.actions?.desktop_web_checkout_url || detailPayment?.checkout_url;
            
            return (
                <div className="space-y-6">
                    <div className="flex items-center gap-3 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                        <Clock className="w-8 h-8 text-yellow-600 flex-shrink-0" />
                        <div>
                            <h2 className="text-xl font-bold text-yellow-800">Menunggu Pembayaran</h2>
                            <p className="text-gray-700">Segera selesaikan pembayaran sebelum batas waktu berakhir.</p>
                        </div>
                    </div>

                    <Card className="shadow-lg">
                        <CardHeader>
                            <CardTitle className="text-2xl text-red-600">
                                {formatPrice(order_detail.amount)}
                            </CardTitle>
                            <p className="text-sm text-gray-500">Jumlah yang harus dibayar</p>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="font-semibold text-lg">Metode: {payment_info.payment_method.toUpperCase().replace('_', ' ')}</p>

                            {/* Instruksi VA */}
                            {vaNumber && bankCode && (
                                <div className="p-3 bg-gray-100 rounded border flex justify-between items-center">
                                    <div>
                                        <p className="text-sm text-gray-600">Nomor Virtual Account ({bankCode})</p>
                                        <p className="text-2xl font-bold text-red-600">{vaNumber}</p>
                                    </div>
                                    <Button size="icon" variant="outline" onClick={() => { navigator.clipboard.writeText(vaNumber); toast.info('Nomor VA disalin!'); }}>
                                        <Copy className="w-4 h-4" />
                                    </Button>
                                </div>
                            )}

                            {/* Instruksi Retail/Kode Bayar */}
                            {paymentCode && (
                                <div className="p-3 bg-gray-100 rounded border flex justify-between items-center">
                                    <div>
                                        <p className="text-sm text-gray-600">Kode Pembayaran ({detailPayment.retail_outlet_name || 'Retail Outlet'})</p>
                                        <p className="text-2xl font-bold text-red-600">{paymentCode}</p>
                                    </div>
                                    <Button size="icon" variant="outline" onClick={() => { navigator.clipboard.writeText(paymentCode); toast.info('Kode pembayaran disalin!'); }}>
                                        <Copy className="w-4 h-4" />
                                    </Button>
                                </div>
                            )}

                            {/* QR Code / E-Wallet Link */}
                            {(qrCodeUrl || checkoutUrl) && (
                                <div className="p-3 bg-gray-100 rounded border text-center">
                                    <p className="text-sm text-gray-600 mb-2">Scan atau Klik Link di Bawah</p>
                                    {qrCodeUrl && (
                                        <img src={qrCodeUrl} alt="QR Code" className="w-32 h-32 mx-auto border p-1 mb-2" />
                                    )}
                                    {checkoutUrl && (
                                        <Button 
                                            variant="secondary" 
                                            onClick={() => window.open(checkoutUrl, '_blank')}
                                            className="w-full"
                                        >
                                            Lanjutkan ke Pembayaran E-Wallet
                                        </Button>
                                    )}
                                </div>
                            )}
                            
                            <p className="text-sm text-red-700 font-medium mt-4">Batas Waktu: {expiryDate}</p>
                            
                            <div className="mt-6">
                                <Button onClick={fetchStatus} disabled={isLoading} variant="outline" className="w-full">
                                    {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin"/> : 'Refresh Status'}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            );
        }

        // --- Status GAGAL/EXPIRED/CANCELLED ---
        if (order_status === 'cancelled' || payment_info?.status === 'EXPIRED') {
            return (
                <div className="text-center p-6 bg-red-50 rounded-lg">
                    <AlertTriangle className="w-16 h-16 text-red-600 mx-auto mb-4" />
                    <h2 className="text-3xl font-bold text-red-700 mb-2">PEMBAYARAN GAGAL/BATAL</h2>
                    <p className="text-lg text-gray-700">Pesanan Anda <strong className="font-extrabold">{orderId}</strong> telah dibatalkan atau waktu pembayaran telah kedaluwarsa.</p>
                    <p className="mt-4 text-sm text-gray-600">Anda dapat membuat pesanan baru.</p>
                </div>
            );
        }
        
        // --- Status Lain (ex: Order Cash) ---
        return (
             <div className="text-center p-6 bg-blue-50 rounded-lg">
                <CheckCircle className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-blue-700 mb-2">ORDER DITERIMA</h2>
                <p className="text-lg text-gray-700">Status Order: <strong className="font-extrabold">{order_status.toUpperCase()}</strong></p>
                <p className="mt-4 text-sm text-gray-600">Detail order ini akan segera diproses oleh tim Sales.</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-xl mx-auto">
                <Card>
                    <CardHeader>
                        <Button variant="ghost" onClick={() => navigate('/profile')} className="w-fit mb-4 p-0">
                            <ArrowLeft className="w-4 h-4 mr-2"/> Kembali ke Daftar Pesanan
                        </Button>
                        <CardTitle className="text-center text-3xl">Status Pembelian</CardTitle>
                        <p className="text-center text-gray-600">Order ID: <strong className="text-red-600">{orderId}</strong></p>
                    </CardHeader>
                    <CardContent>
                        {renderPaymentStatus()}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}