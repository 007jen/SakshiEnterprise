import { useState, useEffect } from 'react';
import { CheckCircle, Trash2, ShoppingBag, ArrowRight, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
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
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { items, removeFromQuote, clearQuote } = useQuote();
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  const [formData, setFormData] = useState(() => ({
    name: user?.fullName || '',
    companyName: '',
    email: user?.primaryEmailAddress?.emailAddress || '',
    phone: '',
    additionalNotes: ''
  }));

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
        setSubmitted(true);
        clearQuote();
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

  if (submitted) {
    return (
      <div className="min-h-screen pt-32 pb-20 bg-[#f0fdf4]">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto"
          >
            <Card className="text-center">
              <CardContent className="pt-12 pb-12">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="text-green-600" size={48} />
                </div>
                <h1 className="text-4xl mb-4">Request Received!</h1>
                <p className="text-lg text-muted-foreground mb-8">
                  Your quote request has been successfully submitted. Our team will review your requirements and get back to you within 24 hours.
                </p>
                <Link to="/home">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 text-white">
                    Back to Home
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  // --- EMPTY STATE ---
  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex items-center justify-center bg-[#f0fdf4]">
        <div className="text-center">
          <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="text-muted-foreground" size={48} />
          </div>
          <h1 className="text-3xl mb-4">Your Quote Cart is Empty</h1>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            It looks like you haven't added any products to your quote request yet. Browse our collections to find the perfect wellness products.
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
          <h1 className="text-4xl mb-3">Finalize Your Quote Request</h1>
          <p className="text-muted-foreground">Review your items and provide your contact details</p>
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
              <h2 className="text-xl font-semibold">Selected Items ({items.length})</h2>
              <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50" onClick={clearQuote}>
                Clear All
              </Button>
            </div>

            <div className="space-y-4">
              {items.map((item) => (
                <Card key={item.id} className="overflow-hidden">
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
                          <h3 className="font-medium text-lg leading-tight mb-1">{item.name}</h3>
                          {item.category && (
                            <p className="text-sm text-muted-foreground">{item.category.name}</p>
                          )}
                        </div>
                        <button
                          onClick={() => removeFromQuote(item.id)}
                          className="text-muted-foreground hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                      <div className="flex items-center justify-between mt-4">
                        <div className="text-sm bg-muted px-3 py-1 rounded-full">
                          Qty: <span className="font-semibold">{item.quantity}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </motion.div>

          {/* RIGHT COL: Contact Form or Auth CTA */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {renderFormColumn(isLoaded, isSignedIn, user, formData, isSubmitting, handleSubmit, handleChange)}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function renderFormColumn(isLoaded: boolean, isSignedIn: boolean, user: any, formData: any, isSubmitting: boolean, handleSubmit: any, handleChange: any) {
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
            To maintain order history and secure your quote, please sign in to your Sakshi Enterprise account.
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
          Where should we send the quotation, {user?.firstName}?
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

          <div className="space-y-2">
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
            disabled={isSubmitting}
            className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
          >
            {isSubmitting ? 'Processing Quote...' : 'Submit Request'}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            We will get back to you within 24 hours.
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
