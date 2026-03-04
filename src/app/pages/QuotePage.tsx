import { useState, useEffect } from 'react';
import { Trash2, ShoppingBag, ArrowRight, Lock } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser, useAuth, SignInButton } from '@clerk/clerk-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { motion } from 'motion/react';
import { useQuote } from '../context/QuoteContext';

export function QuotePage() {
  const { isSignedIn, user, isLoaded } = useUser();
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { items, removeFromQuote, clearQuote } = useQuote();
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  const [formData, setFormData] = useState(() => ({
    name: user?.fullName || '',
    companyName: '',
    email: user?.primaryEmailAddress?.emailAddress || '',
    phone: '',
    billingAddress: '',
    shippingAddress: '',
    additionalNotes: ''
  }));

  const [sameAsBilling, setSameAsBilling] = useState(false);

  // Sync with user data when it loads
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.fullName || '',
        email: user.primaryEmailAddress?.emailAddress || ''
      }));
    }
  }, [user]);

  const orderTotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Optional: Get token if signed in, but don't block
      const token = isSignedIn ? await getToken() : null;

      const submissionData = {
        fullName: formData.name,
        companyName: formData.companyName,
        email: formData.email,
        phone: formData.phone,
        billingAddress: formData.billingAddress,
        shippingAddress: sameAsBilling ? formData.billingAddress : formData.shippingAddress,
        additionalNotes: formData.additionalNotes,
        items: items.map(item => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity
        }))
      };

      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const response = await fetch(`${apiBaseUrl}/api/quotes`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(submissionData),
      });

      if (response.ok) {
        const data = await response.json();
        clearQuote();
        navigate('/payment', { state: { total: orderTotal, quoteId: data.id } });
      } else {
        const err = await response.json();
        if (response.status === 429) {
          alert(err.error || "Submission limit reached. Please wait an hour before trying again.");
        } else {
          alert(`Error: ${err.error || 'Failed to submit quote'}`);
        }
      }
    } catch (error) {
      console.error('Quote submission error:', error);
      alert('Could not connect to the server. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    let sanitizedValue = value;
    if (field === 'phone') {
      // Strip non-digits and limit to 10
      sanitizedValue = value.replace(/\D/g, '').slice(0, 10);
    }
    setFormData((prev) => ({ ...prev, [field]: sanitizedValue }));
  };

  // --- EMPTY STATE ---
  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex items-center justify-center bg-[#f0fdf4]">
        <div className="text-center">
          <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="text-muted-foreground" size={48} />
          </div>
          <h1 className="text-3xl mb-4">Your Cart is Empty</h1>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            It looks like you haven't added any products to your cart yet. Browse our collections to find the perfect wellness products.
          </p>
          <Link to="/products">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-white">
              Explore Products <ArrowRight className="ml-2" size={18} />
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // --- POPULATED CART STATE ---
  return (
    <div className="min-h-screen pt-32 pb-20 bg-[#f0fdf4]">
      <div className="container mx-auto px-4">
        <div className="mb-10 text-center">
          <h1 className="text-4xl mb-3">Checkout</h1>
          <p className="text-muted-foreground">Review your cart items and provide your delivery details</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* LEFT COL: Items List */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-semibold">Shopping Cart ({items.length})</h2>
              <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50" onClick={clearQuote}>
                Clear Cart
              </Button>
            </div>

            <div className="space-y-4">
              {items.map((item) => (
                <Card key={item.id} className="overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex flex-col sm:flex-row">
                    <div className="sm:w-32 h-32 bg-gray-100 overflow-hidden">
                      <img
                        src={item.image?.startsWith('/uploads') ? `${apiBaseUrl}${item.image}` : item.image || 'https://placehold.co/600x400?text=No+Image'}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <h3 className="font-medium text-lg leading-tight mb-1 line-clamp-1">{item.name}</h3>
                          {item.selectedVariant && (
                            <p className="text-xs font-bold text-primary uppercase mb-1">Size: {item.selectedVariant.size}</p>
                          )}
                          <p className="text-accent font-bold">₹{item.price}</p>
                        </div>
                        <button
                          onClick={() => removeFromQuote(item.selectedVariant ? `${item.id}-${item.selectedVariant.id}` : item.id)}
                          className="text-muted-foreground hover:text-red-500 transition-colors bg-red-50 p-2 rounded-full"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <div className="flex items-center justify-between mt-4 border-t pt-3">
                        <div className="text-sm">
                          Quantity: <span className="font-semibold bg-primary/10 px-2 py-1 rounded">{item.quantity}</span>
                        </div>
                        <div className="text-sm font-semibold">
                          Subtotal: <span className="text-primary">₹{item.price * item.quantity}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-6">
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Order Total</span>
                  <span className="text-2xl text-accent">₹{orderTotal}</span>
                </div>
                {orderTotal < 1000 && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-600 text-sm animate-in fade-in slide-in-from-top-1">
                    <span className="font-bold">Minimum Order Required:</span> ₹1000. Add more items to proceed.
                  </div>
                )}
                <p className="text-sm text-muted-foreground mt-2">Shipping and taxes calculated at checkout if applicable.</p>
              </CardContent>
            </Card>
          </motion.div>

          {/* RIGHT COL: Contact Form or Auth CTA */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {renderFormColumn({
              isLoaded,
              isSignedIn,
              user,
              formData,
              isSubmitting,
              handleSubmit,
              handleChange,
              sameAsBilling,
              setSameAsBilling,
              orderTotal
            })}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

interface FormColumnProps {
  isLoaded: boolean;
  isSignedIn: boolean;
  user: any;
  formData: any;
  isSubmitting: boolean;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  handleChange: (field: string, value: string) => void;
  sameAsBilling: boolean;
  setSameAsBilling: (val: boolean) => void;
  orderTotal: number;
}

function renderFormColumn({
  isLoaded,
  isSignedIn,
  user,
  formData,
  isSubmitting,
  handleSubmit,
  handleChange,
  sameAsBilling,
  setSameAsBilling,
  orderTotal
}: FormColumnProps) {
  if (!isLoaded) {
    return (
      <Card className="p-8 text-center bg-primary/5 border-primary/20">
        <div className="flex justify-center mb-4">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div>
        </div>
        <p className="text-muted-foreground">Verifying session...</p>
      </Card>
    );
  }

  if (!isSignedIn) {
    return (
      <Card className="border-primary/30 bg-white/40 backdrop-blur-sm overflow-hidden">
        <CardHeader className="text-center pt-10 pb-6">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-primary/20">
            <Lock className="text-primary" size={32} />
          </div>
          <CardTitle className="text-2xl text-primary">Sign In Required</CardTitle>
          <CardDescription className="text-base mt-2">
            To maintain order history and secure your checkout, please sign in to your Sakshi Enterprise account.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-10 pb-10 flex flex-col items-center">
          <SignInButton mode="modal">
            <Button size="lg" className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-6 text-lg">
              Sign In to Sakshi Enterprise
            </Button>
          </SignInButton>
          <p className="mt-6 text-sm text-muted-foreground">
            It only takes a moment and ensures your request is tracked properly.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="sticky top-24 border-primary/20">
      <CardHeader>
        <CardTitle className="text-primary">Contact Details</CardTitle>
        <CardDescription>
          Where should we send the order confirmation, {user?.firstName}?
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              placeholder="John Doe"
              required
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="companyName">Company Name *</Label>
            <Input
              id="companyName"
              placeholder="ABC Corporation"
              required
              value={formData.companyName}
              onChange={(e) => handleChange('companyName', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@work.com"
                required
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone *</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="Ex: 9326347507"
                required
                maxLength={10}
                pattern="[0-9]{10}"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
              />
              <p className="text-[10px] text-muted-foreground">Please enter exactly 10 digits without spaces.</p>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Address Information</h3>

            <div className="space-y-2">
              <Label htmlFor="billingAddress">Bill To (Billing Address) *</Label>
              <Textarea
                id="billingAddress"
                placeholder="Full billing address with Pincode"
                required
                value={formData.billingAddress}
                onChange={(e) => handleChange('billingAddress', e.target.value)}
                rows={3}
              />
            </div>

            <div className="flex items-center space-x-2 py-1">
              <input
                type="checkbox"
                id="sameAsBilling"
                checked={sameAsBilling}
                onChange={(e) => setSameAsBilling(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
              />
              <Label htmlFor="sameAsBilling" className="text-sm cursor-pointer select-none">
                Ship to the same address
              </Label>
            </div>

            {!sameAsBilling && (
              <div className="space-y-2 transition-all">
                <Label htmlFor="shippingAddress">Ship To (Delivery Address) *</Label>
                <Textarea
                  id="shippingAddress"
                  placeholder="Full delivery address with Pincode"
                  required={!sameAsBilling}
                  value={formData.shippingAddress}
                  onChange={(e) => handleChange('shippingAddress', e.target.value)}
                  rows={3}
                />
              </div>
            )}
          </div>

          <div className="space-y-2 pt-2">
            <Label htmlFor="notes">Additional Requirements</Label>
            <Textarea
              id="notes"
              placeholder="Specific delivery dates, packaging requirements, custom branding details..."
              rows={4}
              value={formData.additionalNotes}
              onChange={(e) => handleChange('additionalNotes', e.target.value)}
            />
          </div>

          <Button
            type="submit"
            size="lg"
            disabled={isSubmitting || orderTotal < 1000}
            className={`w-full ${orderTotal < 1000 ? 'bg-gray-300' : 'bg-accent hover:bg-accent/90 text-accent-foreground'}`}
          >
            {isSubmitting ? 'Processing Order...' : orderTotal < 1000 ? `₹${1000 - orderTotal} More Needed` : 'Submit Order'}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            We will get back to you within 24 hours.
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
