import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Seo } from '../components/SEO';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { CheckCircle, MessageCircle, ShoppingBag, Plus, Minus, Loader2 } from 'lucide-react';
import { useQuote } from '../context/QuoteContext';
import { motion } from 'motion/react';


interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  inStock: boolean;
  categoryId: string;
  tags?: string[];
}

export function ProductPage() {
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToQuote } = useQuote();
  const [quantity, setQuantity] = useState(1);
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${apiBaseUrl}/api/products`);
        if (res.ok) {
          const allData: Product[] = await res.json();
          const p = allData.find(item => item.id === productId);
          if (p) {
            setProduct(p);
            setQuantity(1);

            // Fetch related products from the new endpoint
            try {
              const relatedRes = await fetch(`${apiBaseUrl}/api/products/${p.id}/related`);
              if (relatedRes.ok) {
                const relatedData = await relatedRes.json();
                setRelatedProducts(relatedData);
              }
            } catch (error) {
              console.error('Error fetching related products:', error);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };
    if (productId) fetchProduct();
  }, [productId]);

  if (loading) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex items-center justify-center">
        <Loader2 className="animate-spin text-accent" size={48} />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen pt-32 pb-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl mb-4">Product Not Found</h1>
          <Link to="/home">
            <Button>Back to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const customizationOptions = [
    'Logo Printing',
    'Custom Colors',
    'Personalized Packaging',
    'Custom Messages',
    'Bulk Discounts Available'
  ];

  const useCases = [
    'Corporate Events',
    'Client Appreciation',
    'Employee Recognition',
    'Festive Celebrations',
    'Product Launches',
    'Trade Shows & Exhibitions'
  ];

  const handleWhatsApp = () => {
    const rawNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '';
    // Strip any non-digit characters (like +, -, spaces)
    const phoneNumber = rawNumber.replaceAll(/\D/g, '');


    // Ensure we have a valid number and it starts with 91 for India if not already present
    const formattedNumber = phoneNumber.startsWith('91') ? phoneNumber : `91${phoneNumber}`;

    const message = encodeURIComponent(
      `Hi, I'm interested in ${product.name}. Can you provide more information?`
    );

    if (formattedNumber.length > 2) {
      window.open(`https://wa.me/${formattedNumber}?text=${message}`, '_blank');
    } else {
      console.warn('WhatsApp number not configured correctly in .env');
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20">
      <Seo
        title={product.name}
        description={product.description}
        keywords={product.tags}
      />
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 mb-12">
          {/* Product Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <img
              src={product.image?.startsWith('/uploads') ? `${apiBaseUrl}${product.image}` : product.image || 'https://placehold.co/600x400?text=No+Image'}
              alt={product.name}
              className="w-full rounded-lg shadow-xl"
            />
          </motion.div>

          {/* Product Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-6">
            </div>

            <h1 className="text-4xl mb-4">{product.name}</h1>
            <p className="text-lg text-muted-foreground mb-4">{product.description}</p>



            {/* Customization Options */}
            <Card className="mb-8">
              <CardContent className="p-6">
                <h3 className="mb-4 text-xl">Customization Options</h3>
                <div className="space-y-2">
                  {customizationOptions.map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                      <CheckCircle className="text-accent" size={20} />
                      <span className="text-sm">{option}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quantity and CTA Buttons */}
            <div className="flex flex-col gap-6 mb-8">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium">Quantity:</span>
                <div className="flex items-center border rounded-md">
                  <button
                    className="p-2 hover:bg-muted"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    <Minus size={16} />
                  </button>
                  <input
                    type="number"
                    className="w-20 text-center border-none focus:ring-0 p-1"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                    min="1"
                  />
                  <button
                    className="p-2 hover:bg-muted"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Button
                  size="lg"
                  className="bg-accent hover:bg-accent/90 text-accent-foreground w-full"
                  onClick={() => addToQuote(product, quantity)}
                >
                  <ShoppingBag className="mr-2" size={20} />
                  Add to Quote
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  className="w-full"
                  onClick={handleWhatsApp}
                >
                  <MessageCircle className="mr-2" size={20} />
                  WhatsApp
                </Button>
              </div>
            </div>
            <p className="text-xl font-bold text-accent mb-8">
              Customization & bulk orders available. Contact us today!
            </p>

            {/* Additional Info removed as requested */}
          </motion.div>
        </div>

        {/* Use Cases */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <Card>
            <CardContent className="p-8">
              <h2 className="text-3xl mb-6">Perfect For</h2>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                {useCases.map((useCase) => (
                  <div
                    key={useCase}
                    className="flex items-center space-x-2 p-3 bg-muted rounded-lg"
                  >
                    <CheckCircle className="text-accent flex-shrink-0" size={20} />
                    <span className="text-sm">{useCase}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Related Products */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl mb-8">Related Products</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <Link key={relatedProduct.id} to={`/products/${relatedProduct.id}`}>
                <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full">
                  <div className="h-48 overflow-hidden bg-muted">
                    <img
                      src={relatedProduct.image?.startsWith('/uploads') ? `${apiBaseUrl}${relatedProduct.image}` : relatedProduct.image || 'https://placehold.co/600x400?text=No+Image'}
                      alt={relatedProduct.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="mb-2 line-clamp-1">{relatedProduct.name}</h3>
                    {/* <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {relatedProduct.description}
                    </p> */}
                    <div className="flex justify-end items-center mt-auto">
                      {/* <span className="font-bold text-accent">₹{relatedProduct.price}</span> */}
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </motion.div>
      </div >
    </div >
  );
}
