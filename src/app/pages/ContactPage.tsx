import { useState } from 'react';
import { Mail, Phone, MapPin, Clock, CheckCircle, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { motion } from 'motion/react';

export function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch(`${apiBaseUrl}/api/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setSubmitted(true);
      } else {
        const err = await response.json();
        alert(`Error: ${err.error || 'Failed to submit'}`);
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('Could not connect to the server. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsApp = () => {
    const rawNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '9082035278';
    const cleanNumber = rawNumber.replace(/\D/g, '');
    const formattedNumber = cleanNumber.startsWith('91') ? cleanNumber : `91${cleanNumber}`;
    const message = encodeURIComponent('Hi, I would like to get in touch with Nishyash Corporation.');
    window.open(`https://wa.me/${formattedNumber}?text=${message}`, '_blank');
  };


  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl md:text-5xl mb-4">Get In Touch</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Have questions about our products or services? We're here to help. Reach out to us through any of the channels below.
            </p>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 mb-12">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-3xl mb-6">Contact Information</h2>
            <div className="space-y-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Mail className="text-accent" size={24} />
                    </div>
                    <div>
                      <h3 className="mb-2">Email Us</h3>
                      <p className="text-muted-foreground">{(import.meta.env.VITE_ADMIN_EMAIL || 'info@nishyash.com').split(',')[0].trim()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Phone className="text-accent" size={24} />
                    </div>
                    <div>
                      <h3 className="mb-2">Call Us</h3>
                      <p className="text-muted-foreground">
                        {import.meta.env.VITE_WHATSAPP_NUMBER ? `+91 ${import.meta.env.VITE_WHATSAPP_NUMBER}` : '+91 90820 35278'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <MapPin className="text-accent" size={24} />
                    </div>
                    <div>
                      <h3 className="mb-2">Visit Us</h3>
                      <p className="text-muted-foreground">
                        Nishyash Corporation<br />
                        Business Center,Flat no.28, <br />
                        Humlog Society, Kandivali West, <br />
                        Mumbai, Maharashtra 400067,India
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-green-500/20 bg-green-500/5">
                <CardContent className="p-6">
                  <div className="flex flex-col space-y-4">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <MessageCircle className="text-green-600" size={24} />
                      </div>
                      <div>
                        <h3 className="mb-1">Instant Support</h3>
                        <p className="text-sm text-muted-foreground">Chat with us directly on WhatsApp for quick queries.</p>
                      </div>
                    </div>
                    <Button
                      size="lg"
                      className="w-full bg-green-500 hover:bg-green-600 text-white"
                      onClick={handleWhatsApp}
                    >
                      <MessageCircle className="mr-2" size={20} />
                      Chat on WhatsApp
                    </Button>
                  </div>
                </CardContent>
              </Card>

            </div>
          </motion.div>

          {/* Contact Form or Success Message */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {submitted ? (
              <Card className="h-full flex flex-col justify-center items-center text-center p-8">
                <CardContent className="space-y-6">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="text-green-600" size={40} />
                  </div>
                  <h2 className="text-3xl font-semibold">Message Sent!</h2>
                  <p className="text-muted-foreground text-lg max-w-sm mx-auto">
                    Thank you for reaching out. We have received your message and will get back to you within 24 hours.
                  </p>
                  <Link to="/home">
                    <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground mt-4">
                      Back to Home
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-8">
                  <h2 className="text-3xl mb-6">Send Us a Message</h2>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input id="firstName" name="firstName" placeholder="John" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input id="lastName" name="lastName" placeholder="Doe" required />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="john@company.com"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone *</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="Ex: 9082035278"
                        required
                        maxLength={10}
                        pattern="[0-9]{10}"
                        onInput={(e) => {
                          e.currentTarget.value = e.currentTarget.value.replace(/\D/g, '');
                        }}
                      />
                      <p className="text-[10px] text-muted-foreground">Please enter exactly 10 digits without spaces or country code.</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject *</Label>
                      <Input
                        id="subject"
                        name="subject"
                        placeholder="How can we help you?"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        name="message"
                        placeholder="Tell us more about your enquiry..."
                        rows={6}
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      disabled={isSubmitting}
                      className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                    >
                      {isSubmitting ? 'Sending Message...' : 'Send Message'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </div>

        {/* Map Placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Card>
            <CardContent className="p-0">
              <div className="h-96 bg-muted rounded-lg overflow-hidden">
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="mx-auto mb-4 text-muted-foreground" size={48} />
                    <p className="text-lg text-muted-foreground">Map View</p>
                    <p className="text-sm text-muted-foreground">
                      Business Center, Andheri East, Mumbai
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
