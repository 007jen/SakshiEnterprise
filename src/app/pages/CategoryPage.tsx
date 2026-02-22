import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Seo } from '../components/SEO';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { motion } from 'motion/react';
import { Loader2 } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  inStock: boolean;
  tags?: string[];
}

interface Category {
  id: string;
  name: string;
  products?: Product[];
}

export function CategoryPage() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await fetch(`${apiBaseUrl}/api/categories`);
        if (res.ok) {
          const data: Category[] = await res.json();
          const found = data.find(c => c.id === categoryId);
          if (found) setCategory(found);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };
    if (categoryId) fetchCategory();
  }, [categoryId]);

  if (loading) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex items-center justify-center">
        <Loader2 className="animate-spin text-accent" size={48} />
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen pt-32 pb-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl mb-4">Category Not Found</h1>
          <Link to="/home">
            <Button>Back to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Seo
        title={category.name}
        description={`Explore our selection of ${category.name}. Premium corporate and personalised gifts.`}
      />
      {/* Category Hero */}
      <section className="bg-gradient-to-br from-primary to-secondary text-primary-foreground pt-32 pb-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <h1 className="text-5xl mb-4">{category.name}</h1>
          </motion.div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          {category.products && category.products.length > 0 ? (
            <>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {category.products.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <Link to={`/products/${product.id}`}>
                      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
                        <div className="h-56 overflow-hidden bg-muted">
                          <img
                            src={product.image?.startsWith('/uploads') ? `${apiBaseUrl}${product.image}` : product.image || 'https://placehold.co/600x400?text=No+Image'}
                            alt={product.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                        <CardContent className="p-6 flex-1 flex flex-col">
                          <h3 className="mb-2">{product.name}</h3>
                          {/* <p className="text-sm text-muted-foreground mb-4 flex-1">
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
              <div className="mt-12 text-center p-8 bg-muted/50 rounded-xl border border-border">
                <h3 className="text-2xl font-semibold mb-2">Customization & Bulk Orders Available</h3>
                <p className="text-muted-foreground">Contact us today for personalized gifting solutions and bulk order discounts!</p>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-xl text-muted-foreground mb-6">
                No products found in this category.
              </p>
              <Link to="/home">
                <Button>Explore All Categories</Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-muted">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl mb-4">Need Help Choosing?</h2>
          <p className="text-lg text-muted-foreground mb-6">
            Our team is here to help you find the perfect gifts for your needs
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/quote">
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                Get a Quote
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
