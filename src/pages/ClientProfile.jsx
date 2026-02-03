import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    User,
    Mail,
    Phone,
    MapPin,
    Building2,
    Calendar,
    Edit2,
    Save,
    X,
    Camera,
    Shield,
    Bell,
    Key,
    CheckCircle2,
    AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useAuthStore } from '@/stores/useAuthStore';
import { useToast } from '@/hooks/use-toast';

export default function ClientProfile() {
    const { user } = useAuthStore();
    const { toast } = useToast();
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        firstName: user?.first_name || '',
        lastName: user?.last_name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        address: user?.address || '',
        city: user?.city || '',
        state: user?.state || '',
        pincode: user?.pincode || '',
        company: user?.company || '',
        pan: user?.pan || '',
        gst: user?.gst || '',
    });

    const [notifications, setNotifications] = useState({
        emailUpdates: true,
        smsAlerts: true,
        taxReminders: true,
        marketplaceAlerts: false,
    });

    useEffect(() => {
        if (user) {
            setFormData({
                firstName: user.first_name || '',
                lastName: user.last_name || '',
                email: user.email || '',
                phone: user.phone || '',
                address: user.address || '',
                city: user.city || '',
                state: user.state || '',
                pincode: user.pincode || '',
                company: user.company || '',
                pan: user.pan || '',
                gst: user.gst || '',
            });
        }
    }, [user]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            // TODO: API call to save profile
            await new Promise(resolve => setTimeout(resolve, 1000));
            toast({
                title: "Profile Updated",
                description: "Your profile has been updated successfully.",
            });
            setIsEditing(false);
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update profile. Please try again.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const getInitials = () => {
        const first = formData.firstName?.[0] || user?.first_name?.[0] || '';
        const last = formData.lastName?.[0] || user?.last_name?.[0] || '';
        return (first + last).toUpperCase() || 'U';
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">My Profile</h1>
                    <p className="text-muted-foreground">Manage your account settings and preferences</p>
                </div>
            </div>

            {/* Profile Header Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                <Card className="overflow-hidden">
                    <div className="h-32 bg-gradient-to-r from-primary/20 via-primary/10 to-accent/20" />
                    <CardContent className="relative pb-6">
                        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 -mt-16">
                            <div className="relative">
                                <Avatar className="h-28 w-28 border-4 border-background shadow-lg">
                                    <AvatarImage src={user?.avatar} alt={formData.firstName} />
                                    <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                                        {getInitials()}
                                    </AvatarFallback>
                                </Avatar>
                                <Button
                                    size="icon"
                                    variant="secondary"
                                    className="absolute bottom-0 right-0 h-8 w-8 rounded-full shadow-md"
                                >
                                    <Camera className="h-4 w-4" />
                                </Button>
                            </div>
                            <div className="flex-1 pb-2">
                                <div className="flex items-center gap-2">
                                    <h2 className="text-xl font-bold">
                                        {formData.firstName || formData.lastName
                                            ? `${formData.firstName} ${formData.lastName}`.trim()
                                            : user?.email}
                                    </h2>
                                    {user?.is_phone_verified && (
                                        <Badge variant="secondary" className="gap-1">
                                            <CheckCircle2 className="h-3 w-3" />
                                            Verified
                                        </Badge>
                                    )}
                                </div>
                                <p className="text-muted-foreground text-sm">{formData.email}</p>
                                {formData.company && (
                                    <p className="text-muted-foreground text-sm flex items-center gap-1 mt-1">
                                        <Building2 className="h-3 w-3" />
                                        {formData.company}
                                    </p>
                                )}
                            </div>
                            <Button
                                variant={isEditing ? "outline" : "default"}
                                onClick={() => setIsEditing(!isEditing)}
                                className="gap-2"
                            >
                                {isEditing ? (
                                    <>
                                        <X className="h-4 w-4" />
                                        Cancel
                                    </>
                                ) : (
                                    <>
                                        <Edit2 className="h-4 w-4" />
                                        Edit Profile
                                    </>
                                )}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Tabs */}
            <Tabs defaultValue="personal" className="space-y-6">
                <TabsList className="bg-muted/50">
                    <TabsTrigger value="personal" className="gap-2">
                        <User className="h-4 w-4" />
                        Personal Info
                    </TabsTrigger>
                    <TabsTrigger value="business" className="gap-2">
                        <Building2 className="h-4 w-4" />
                        Business Details
                    </TabsTrigger>
                    <TabsTrigger value="security" className="gap-2">
                        <Shield className="h-4 w-4" />
                        Security
                    </TabsTrigger>
                    <TabsTrigger value="notifications" className="gap-2">
                        <Bell className="h-4 w-4" />
                        Notifications
                    </TabsTrigger>
                </TabsList>

                {/* Personal Info Tab */}
                <TabsContent value="personal">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <Card>
                            <CardHeader>
                                <CardTitle>Personal Information</CardTitle>
                                <CardDescription>Your personal contact details</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="firstName">First Name</Label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="firstName"
                                                name="firstName"
                                                value={formData.firstName}
                                                onChange={handleInputChange}
                                                disabled={!isEditing}
                                                className="pl-10"
                                                placeholder="Enter first name"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="lastName">Last Name</Label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="lastName"
                                                name="lastName"
                                                value={formData.lastName}
                                                onChange={handleInputChange}
                                                disabled={!isEditing}
                                                className="pl-10"
                                                placeholder="Enter last name"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email Address</Label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="email"
                                                name="email"
                                                type="email"
                                                value={formData.email}
                                                disabled
                                                className="pl-10 bg-muted/50"
                                            />
                                        </div>
                                        <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Phone Number</Label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="phone"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                disabled={!isEditing}
                                                className="pl-10"
                                                placeholder="+91 XXXXX XXXXX"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <Separator />

                                <div>
                                    <h3 className="font-medium mb-4">Address</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2 md:col-span-2">
                                            <Label htmlFor="address">Street Address</Label>
                                            <div className="relative">
                                                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    id="address"
                                                    name="address"
                                                    value={formData.address}
                                                    onChange={handleInputChange}
                                                    disabled={!isEditing}
                                                    className="pl-10"
                                                    placeholder="Enter your address"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="city">City</Label>
                                            <Input
                                                id="city"
                                                name="city"
                                                value={formData.city}
                                                onChange={handleInputChange}
                                                disabled={!isEditing}
                                                placeholder="Enter city"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="state">State</Label>
                                            <Input
                                                id="state"
                                                name="state"
                                                value={formData.state}
                                                onChange={handleInputChange}
                                                disabled={!isEditing}
                                                placeholder="Enter state"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="pincode">PIN Code</Label>
                                            <Input
                                                id="pincode"
                                                name="pincode"
                                                value={formData.pincode}
                                                onChange={handleInputChange}
                                                disabled={!isEditing}
                                                placeholder="Enter PIN code"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {isEditing && (
                                    <div className="flex justify-end gap-3 pt-4">
                                        <Button variant="outline" onClick={() => setIsEditing(false)}>
                                            Cancel
                                        </Button>
                                        <Button onClick={handleSave} disabled={loading} className="gap-2">
                                            <Save className="h-4 w-4" />
                                            {loading ? 'Saving...' : 'Save Changes'}
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>
                </TabsContent>

                {/* Business Details Tab */}
                <TabsContent value="business">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <Card>
                            <CardHeader>
                                <CardTitle>Business Information</CardTitle>
                                <CardDescription>Your business and tax-related details</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="company">Company / Business Name</Label>
                                        <div className="relative">
                                            <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="company"
                                                name="company"
                                                value={formData.company}
                                                onChange={handleInputChange}
                                                disabled={!isEditing}
                                                className="pl-10"
                                                placeholder="Enter company name"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="pan">PAN Number</Label>
                                        <Input
                                            id="pan"
                                            name="pan"
                                            value={formData.pan}
                                            onChange={handleInputChange}
                                            disabled={!isEditing}
                                            placeholder="AAAAA0000A"
                                            className="uppercase"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="gst">GSTIN</Label>
                                        <Input
                                            id="gst"
                                            name="gst"
                                            value={formData.gst}
                                            onChange={handleInputChange}
                                            disabled={!isEditing}
                                            placeholder="22AAAAA0000A1Z5"
                                            className="uppercase"
                                        />
                                    </div>
                                </div>

                                {isEditing && (
                                    <div className="flex justify-end gap-3 pt-4">
                                        <Button variant="outline" onClick={() => setIsEditing(false)}>
                                            Cancel
                                        </Button>
                                        <Button onClick={handleSave} disabled={loading} className="gap-2">
                                            <Save className="h-4 w-4" />
                                            {loading ? 'Saving...' : 'Save Changes'}
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>
                </TabsContent>

                {/* Security Tab */}
                <TabsContent value="security">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        <Card>
                            <CardHeader>
                                <CardTitle>Account Security</CardTitle>
                                <CardDescription>Manage your account security settings</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex items-center justify-between p-4 rounded-lg border">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                            <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                                        </div>
                                        <div>
                                            <p className="font-medium">Phone Verification</p>
                                            <p className="text-sm text-muted-foreground">
                                                {user?.is_phone_verified ? 'Your phone is verified' : 'Verify your phone number'}
                                            </p>
                                        </div>
                                    </div>
                                    <Badge variant={user?.is_phone_verified ? "default" : "secondary"}>
                                        {user?.is_phone_verified ? 'Verified' : 'Pending'}
                                    </Badge>
                                </div>

                                <div className="flex items-center justify-between p-4 rounded-lg border">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                            <Mail className="h-5 w-5 text-primary" />
                                        </div>
                                        <div>
                                            <p className="font-medium">Email Verification</p>
                                            <p className="text-sm text-muted-foreground">Your email is verified via Google</p>
                                        </div>
                                    </div>
                                    <Badge>Verified</Badge>
                                </div>

                                <div className="flex items-center justify-between p-4 rounded-lg border">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                                            <Key className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                                        </div>
                                        <div>
                                            <p className="font-medium">Two-Factor Authentication</p>
                                            <p className="text-sm text-muted-foreground">Add extra security to your account</p>
                                        </div>
                                    </div>
                                    <Button variant="outline" size="sm">Enable</Button>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-destructive/50">
                            <CardHeader>
                                <CardTitle className="text-destructive">Danger Zone</CardTitle>
                                <CardDescription>Irreversible account actions</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between p-4 rounded-lg border border-destructive/30 bg-destructive/5">
                                    <div className="flex items-center gap-4">
                                        <AlertCircle className="h-5 w-5 text-destructive" />
                                        <div>
                                            <p className="font-medium">Delete Account</p>
                                            <p className="text-sm text-muted-foreground">Permanently delete your account and all data</p>
                                        </div>
                                    </div>
                                    <Button variant="destructive" size="sm">Delete Account</Button>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </TabsContent>

                {/* Notifications Tab */}
                <TabsContent value="notifications">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <Card>
                            <CardHeader>
                                <CardTitle>Notification Preferences</CardTitle>
                                <CardDescription>Choose what notifications you want to receive</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex items-center justify-between py-3">
                                    <div>
                                        <p className="font-medium">Email Updates</p>
                                        <p className="text-sm text-muted-foreground">Receive updates about your filings via email</p>
                                    </div>
                                    <Switch
                                        checked={notifications.emailUpdates}
                                        onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, emailUpdates: checked }))}
                                    />
                                </div>
                                <Separator />
                                <div className="flex items-center justify-between py-3">
                                    <div>
                                        <p className="font-medium">SMS Alerts</p>
                                        <p className="text-sm text-muted-foreground">Get SMS notifications for important updates</p>
                                    </div>
                                    <Switch
                                        checked={notifications.smsAlerts}
                                        onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, smsAlerts: checked }))}
                                    />
                                </div>
                                <Separator />
                                <div className="flex items-center justify-between py-3">
                                    <div>
                                        <p className="font-medium">Tax Deadline Reminders</p>
                                        <p className="text-sm text-muted-foreground">Remind me about upcoming tax deadlines</p>
                                    </div>
                                    <Switch
                                        checked={notifications.taxReminders}
                                        onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, taxReminders: checked }))}
                                    />
                                </div>
                                <Separator />
                                <div className="flex items-center justify-between py-3">
                                    <div>
                                        <p className="font-medium">Marketplace Alerts</p>
                                        <p className="text-sm text-muted-foreground">Get notified about new consultants and offers</p>
                                    </div>
                                    <Switch
                                        checked={notifications.marketplaceAlerts}
                                        onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, marketplaceAlerts: checked }))}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
