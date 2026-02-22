import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Users, Clock, Shield, Star } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { motion, AnimatePresence } from 'motion/react';
import { testimonials } from '../data/products';
import Banner from '../../assets/UpdatedBanner.png';
import GoldenImage from '../../assets/goldenImage.jpg';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  inStock: boolean;
}

// Dynamically import icon components based on category icon name
const getIcon = (iconName: string) => {
  const icons: Record<string, any> = {
    Briefcase: () => import('lucide-react').then(m => m.Briefcase),
    Heart: () => import('lucide-react').then(m => m.Heart),
    Gift: () => import('lucide-react').then(m => m.Gift),
    Shirt: () => import('lucide-react').then(m => m.Shirt),
    Coffee: () => import('lucide-react').then(m => m.Coffee),
    FolderOpen: () => import('lucide-react').then(m => m.FolderOpen),
    Award: () => import('lucide-react').then(m => m.Award),
    Leaf: () => import('lucide-react').then(m => m.Leaf)
  };

  return icons[iconName] || (() => import('lucide-react').then(m => m.Gift));
};

const slides = [
  {
    id: 1,
    image: Banner,
    title: "Corporate Gifting Solutions",
    subtitle: "Build relationships that last.",
    ctaText: "Request Bulk Quote",
    ctaLink: "/quote",
    description: ""
  },
  {
    id: 2,
    image: GoldenImage,
    title: "Personalized for Loved Ones",
    subtitle: "Make every occasion special.",
    ctaText: "Shop Collection",
    ctaLink: "/products", // Anchor link to products
    description: ""
  }
];

export function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${apiBaseUrl}/api/products`);
        if (res.ok) {
          const data = await res.json();
          setFeaturedProducts(data.slice(0, 4));
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full bg-background pt-24">
        <div className="flex flex-col">
          {/* Text Content */}
          <div className="w-full relative z-10 mb-20">
            <div className="bg-white w-full p-8 md:p-12 transition-all duration-500 hover:bg-[#d4af37]/10 hover:shadow-[0_0_30px_rgba(212,175,55,0.2)]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="text-center space-y-6"
                >
                  <div>
                    {/* <Badge variant="outline" className="mb-4 text-primary border-primary/20 px-4 py-1 rounded-full">
                      {currentSlide === 0 ? "Corporate Solutions" : "Personal Gifting"}
                    </Badge> */}
                    <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight text-primary leading-[1.1]">
                      {slides[currentSlide].title}
                    </h1>
                  </div>

                  <h2 className="text-xl md:text-2xl font-medium text-secondary/80">
                    {slides[currentSlide].subtitle}
                  </h2>

                  <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                    {slides[currentSlide].description}
                  </p>

                  <div className="flex flex-wrap gap-4 pt-4 justify-center">
                    <Link to={slides[currentSlide].ctaLink}>
                      <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 py-6 h-auto transition-all rounded-full min-w-[200px]">
                        {slides[currentSlide].ctaText}
                        <ArrowRight className="ml-2" size={20} />
                      </Button>
                    </Link>
                    <Link to="/products">
                      <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/5 text-lg px-8 py-6 h-auto transition-all rounded-full min-w-[200px]">
                        Explore Products
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Image Content (Banner) */}
          <div className="relative w-full overflow-hidden order-first">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7 }}
                className="relative md:absolute md:inset-0"
              >
                <img
                  src={slides[currentSlide].image}
                  alt={slides[currentSlide].title}
                  className="w-full h-auto md:h-full md:object-cover"
                />

                {/* Subtle gradient overlay at the bottom for better edge definition if needed */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent lg:hidden" />
              </motion.div>
            </AnimatePresence>
            {/* Height placeholder for MD+ screens where content is absolute */}
            <div className="hidden md:block h-[60vh]" />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl mb-6">About Nishyash </h2>
              <p className="text-lg text-muted-foreground mb-6">
                We are a leading provider of corporate and personalised gifting solutions, dedicated to helping businesses create lasting impressions. With years of experience in the industry, we understand the importance of quality, customization, and timely delivery.
              </p>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="text-accent" size={24} />
                  <span>Premium quality products</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="text-accent" size={24} />
                  <span>Custom branding options</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="text-accent" size={24} />
                  <span>Dedicated customer support</span>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <img
                src="https://placehold.co/600x400/1a1a1a/gold?text=About+Nishyash"
                alt="About Us"
                className="rounded-lg shadow-xl"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl mb-4">Why Choose Nishyash</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Your trusted partner for professional gifting solutions
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Users className="text-accent" size={32} />,
                title: 'One-Stop Solution',
                description: 'Complete gifting services from selection to delivery'
              },
              {
                icon: <Star className="text-accent" size={32} />,
                title: 'Custom Branding',
                description: 'Personalize every gift with your brand identity'
              },
              {
                icon: <Clock className="text-accent" size={32} />,
                title: 'Timely Delivery',
                description: 'Reliable logistics ensuring on-time delivery'
              },
              {
                icon: <Shield className="text-accent" size={32} />,
                title: 'Quality Assurance',
                description: 'Premium products with strict quality control'
              },
              {
                icon: <CheckCircle className="text-accent" size={32} />,
                title: 'Dedicated Support',
                description: '24/7 customer service for all your needs'
              },
              {
                icon: <ArrowRight className="text-accent" size={32} />,
                title: 'Easy Process',
                description: 'Simple ordering and customization workflow'
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="mb-4">{feature.icon}</div>
                    <h3 className="mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl mb-4">Featured Products</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover our handpicked selection of premium gifts
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {featuredProducts.map((product, index) => (

              <motion.div
                key={product.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Link to={`/products/${product.id}`}>
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full">
                    <div className="h-48 overflow-hidden bg-muted">
                      <img
                        src={product.image?.startsWith('/uploads') ? `${apiBaseUrl}${product.image}` : product.image || 'https://placehold.co/600x400?text=No+Image'}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="mb-2 line-clamp-1">{product.name}</h3>
                      {/* <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {product.description}
                      </p> */}
                      <div className="flex justify-end items-center mt-auto">
                        {/* <span className="font-bold text-accent">₹{product.price}</span> */}
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
          {/* <div className="text-center p-8 bg-accent/5 rounded-2xl border border-accent/20 max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold text-primary mb-2">Customization & Bulk Orders Available</h3>
            <p className="text-muted-foreground mb-6">Contact us today to discuss your specific requirements and get exclusive bulk pricing.</p>
            <div className="flex justify-center gap-4">
              <Link to="/quote">
                <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">Request Quote</Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline">Contact Support</Button>
              </Link>
            </div>
          </div> */}
          {!loading && featuredProducts.length === 0 && (

            <div className="text-center py-10 text-muted-foreground">
              New products coming soon!
            </div>
          )}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl mb-4">What Our Clients Say</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Trusted by businesses across industries
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="bg-white">
                  <CardContent className="p-6">
                    <div className="flex text-accent mb-4">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} size={18} fill="currentColor" />
                      ))}
                    </div>
                    <p className="text-muted-foreground mb-4 italic">
                      "{testimonial.quote}"
                    </p>
                    <div>
                      <p>{testimonial.author}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.designation}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary to-secondary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl mb-6">Looking for a Reliable Corporate Gifting Partner?</h2>
          <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            Let us help you create lasting impressions with our premium gifting solutions
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/quote">
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                Get a Quote
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
