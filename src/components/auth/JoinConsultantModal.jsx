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
    DialogTrigger,
} from '@/components/ui/dialog';
import { CheckCircle2, Building2, TrendingUp } from 'lucide-react';

export function JoinConsultantModal({ trigger }) {
    const [open, setOpen] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Simulate API call
        setTimeout(() => {
            setSubmitted(true);
        }, 1000);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button variant="default">Join as Consultant</Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[900px] p-0 overflow-hidden gap-0">
                <div className="grid md:grid-cols-2 h-full">
                    {/* Left Side: Benefits */}
                    <div className="bg-secondary/5 p-8 hidden md:flex flex-col justify-between border-r">
                        <div>
                            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                                <TrendingUp className="w-6 h-6 text-primary" />
                            </div>
                            <h3 className="text-2xl font-bold mb-2">Grow Your Practice</h3>
                            <p className="text-muted-foreground mb-8">
                                Join India's fastest growing financial expert network.
                            </p>

                            <ul className="space-y-4">
                                <li className="flex items-start gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                    <div>
                                        <h4 className="font-semibold">verified Leads</h4>
                                        <p className="text-sm text-muted-foreground">Get high-ticket clients directly.</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                    <div>
                                        <h4 className="font-semibold">Digital Office</h4>
                                        <p className="text-sm text-muted-foreground">Manage files, clients & dues efficiently.</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                    <div>
                                        <h4 className="font-semibold">Automated Reports</h4>
                                        <p className="text-sm text-muted-foreground">Genearate CMA & Project reports in clicks.</p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div className="mt-8 pt-6 border-t">
                            <p className="text-xs text-muted-foreground">
                                "TaxPlan Advisor helped me scale from 50 to 500 clients in a year."
                                <br />
                                <span className="font-semibold text-foreground">- CA Rajesh Kumar</span>
                            </p>
                        </div>
                    </div>

                    {/* Right Side: Form */}
                    <div className="p-8">
                        <DialogHeader className="mb-6">
                            <DialogTitle className="text-2xl">Partner Registration</DialogTitle>
                            <DialogDescription>
                                Fill in your details to join our expert network.
                            </DialogDescription>
                        </DialogHeader>

                        {submitted ? (
                            <div className="flex flex-col items-center justify-center h-[300px] text-center space-y-4">
                                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-2">
                                    <CheckCircle2 className="w-8 h-8" />
                                </div>
                                <h3 className="text-xl font-bold">Application Received!</h3>
                                <p className="text-muted-foreground">
                                    Our onboarding team will contact you within 24 hours for verification.
                                </p>
                                <Button onClick={() => setOpen(false)} variant="outline">Close</Button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="firstName">First Name</Label>
                                        <Input id="firstName" placeholder="John" required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="lastName">Last Name</Label>
                                        <Input id="lastName" placeholder="Doe" required />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <Input id="email" type="email" placeholder="john@example.com" required />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone Number</Label>
                                    <Input id="phone" type="tel" placeholder="+91 98765 43210" required />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="qualification">Professional Qualification</Label>
                                    <select
                                        id="qualification"
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        required
                                    >
                                        <option value="">Select Qualification</option>
                                        <option value="CA">Chartered Accountant (CA)</option>
                                        <option value="CS">Company Secretary (CS)</option>
                                        <option value="CMA">Cost Accountant (CMA)</option>
                                        <option value="TaxAdvocate">Tax Advocate</option>
                                        <option value="Other">Other Financial Expert</option>
                                    </select>
                                </div>

                                <Button type="submit" className="w-full mt-4" size="lg">
                                    Submit Application
                                </Button>

                                <p className="text-xs text-center text-muted-foreground mt-4">
                                    By joining, you agree to our Terms of Service and Partner Policy.
                                </p>
                            </form>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
