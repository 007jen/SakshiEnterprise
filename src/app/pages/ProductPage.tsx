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
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
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

  useEffect(() => {
    if (product && product.variants && product.variants.length > 0) {
      setSelectedVariant(product.variants[0]);
    }
  }, [product]);

  const currentPrice = selectedVariant ? selectedVariant.price : product?.price;
  const currentMrp = selectedVariant ? selectedVariant.mrp : product?.mrp;

  const discount = currentMrp && currentPrice
    ? Math.round(((currentMrp - currentPrice) / currentMrp) * 100)
    : 0;

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
    const variantInfo = selectedVariant ? ` (Size: ${selectedVariant.size})` : '';
    const message = `Hi, I'm interested in ${product.name}${variantInfo}. Can you provide more information?`;

    const link = getWhatsAppLink(rawNumber, message);
    if (link) {
      window.open(link, '_blank');
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
            className="relative"
          >
            <img
              src={formatProductImageUrl(product.image)}
              alt={product.name}
              className="w-full rounded-lg shadow-xl"
            />
            {/* Dynamic Size Badge over Image */}
            {selectedVariant && (
              <div className="absolute top-6 right-6 w-20 h-20 rounded-full border-2 border-dashed border-primary/40 bg-white/80 backdrop-blur-sm flex items-center justify-center p-2 text-center animate-in fade-in zoom-in duration-300">
                <span className="text-xs font-bold text-primary leading-tight">
                  {selectedVariant.size}
                </span>
              </div>
            )}
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
              <p className="text-3xl font-bold text-[#2c3333] mb-1">₹{currentPrice}</p>
              {currentMrp && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">M.R.P.: <span className="line-through">₹{currentMrp}</span></span>
                  {discount > 0 && (
                    <span className="text-sm text-[#2c3333] font-bold uppercase">
                      {discount}% off
                    </span>
                  )}
                </div>
              )}
            </div>
            <div className="mb-4 sm:mb-6">
              <div className={`text-sm sm:text-base text-muted-foreground relative ${!isDescriptionExpanded ? 'line-clamp-3' : ''}`}>
                {product.description}
              </div>
              {product.description && product.description.length > 150 && (
                <button
                  onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                  className="text-primary font-bold text-sm mt-2 hover:underline focus:outline-none"
                >
                  {isDescriptionExpanded ? 'Read Less' : 'Read More'}
                </button>
              )}
            </div>

            {/* Pack Section */}
            {product.variants && product.variants.length > 0 && (
              <div className="mb-8">
                <h3 className="text-sm font-bold text-primary uppercase tracking-wider mb-4">Pack</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {product.variants.map((v: any) => {
                    const vDiscount = v.mrp && v.price
                      ? Math.round(((v.mrp - v.price) / v.mrp) * 100)
                      : 0;

                    return (
                      <button
                        key={v.id}
                        onClick={() => setSelectedVariant(v)}
                        className={`flex flex-col rounded-xl border transition-all text-left overflow-hidden group ${selectedVariant?.id === v.id
                          ? 'border-primary ring-1 ring-primary shadow-md'
                          : 'border-black/10 bg-white hover:border-primary/30'
                          }`}
                      >
                        <div className={`px-4 py-2 text-xs font-bold uppercase transition-colors ${selectedVariant?.id === v.id ? 'bg-[#2c3333] text-white' : 'bg-black/5 text-muted-foreground'
                          }`}>
                          {v.size}
                        </div>
                        <div className="p-4 flex-1">
                          <div className="text-2xl font-extrabold text-[#2c3333] mb-1">₹{v.price}</div>
                          {v.mrp && (
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-muted-foreground/60 line-through">₹{v.mrp}</span>
                              {vDiscount > 0 && (
                                <span className="text-xs text-[#2c3333] font-bold uppercase">
                                  {vDiscount}% off
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

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
                onClick={() => addToQuote(product, quantity, selectedVariant)}
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
              For Bulk orders Please talk to our agent in Chatbox
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
