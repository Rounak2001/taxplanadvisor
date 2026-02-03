import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, X } from 'lucide-react';
import { useCartStore } from '@/stores/useCartStore';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function FloatingCartButton({ onClick }) {
    const itemCount = useCartStore((state) => state.getItemCount());
    const totalPrice = useCartStore((state) => state.getTotalPrice());

    if (itemCount === 0) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="fixed bottom-6 right-6 z-50"
            >
                <Button
                    onClick={onClick}
                    size="lg"
                    className="h-14 px-6 rounded-full shadow-lg hover:shadow-xl transition-shadow gap-3 group"
                >
                    <div className="relative">
                        <ShoppingCart className="h-5 w-5" />
                        <Badge
                            variant="destructive"
                            className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
                        >
                            {itemCount}
                        </Badge>
                    </div>
                    <div className="flex flex-col items-start">
                        <span className="text-xs opacity-80">Cart</span>
                        <span className="font-semibold">
                            ₹{totalPrice.toLocaleString('en-IN')}
                        </span>
                    </div>
                </Button>
            </motion.div>
        </AnimatePresence>
    );
}
