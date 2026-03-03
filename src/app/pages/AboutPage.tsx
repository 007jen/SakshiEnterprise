import { Link } from 'react-router-dom';
import { CheckCircle, Award, Users, TrendingUp, Heart } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { motion } from 'motion/react';

export function AboutPage() {
  return (
    <div className="min-h-screen bg-[#f0fdf4]">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-secondary text-primary-foreground pt-24 sm:pt-32 pb-12 sm:pb-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl mb-4 sm:mb-6 leading-tight">About Sakshi Enterprise</h1>
            <p className="text-lg sm:text-xl text-primary-foreground/90">
              A trusted supplier of Ayurvedic and healthcare  products committed to quality and customer satisfaction.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Our Story / About Us */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl mb-4 md:mb-6">About Us</h2>
              <p className="text-base md:text-lg text-muted-foreground mb-4">
                Sakshi Enterprise is a trusted supplier of Ayurvedic and healthcare  products committed to promoting quality, reliability, and customer satisfaction. We specialize in supplying authentic Ayurvedic preparations and selected healthcare essentials to pharmacies, retailers, distributors, and healthcare partners.
              </p>
              <p className="text-base md:text-lg text-muted-foreground mb-4">
                With a focus on ethical sourcing, dependable supply, and customer-first service, we aim to support businesses with products that enhance everyday health and . At Sakshi Enterprise, we believe healthcare distribution is not just business — it is responsibility.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <img
                src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b"
                alt="Ayurvedic "
                className="rounded-lg shadow-xl"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-2xl shadow-sm border border-border"
            >
              <h2 className="text-3xl mb-6 text-primary">Our Vision</h2>
              <p className="text-lg text-muted-foreground">
                To become a dependable and recognized name in the healthcare distribution sector by delivering trusted  products that support healthier communities.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-2xl shadow-sm border border-border"
            >
              <h2 className="text-3xl mb-6 text-primary">Our Mission</h2>
              <ul className="space-y-4">
                {[
                  "To provide genuine Ayurvedic and  products",
                  "To maintain consistent quality and reliable supply",
                  "To build long-term relationships with partners and customers",
                  "To promote preventive and natural healthcare solutions"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-muted-foreground">
                    <CheckCircle className="text-primary mt-1 flex-shrink-0" size={20} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Values / Why Choose Us */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl mb-4">Why Choose Sakshi Enterprise</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our commitment to authenticity and reliability defines our partnership.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              {
                icon: <Award className="text-primary" size={32} />,
                title: 'Trusted Sourcing',
                description: 'Ethically sourced and authentic products'
              },
              {
                icon: <TrendingUp className="text-primary" size={32} />,
                title: 'Reliable Supply',
                description: 'Dependable and timely distribution network'
              },
              {
                icon: <Users className="text-primary" size={32} />,
                title: 'Partner Focused',
                description: 'Long-term business partnership mindset'
              },
              {
                icon: <Heart className="text-primary" size={32} />,
                title: 'Quality First',
                description: 'Commitment to high product standards'
              },
              {
                icon: <CheckCircle className="text-primary" size={32} />,
                title: 'Competitive',
                description: 'Attractive and fair pricing structure'
              }
            ].map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full">
                  <CardContent className="p-6 text-center">
                    <div className="mb-4 flex justify-center">{value.icon}</div>
                    <h3 className="mb-2 text-xl">{value.title}</h3>
                    <p className="text-sm text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Commitment */}
      <section className="py-20 bg-primary/5">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto bg-white p-12 rounded-3xl shadow-xl border border-primary/20"
          >
            <h2 className="text-3xl md:text-4xl mb-6 text-primary font-bold">Our Commitment</h2>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              We are committed to delivering products that meet expectations of quality, authenticity, and reliability. Our goal is to support our partners with dependable service so they can confidently serve their customers.
            </p>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-primary to-secondary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl mb-6 font-bold">Partner with Sakshi Enterprise</h2>
          <p className="text-lg md:text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            Let's build a healthier community together through trusted  products.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/quote" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto bg-white hover:bg-slate-100 text-primary px-8 py-6 h-auto text-lg">
                Get a Quote
              </Button>
            </Link>
            <Link to="/contact" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10 px-8 py-6 h-auto text-lg !bg-transparent">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
