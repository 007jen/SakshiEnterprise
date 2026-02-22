import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { ArrowRight } from 'lucide-react';

interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    inStock: boolean;
    categoryId: string;
}

interface Category {
    id: string;
    name: string;
    products?: Product[];
}

export function ProductsPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [catsRes, prodsRes] = await Promise.all([
                    fetch(`${apiBaseUrl}/api/categories`),
                    fetch(`${apiBaseUrl}/api/products`)
                ]);
                if (catsRes.ok && prodsRes.ok) {
                    const cats = await catsRes.json();
                    const prods = await prodsRes.json();
                    setCategories(cats);
                    setProducts(prods);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return <div className="pt-32 pb-20 text-center text-accent">Loading collection...</div>;
    }

    return (
        <div className="pt-28 pb-20 min-h-screen bg-background">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6 text-primary">Our Complete Collection</h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Discover our comprehensive range of corporate and personalized gifting solutions, thoughtfully curated for every occasion.
                    </p>
                </div>

                <div className="space-y-20">
                    {categories.map((category) => {
                        const categoryProducts = products.filter(p => p.categoryId === category.id);

                        if (categoryProducts.length === 0) return null;

                        return (
                            <section key={category.id} id={category.id} className="scroll-mt-28">
                                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 border-b border-border/50 pb-4">
                                    <div>
                                        <h2 className="text-3xl font-bold text-primary mb-2">{category.name}</h2>
                                    </div>
                                    <Link to={`/categories/${category.id}`}>
                                        <Button variant="outline" className="group">
                                            View All {category.name}
                                            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </Button>
                                    </Link>
                                </div>

                                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {categoryProducts.map((product) => (
                                        <Link key={product.id} to={`/products/${product.id}`} className="group block h-full">
                                            <Card className="h-full overflow-hidden hover:shadow-lg transition-all duration-300 border-border/50 bg-card hover:border-primary/20">
                                                <div className="aspect-[4/3] overflow-hidden bg-muted relative">
                                                    <img
                                                        src={product.image?.startsWith('/uploads') ? `${apiBaseUrl}${product.image}` : product.image || 'https://placehold.co/600x400?text=No+Image'}
                                                        alt={product.name}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                    />
                                                    {/* {!product.inStock && (
                                                        <Badge className="absolute top-3 right-3 bg-red-500 text-white backdrop-blur-sm shadow-sm">
                                                            Out of Stock
                                                        </Badge>
                                                    )} */}
                                                </div>
                                                <CardContent className="p-5">
                                                    <h3 className="font-semibold text-lg mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                                                        {product.name}
                                                    </h3>
                                                    {/* <p className="text-sm text-muted-foreground line-clamp-2 mb-4 h-10">
                                                        {product.description}
                                                    </p> */}
                                                    <div className="flex justify-end items-center mt-auto">
                                                        {/* <span className="font-bold text-accent">₹{product.price}</span> */}
                                                        <Button variant="ghost" size="sm" className="group/btn hover:bg-primary hover:text-primary-foreground">
                                                            View Details
                                                            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                                        </Button>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </Link>
                                    ))}
                                </div>
                                <div className="mt-8 text-center p-6 bg-muted/30 rounded-lg border border-border/50">
                                    <p className="text-lg font-medium text-primary">
                                        Customization & bulk orders available. Contact us today for special pricing!
                                    </p>
                                </div>
                            </section>
                        );
                    })}
                </div>
                {!loading && categories.length === 0 && (
                    <div className="text-center py-20 text-muted-foreground">
                        No categories or products found.
                    </div>
                )}
            </div>
        </div>
    );
}
