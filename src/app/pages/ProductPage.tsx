import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Seo } from '../components/SEO';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Card, CardContent } from '../components/ui/card';
import { CheckCircle, MessageCircle, Loader2, ArrowRight } from 'lucide-react';
import { useQuote } from '../context/QuoteContext';
import { motion } from 'motion/react';
import { Product } from '../types';
import { formatProductImageUrl, getWhatsAppLink } from '../utils/helpers';
import { ProductCard } from '../components/ProductCard';

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
        <Loader2 className="animate-spin text-primary" size={48} />
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
    'Quality Assurance',
    'Ethical Sourcing',
    'Reliable Supply Chain',
    'Bulk Packaging Options',
    'Specialized Distribution'
  ];

  const useCases = [
    'Pharmacies & Retailers',
    'Hospitals & Clinics',
    'Wellness Centers',
    'Ayurvedic Practitioners',
    'Health Stores',
    'Institutional Supplies'
  ];

  const handleWhatsApp = () => {
    const rawNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '';
    const message = `Hi, I'm interested in ${product.name}. Can you provide more information?`;
    const whatsappLink = getWhatsAppLink(rawNumber, message);

    if (whatsappLink) {
      window.open(whatsappLink, '_blank');
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
              src={formatProductImageUrl(product.image)}
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
            <div className="mb-4">
              <Badge className={`${product.inStock ? 'bg-green-500' : 'bg-red-500'} text-white`}>
                {product.inStock ? 'In Stock' : 'Out of Stock'}
              </Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl mb-3 sm:mb-4">{product.name}</h1>
            <div className="mb-4 sm:mb-6">
              <p className="text-3xl font-bold text-accent">₹{product.price}</p>
              {product.mrp && (
                <p className="text-lg text-muted-foreground mb-1">
                  M.R.P.: ₹{product.mrp}
                </p>
              )}
              {/* <p className="text-xs text-muted-foreground mt-1 text-primary">Inclusive of all taxes</p> */}
            </div>
            <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">{product.description}</p>

            {/* Customization Options */}
            <Card className="mb-6 sm:mb-8 text-primary">
              <CardContent className="p-4 sm:p-6">
                <h3 className="mb-3 sm:mb-4 text-lg sm:text-xl font-semibold">Key Highlights</h3>
                <div className="space-y-2">
                  {customizationOptions.map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                      <CheckCircle className="text-primary" size={18} />
                      <span className="text-xs sm:text-sm">{option}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quantity Selector */}
            <div className="mb-6 flex items-center space-x-4">
              <label htmlFor="quantity" className="font-semibold text-muted-foreground">Quantity:</label>
              <div className="flex items-center border rounded-md">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="rounded-none rounded-l-md"
                >-</Button>
                <div className="w-12 text-center font-medium">{quantity}</div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setQuantity(q => q + 1)}
                  className="rounded-none rounded-r-md"
                >+</Button>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button
                size="lg"
                className="w-full sm:w-auto h-12 sm:h-14 px-6 sm:px-10 rounded-xl shadow-lg transition-all active:scale-95 text-lg"
                onClick={() => addToQuote(product, quantity)}
                disabled={!product.inStock}
              >
                Add to Cart
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto bg-green-500 text-white hover:bg-green-600 font-bold h-12 sm:h-14 px-6 sm:px-10 rounded-xl shadow-lg border-none transition-all active:scale-95 text-lg"
                onClick={handleWhatsApp}
              >
                <MessageCircle className="mr-2" size={20} />
                WhatsApp Us
              </Button>
            </div>
            <p className="text-xl font-bold text-primary mb-8">
              Bulk orders and healthcare partnerships available. Contact us today!
            </p>
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
                    className="flex items-center space-x-2 p-3 bg-primary/5 rounded-lg"
                  >
                    <CheckCircle className="text-primary flex-shrink-0" size={20} />
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
              <ProductCard key={relatedProduct.id} product={relatedProduct} />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
