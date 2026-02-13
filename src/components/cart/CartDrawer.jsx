import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X,
    ShoppingCart,
    Trash2,
    IndianRupee,
    Clock,
    Package,
    Loader2
} from 'lucide-react';
import { useCartStore } from '@/stores/useCartStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import api from '@/api/axios';

export default function CartDrawer({ isOpen, onClose }) {
    const items = useCartStore((state) => state.items);
    const removeItem = useCartStore((state) => state.removeItem);
    const clearCart = useCartStore((state) => state.clearCart);
    const totalPrice = useCartStore((state) => state.getTotalPrice());
    const itemCount = useCartStore((state) => state.getItemCount());
    const { user } = useAuthStore();
    const { toast } = useToast();
    const [isProcessing, setIsProcessing] = useState(false);

    const handlePayment = async () => {
        if (items.length === 0) return;

        setIsProcessing(true);
        try {
            // 1. Create Order in Backend
            const orderResponse = await api.post('/payments/create-order/', { items });
            const { razorpay_order_id, amount, key_id } = orderResponse.data;

            // 2. Open Razorpay Checkout
            // Same configuration as BookingWizard.jsx which is working fine
            const options = {
                key: key_id,
                amount: amount * 100, // in paise
                currency: "INR",
                name: "TaxPlan Advisor",
                description: "Purchase Professional Services",
                order_id: razorpay_order_id,
                handler: async function (response) {
                    try {
                        // 3. Verify Payment in Backend
                        await api.post('/payments/verify-payment/', {
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_signature: response.razorpay_signature
                        });

                        toast({
                            title: "Success",
                            description: "Payment successful! Your order has been placed.",
                        });
                        clearCart();
                        onClose();
                    } catch (error) {
                        toast({
                            title: "Payment Verification Failed",
                            description: error.response?.data?.error || "Something went wrong.",
                            variant: "destructive",
                        });
                    } finally {
                        setIsProcessing(false);
                    }
                },
                theme: {
                    color: "#10B981", // Aligning with secondary/meeting primary color
                },
                modal: {
                    ondismiss: function () {
                        setIsProcessing(false);
                    }
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (error) {
            console.error("Payment error:", error);
            toast({
                title: "Error",
                description: "Failed to initiate payment. Please try again.",
                variant: "destructive",
            });
            setIsProcessing(false);
        }
    };

    const handleClearCart = () => {
        if (window.confirm('Are you sure you want to clear the cart?')) {
            clearCart();
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/50 z-50 px-4"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                        className="fixed right-0 top-0 h-full w-full sm:w-[480px] bg-background shadow-2xl z-50 flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-6 border-b">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <ShoppingCart className="h-6 w-6 text-primary" />
                                    <div>
                                        <h2 className="text-2xl font-bold">Your Cart</h2>
                                        <p className="text-sm text-muted-foreground">
                                            {itemCount} {itemCount === 1 ? 'item' : 'items'}
                                        </p>
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={onClose}
                                >
                                    <X className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>

                        {/* Cart Items */}
                        <ScrollArea className="flex-1 p-6">
                            {items.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-center py-12">
                                    <Package className="h-16 w-16 text-muted-foreground mb-4" />
                                    <h3 className="text-lg font-semibold mb-2">Your cart is empty</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Add services to get started
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {items.map((item) => (
                                        <Card key={item.id} className="overflow-hidden">
                                            <CardHeader className="pb-3">
                                                <div className="flex items-start justify-between gap-2">
                                                    <div className="flex-1">
                                                        <CardTitle className="text-base leading-tight">
                                                            {item.title}
                                                        </CardTitle>
                                                        {item.variantName && (
                                                            <p className="text-sm text-muted-foreground mt-1">
                                                                {item.variantName}
                                                            </p>
                                                        )}
                                                        <div className="flex flex-wrap gap-2 mt-2">
                                                            <Badge variant="secondary" className="text-xs">
                                                                {item.category}
                                                            </Badge>
                                                            {item.tat && (
                                                                <Badge variant="outline" className="gap-1 text-xs">
                                                                    <Clock className="h-3 w-3" />
                                                                    {item.tat}
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-destructive hover:text-destructive"
                                                        onClick={() => removeItem(item.id)}
                                                        disabled={isProcessing}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </CardHeader>
                                            <Separator />
                                            <CardContent className="pt-3">
                                                <div className="flex items-center justify-between">
                                                    <div className="text-right flex-1">
                                                        <p className="text-sm text-muted-foreground">
                                                            {typeof item.price === 'number'
                                                                ? `₹${item.price.toLocaleString('en-IN')}`
                                                                : item.price
                                                            }
                                                        </p>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </ScrollArea>

                        {/* Footer */}
                        {items.length > 0 && (
                            <div className="p-6 border-t bg-muted/30">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between text-lg">
                                        <span className="font-semibold">Subtotal</span>
                                        <span className="font-bold text-primary">
                                            ₹{totalPrice.toLocaleString('en-IN')}
                                        </span>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            className="flex-1"
                                            onClick={handleClearCart}
                                            disabled={isProcessing}
                                        >
                                            Clear Cart
                                        </Button>
                                        <Button
                                            className="flex-1 gap-2"
                                            onClick={handlePayment}
                                            disabled={isProcessing}
                                        >
                                            {isProcessing ? (
                                                <><Loader2 className="h-4 w-4 animate-spin" /> Processing...</>
                                            ) : (
                                                <><IndianRupee className="h-4 w-4" /> Pay Now</>
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
