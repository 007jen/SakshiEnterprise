import { Link } from 'react-router-dom';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ArrowRight } from 'lucide-react';
import { Product } from '../types';
import { formatProductImageUrl } from '../utils/helpers';

interface ProductCardProps {
    product: Product;
}

export function ProductCard({ product }: Readonly<ProductCardProps>) {
    return (
        <Link to={`/products/${product.id}`} className="group block h-full">
            <Card className="h-full overflow-hidden hover:shadow-lg transition-all duration-300 border-border/50 bg-card hover:border-primary/20 flex flex-col">
                <div className="aspect-[4/3] overflow-hidden bg-muted relative">
                    <img
                        src={formatProductImageUrl(product.image)}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <Badge className={`absolute top-3 right-3 ${product.inStock ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'} text-white backdrop-blur-sm shadow-sm`}>
                        {product.inStock ? 'In Stock' : 'Out of Stock'}
                    </Badge>
                </div>
                <CardContent className="p-5 flex-1 flex flex-col">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                        {product.name}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4 h-10">
                        {product.description}
                    </p>
                    <div className="flex justify-between items-end mt-auto">
                        <div className="flex flex-col">
                            <span className="font-bold text-accent text-xl leading-none mb-1">
                                ₹{product.price}
                            </span>
                            {Boolean(product.mrp && product.mrp > product.price) && (
                                <div className="flex items-center gap-1.5">
                                    <span className="text-[11px] text-muted-foreground line-through">₹{product.mrp}</span>
                                    <span className="text-[11px] text-primary font-bold uppercase">
                                        {Math.round(((product.mrp - product.price) / product.mrp) * 100)}% off
                                    </span>
                                </div>
                            )}
                        </div>
                        <Button variant="ghost" size="sm" className="h-9 hover:bg-primary hover:text-primary-foreground group/btn">
                            View
                            <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform ml-1" />
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}
