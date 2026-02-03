import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X, MessageCircle, ChevronDown, User, LogIn, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LoginModal } from '@/components/auth/LoginModal';
import { GoogleLoginButton } from '../auth/GoogleLoginButton';
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
    DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Navbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80">
            <nav className="container mx-auto flex h-16 lg:h-20 items-center justify-between px-4 lg:px-8">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-3">
                    <img
                        src="/TAX plan Advisor.ico"
                        alt="TaxPlan Advisor"
                        className="h-10 w-10"
                    />
                    <div className="flex flex-col">
                        <span className="text-lg font-serif font-bold leading-tight tracking-tight">TaxPlan</span>
                        <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">Advisor</span>
                    </div>
                </Link>

                {/* Desktop Navigation - Centered */}
                <div className="hidden lg:flex items-center justify-center absolute left-1/2 transform -translate-x-1/2">
                    <NavigationMenu>
                        <NavigationMenuList>
                            <NavigationMenuItem>
                                <Link to="/">
                                    <div className={navigationMenuTriggerStyle()}>Home</div>
                                </Link>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <Link to="/calculators">
                                    <div className={navigationMenuTriggerStyle()}>Calculators</div>
                                </Link>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <Link to="/about">
                                    <div className={navigationMenuTriggerStyle()}>About Us</div>
                                </Link>
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </NavigationMenu>
                </div>

                {/* Desktop Actions */}
                <div className="hidden lg:flex items-center gap-2">
                    {/* Sign up as Client Button */}
                    <GoogleLoginButton text="Sign up as Client" size="sm" className="rounded-full" />

                    {/* Sign up as Consultant Button */}
                    <LoginModal
                        trigger={
                            <Button size="sm" className="rounded-full px-3 h-8 text-s shadow-md hover:shadow-lg transition-all duration-300">
                                Register as Consultant
                            </Button>
                        }
                    />

                    {/* Login Dropdown */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="rounded-full px-">
                                <LogIn className="w-4 h-4 mr-2" />
                                Login
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-64 p-2">
                            <DropdownMenuLabel className="font-normal text-xs text-muted-foreground uppercase tracking-wider ml-2">Login As</DropdownMenuLabel>

                            <div className="p-1 space-y-2">
                                <div className="space-y-1">
                                    <p className="text-sm font-medium ml-2">Client</p>
                                    <DropdownMenuItem className="p-0 focus:bg-transparent" onSelect={(e) => e.preventDefault()}>
                                        <GoogleLoginButton text="Login with Google" className="w-full" />
                                    </DropdownMenuItem>
                                </div>

                                <DropdownMenuSeparator />

                                <div className="space-y-1">
                                    <p className="text-sm font-medium ml-2">Consultant</p>
                                    <DropdownMenuItem className="p-0 focus:bg-transparent" onSelect={(e) => e.preventDefault()}>
                                        <LoginModal
                                            trigger={
                                                <Button variant="outline" className="w-full justify-start border-dashed border-2">
                                                    <Briefcase className="w-4 h-4 mr-2" />
                                                    Consultant Login
                                                </Button>
                                            }
                                        />
                                    </DropdownMenuItem>
                                </div>
                            </div>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {/* Mobile Menu Toggle */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="lg:hidden"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? <X /> : <Menu />}
                </Button>
            </nav>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="lg:hidden border-t bg-background shadow-xl"
                >
                    <div className="container py-6 space-y-6 px-6">
                        <div className="space-y-2">
                            <h4 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">Menu</h4>
                            <Link to="/" className="flex items-center p-2 rounded-lg hover:bg-muted transition-colors" onClick={() => setMobileMenuOpen(false)}>
                                <span className="font-medium">Home</span>
                            </Link>
                            <Link to="/calculators" className="flex items-center p-2 rounded-lg hover:bg-muted transition-colors" onClick={() => setMobileMenuOpen(false)}>
                                <span className="font-medium">Calculators</span>
                            </Link>
                            <Link to="/about" className="flex items-center p-2 rounded-lg hover:bg-muted transition-colors" onClick={() => setMobileMenuOpen(false)}>
                                <span className="font-medium">About Us</span>
                            </Link>

                        </div>

                        <div className="pt-6 border-t space-y-4">
                            <h4 className="text-sm font-medium text-muted-foreground mb-2 uppercase tracking-wider">Get Started</h4>
                            <GoogleLoginButton text="Sign in as Client" className="w-full" />
                            <LoginModal
                                trigger={
                                    <Button variant="outline" className="w-full justify-start">
                                        <Briefcase className="w-4 h-4 mr-2" />
                                        Login as Consultant
                                    </Button>
                                }
                            />
                        </div>
                    </div>
                </motion.div>
            )}
        </header>
    );
}
