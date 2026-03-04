import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { motion, AnimatePresence } from 'motion/react';
import { testimonials } from '../data/products';
import Banner from '../../assets/Dark1.jpeg';
import GoldenImage from '../../assets/goldenImage.jpg';
import ZanduLogo from '../../assets/ZanDu.png';
import BaidyanathLogo from '../../assets/Baidyanath.png';
import SanduLogo from '../../assets/Sandu.png';
import HamdardLogo from '../../assets/Hamdard.png';
import JinvarLogo from '../../assets/Jinvar.png';

const localLogos: Record<string, string> = {
  'Zandu': ZanduLogo,
  'Baidyanath': BaidyanathLogo,
  'Sandu': SanduLogo,
  'Hamdard': HamdardLogo,
  'Jinvar': JinvarLogo,
};

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  mrp?: number;
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
    title: "Ayurvedic Solutions",
    subtitle: "Promoting health through traditions.",
    ctaText: "Request Bulk Quote",
    ctaLink: "/quote",
    description: ""
  },
  {
    id: 2,
    image: GoldenImage,
    title: "Essential Healthcare Products",
    subtitle: "Reliable supply for your needs.",
    ctaText: "Explore Products",
    ctaLink: "/products",
    description: ""
  }
];

export function HomePage() {
  const [currentSlide] = useState(0);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          fetch(`${apiBaseUrl}/api/products`),
          fetch(`${apiBaseUrl}/api/categories`)
        ]);

        if (prodRes.ok) {
          const prodData = await prodRes.json();
          setFeaturedProducts(prodData.slice(0, 4));
        }

        if (catRes.ok) {
          const catData = await catRes.json();
          // Show categories that are in the predefined brand list OR have a logo uploaded in DB
          const brandNames = ['Zandu', 'Baidyanath', 'Sandu', 'Hamdard', 'Jinvar', 'Rivayu'];
          const mappedBrands = catData.filter((c: any) => brandNames.includes(c.name) || (c.logo && c.logo.trim() !== ''));
          setCategories(mappedBrands.slice(0, 6));
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [apiBaseUrl]);

  // Commented out auto-sliding animation as per user request
  // useEffect(() => {
  //   const timer = setInterval(() => {
  //     setCurrentSlide((prev) => (prev + 1) % slides.length);
  //   }, 5000);
  //   return () => clearInterval(timer);
  // }, []);

  return (
    <div className="min-h-screen bg-[#f0fdf4]">
      {/* Hero Section */}
      <section className="relative w-full bg-[#f0fdf4] pt-14 sm:pt-16 lg:pt-20">
        <div className="flex flex-col">
          {/* Image Content (Banner) */}
          {/* Image Content (Banner) */}
          <div className="w-full overflow-hidden order-first">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7 }}
                className="w-full flex justify-center relative"
              >
                <motion.img
                  src={slides[currentSlide].image}
                  alt={slides[currentSlide].title}
                  className="w-full h-auto max-h-[60vh] object-cover transition-all duration-500"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Text Content */}
          <div className="w-full relative z-10 py-8 md:py-12">
            <div className="container mx-auto px-4 max-w-6xl">
              <div className="text-center mb-12">
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight text-primary leading-[1.2] font-serif mb-6">
                  Ayurvedic & Healthcare Solutions
                </h1>
                <p className="text-lg md:text-xl text-[#40916c] leading-relaxed mx-auto font-medium max-w-4xl">
                  We are a trusted supplier connecting pharmacies, retailers, and healthcare partners with authentic Ayurvedic and selected healthcare essentials. With a focus on ethical sourcing and dependable supply, our goal is to enhance everyday health through reliable healthcare distribution.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6 md:gap-8 mb-12">
                {/* Vision */}
                <Card className="bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-none rounded-3xl p-8 text-center hover:shadow-lg transition-shadow">
                  <h3 className="text-2xl font-bold text-[#2d6a4f] mb-4 tracking-tight">Our Vision</h3>
                  <p className="text-[#40916c] leading-relaxed">
                    To become a dependable and recognized name in the healthcare distribution sector by delivering trusted products that support healthier communities.
                  </p>
                </Card>

                {/* Mission */}
                <Card className="bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-none rounded-3xl p-8 text-center hover:shadow-lg transition-shadow">
                  <h3 className="text-2xl font-bold text-[#2d6a4f] mb-4 tracking-tight">Our Mission</h3>
                  <p className="text-[#40916c] leading-relaxed">
                    To provide genuine products, maintain consistent quality, and build long-term relationships while promoting preventive and natural healthcare solutions.
                  </p>
                </Card>

                {/* Commitment */}
                <Card className="bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-none rounded-3xl p-8 text-center hover:shadow-lg transition-shadow">
                  <h3 className="text-2xl font-bold text-[#2d6a4f] mb-4 tracking-tight">Our Commitment</h3>
                  <p className="text-[#40916c] leading-relaxed">
                    We are committed to delivering products that meet expectations of quality, authenticity, and reliability to support our partners with dependable service.
                  </p>
                </Card>
              </div>

              <div className="flex justify-center">
                <Link to="/products">
                  <Button size="lg" className="bg-[#2d6a4f] hover:bg-[#1b4332] text-white text-lg px-10 py-6 h-auto transition-all rounded-full shadow-md hover:shadow-xl hover:-translate-y-1">
                    Explore Products
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      {/* <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl mb-6">About Sakshi Enterprise</h2>
              <p className="text-lg text-muted-foreground mb-6">
                We are a trusted supplier of Ayurvedic and healthcare products committed to promoting quality, reliability, and customer satisfaction. We specialize in authentic Ayurvedic preparations and essential healthcare products.
              </p>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="text-primary" size={24} />
                  <span>Genuine Ayurvedic products</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="text-primary" size={24} />
                  <span>Dependable healthcare supply</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="text-primary" size={24} />
                  <span>Dedicated partner support</span>
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
                src={AboutImage}
                alt="About Us"
                className="rounded-lg shadow-xl w-full h-auto"
              />
            </motion.div>
          </div>
        </div>
      </section> */}

      {/* Ayurvedic Brands Section */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl mb-4 text-primary font-bold">Best brands we supply from</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We proudly supply  products from most trusted Ayurvedic brands, ensuring quality and reliability for your business.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category, index) => {
              const logoSrc = category.logo || localLogos[category.name];

              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex flex-col items-center group cursor-pointer"
                >
                  <Link to={`/products?category=${category.name.toLowerCase()}`} className="w-full flex flex-col items-center">
                    <div className="w-32 h-32 md:w-40 md:h-40 bg-white rounded-full shadow-md flex items-center justify-center mb-4 overflow-hidden border-2 border-transparent group-hover:border-primary transition-all duration-300 group-hover:shadow-xl">
                      {logoSrc ? (
                        <img
                          src={logoSrc}
                          alt={category.name}
                          className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <span className="text-4xl font-bold border-2 border-primary text-primary rounded-full w-20 h-20 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-500">
                          {category.name.charAt(0)}
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-semibold text-center group-hover:text-primary transition-colors">{category.name}</h3>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {categories.length === 0 && !loading && (
            <div className="text-center text-muted-foreground py-12">Loading brands...</div>
          )}
        </div>
      </section>

      {/* Why Choose Us */}
      {/* <section className="py-12 md:py-20 bg-muted">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10 md:mb-12">
            <h2 className="text-3xl md:text-4xl mb-3 md:mb-4">Why Choose Sakshi Enterprise</h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
              Your trusted partner for Ayurvedic and general medicine
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                icon: <Shield className="text-primary" size={32} />,
                title: 'Trusted Sourcing',
                description: 'We ensure all our products meet expectations of quality and authenticity'
              },
              {
                icon: <Clock className="text-primary" size={32} />,
                title: 'Reliable Supply',
                description: 'Consistent and timely delivery to support our business partners'
              },
              {
                icon: <Star className="text-primary" size={32} />,
                title: 'Authentic Range',
                description: 'Focus on genuine Ayurvedic preparations and essential healthcare'
              },
              {
                icon: <Users className="text-primary" size={32} />,
                title: 'Customer-Focused',
                description: 'Aiming to support businesses with products that enhance everyday health'
              },
              {
                icon: <CheckCircle className="text-accent" size={32} />,
                title: 'Quality First',
                description: 'Maintaining consistent standards across our entire product portfolio'
              },
              {
                icon: <ArrowRight className="text-primary" size={32} />,
                title: 'Long-term Partners',
                description: 'We believe healthcare distribution is a long-term responsibility'
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
      </section> */}

      {/* Featured Products */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10 md:mb-12">
            <h2 className="text-3xl md:text-4xl mb-3 md:mb-4">Featured Products</h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover our handpicked selection of premium gifts
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12">
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
                      <h3 className="mb-2 line-clamp-1 h-6">{product.name}</h3>
                      <div className="flex flex-col mb-4">
                      </div>
                      <div className="flex justify-end items-center">
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
                    <div className="flex text-primary mb-4">
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


    </div>
  );
}
