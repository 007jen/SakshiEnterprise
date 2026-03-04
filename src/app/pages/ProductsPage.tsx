import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

import { Category, Product } from '../types';
import { ProductCard } from '../components/ProductCard';
import { Button } from '../components/ui/button';

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
        return <div className="pt-32 pb-20 text-center text-primary">Loading collection...</div>;
    }

    return (
        <div className="pt-28 pb-20 min-h-screen bg-[#f0fdf4]">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6 text-primary">Our Complete Collection</h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Discover our comprehensive range of authentic Ayurvedic and healthcare wellness products, thoughtfully selected for pharmacies, retailers and clinics.
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
                                        <ProductCard key={product.id} product={product} />
                                    ))}
                                </div>
                                <div className="mt-8 text-center p-6 bg-muted/30 rounded-lg border border-border/50">
                                    <p className="text-lg font-medium text-primary">
                                        For Customization & bulk orders available. Please talk to our agent in chatbox
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
