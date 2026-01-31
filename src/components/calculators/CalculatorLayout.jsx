import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';

// Navigation Component for public calculator pages
// Inline components replaced with imports

/**
 * Calculator Layout wrapper
 * @param {Object} props
 * @param {React.ReactNode} props.children - Calculator content
 * @param {boolean} props.isDashboard - If true, hides public navbar/footer (for dashboard context)
 * @param {string} props.backPath - Custom back path (defaults to /calculators)
 */
export default function CalculatorLayout({ children, isDashboard = false, backPath = '/calculators' }) {
    const navigate = useNavigate();

    // In dashboard context, just render children with minimal wrapper
    if (isDashboard) {
        return (
            <div className="py-6 px-4">
                <div className="max-w-7xl mx-auto">
                    <Button
                        variant="ghost"
                        onClick={() => navigate(backPath)}
                        className="mb-4"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Calculators
                    </Button>
                    {children}
                </div>
            </div>
        );
    }

    // Public context - full layout with Navbar and Footer
    return (
        <div className="min-h-screen bg-gradient-to-br from-background to-background/80 flex flex-col font-sans text-foreground selection:bg-primary/20">
            <Navbar />

            <main className="flex-1 py-8 px-4">
                <div className="max-w-7xl mx-auto">
                    <Button
                        variant="ghost"
                        onClick={() => navigate(backPath)}
                        className="mb-4"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Calculators
                    </Button>

                    {children}
                </div>
            </main>

            <Footer />
        </div>
    );
}

// Export individual components for reuse
export { Navbar, Footer };
