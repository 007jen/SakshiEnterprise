import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Seo } from '../components/SEO';
import { motion } from 'motion/react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { CheckCircle, Building2, QrCode, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import QrCodeImage from '../../assets/QR Code.png';

export function PaymentPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const [orderTotal, setOrderTotal] = useState<number>(0);
    const [paymentConfirmed, setPaymentConfirmed] = useState(false);

    useEffect(() => {
        // Read the total passed from QuotePage via router state
        if (location.state && typeof location.state.total === 'number') {
            setOrderTotal(location.state.total);
        } else {
            // Redirect back to home if accessed directly without state
            navigate('/home', { replace: true });
        }
    }, [location.state, navigate]);

    const handleConfirmPayment = () => {
        setPaymentConfirmed(true);
        toast.success("Payment Confirmation Recorded. Thank you!");
    };

    if (paymentConfirmed) {
        return (
            <div className="min-h-screen pt-32 pb-20 bg-[#f0fdf4]">
                <Seo title="Payment Confirmed | Sakshi Enterprise" description="Thank you for your order and payment." />
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6 }}
                        className="max-w-2xl mx-auto"
                    >
                        <Card className="text-center shadow-lg border-primary/20 bg-white">
                            <CardContent className="pt-12 pb-12">
                                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <CheckCircle className="text-green-600" size={48} />
                                </div>
                                <h1 className="text-4xl mb-4 font-bold text-primary">Order & Payment Recorded!</h1>
                                <p className="text-lg text-muted-foreground mb-8">
                                    Thank you! We have received your order confirmation. Our team will verify the payment and begin processing your order immediately. You should receive an email confirmation shortly.
                                </p>
                                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white" onClick={() => navigate('/home')}>
                                    Return to Home
                                </Button>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-28 pb-20 bg-muted/30">
            <Seo title="Complete Payment | Sakshi Enterprise" description="Complete your secure payment via Bank Transfer or UPI." />

            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-4xl mx-auto"
                >
                    <div className="text-center mb-10">
                        <h1 className="text-3xl md:text-5xl font-bold text-primary mb-4">Complete Your Payment</h1>
                        <p className="text-lg text-muted-foreground">Order successfully placed. Please complete the payment to proceed with shipping.</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Summary & QR Code Section */}
                        <div className="space-y-6">
                            <Card className="border-primary/20 shadow-md">
                                <CardHeader className="bg-primary/5 pb-6">
                                    <CardTitle className="text-xl text-primary">Total Amount Due</CardTitle>
                                    <div className="text-4xl font-bold mt-2">
                                        ₹{orderTotal.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                                    </div>
                                    <CardDescription className="mt-2 text-sm">
                                        Please transfer exactly this amount using one of the methods below.
                                    </CardDescription>
                                </CardHeader>
                            </Card>

                            <Card className="border-primary/20 shadow-md">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-primary">
                                        <QrCode className="w-5 h-5" />
                                        Pay via UPI / QR Code
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="flex flex-col items-center justify-center pb-8 pt-4">
                                    <div className="w-56 h-56 flex flex-col items-center justify-center mb-4 overflow-hidden relative">
                                        <img src={QrCodeImage} alt="UPI QR Code" className="absolute inset-0 w-full h-full object-contain" />
                                    </div>
                                    <p className="text-sm text-center text-muted-foreground max-w-[250px]">
                                        Scan this code with any UPI app (GPay, PhonePe, Paytm)
                                    </p>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Bank Details Section */}
                        <div className="space-y-6">
                            <Card className="border-primary/20 shadow-md h-full flex flex-col">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-primary">
                                        <Building2 className="w-5 h-5" />
                                        RTGS / NEFT / IMPS Bank Transfer
                                    </CardTitle>
                                    <CardDescription>
                                        Use these details to transfer securely from your bank account.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6 flex-1">
                                    <div className="bg-muted p-4 rounded-lg space-y-4">
                                        <div>
                                            <p className="text-sm text-muted-foreground mb-1">Account Name</p>
                                            <p className="font-semibold text-lg">Sakshi Enterprise</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground mb-1">Account Number</p>
                                            <p className="font-mono text-lg font-bold tracking-wider">05691600000053</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground mb-1">IFSC Code</p>
                                            <p className="font-mono text-lg font-bold tracking-wider">PSIB0000569</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground mb-1">Bank Name & Branch</p>
                                            <p className="font-medium">PUNJAB & SIND BANK, BHANDUP WEST</p>
                                        </div>
                                    </div>

                                    <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg text-sm text-yellow-800">
                                        <p className="font-semibold mb-1">Important Instruction:</p>
                                        Please add your name or order details in the transaction remarks/notes so we can verify it quickly.
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Final Confirmation Button */}
                    <div className="mt-12 text-center bg-white p-8 rounded-xl shadow-sm border border-border">
                        <h3 className="text-xl font-semibold mb-2">Have you completed the transfer?</h3>
                        <p className="text-muted-foreground mb-6">Hit the button below once the money has been successfully deducted from your account.</p>
                        <Button
                            size="lg"
                            className="bg-green-600 hover:bg-green-700 text-white px-8 h-14 text-lg w-full sm:w-auto"
                            onClick={handleConfirmPayment}
                        >
                            I have completed the payment
                            <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                    </div>

                </motion.div>
            </div>
        </div>
    );
}