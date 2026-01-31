import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Loader2, CheckCircle2 } from 'lucide-react';
import api from '@/api/axios';

export default function DemoBookingModal({ isOpen, onClose, title = "Book a Demo", queryType = "Demo Request" }) {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        company: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [status, setStatus] = useState(null); // 'success' | 'error' | null

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            // Mock API call or use real endpoint if available
            await new Promise(resolve => setTimeout(resolve, 1500));
            setStatus('success');
            setTimeout(() => {
                onClose();
                setStatus(null);
                setFormData({ name: "", email: "", phone: "", company: "" });
            }, 2000);
        } catch (error) {
            console.error("Booking failed:", error);
            setStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>
                        Schedule a personalized walkthrough of our platform.
                    </DialogDescription>
                </DialogHeader>

                {status === 'success' ? (
                    <div className="flex flex-col items-center justify-center p-6 text-center space-y-4">
                        <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                            <CheckCircle2 className="w-6 h-6" />
                        </div>
                        <h3 className="font-semibold text-lg">Booking Confirmed!</h3>
                        <p className="text-muted-foreground text-sm">We'll contact you shortly to confirm the time.</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4 mt-2">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Work Email</Label>
                            <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="company">Company Name</Label>
                            <Input id="company" name="company" value={formData.company} onChange={handleChange} />
                        </div>

                        <Button type="submit" className="w-full" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Booking...
                                </>
                            ) : (
                                "Confirm Booking"
                            )}
                        </Button>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
}
