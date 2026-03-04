import { createContext, useContext, useState, useEffect, ReactNode, useMemo, useCallback } from 'react';
interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    inStock: boolean;
    category?: {
        name: string;
    };
    variants?: { id: string; size: string; price: number; mrp?: number }[];
}
import { toast } from 'sonner';

export interface QuoteItem extends Product {
    quantity: number;
    customNotes?: string;
    selectedVariant?: { id: string; size: string; price: number; mrp?: number };
}

interface QuoteContextType {
    items: QuoteItem[];
    addToQuote: (product: Product, quantity: number, selectedVariant?: any) => void;
    removeFromQuote: (productId: string) => void;
    clearQuote: () => void;
    quoteCount: number;
}

const QuoteContext = createContext<QuoteContextType | undefined>(undefined);

export function QuoteProvider({ children }: { readonly children: ReactNode }) {
    const [items, setItems] = useState<QuoteItem[]>([]);

    // Load from local storage on mount
    useEffect(() => {
        const savedQuote = localStorage.getItem('sakshi_quote_cart');
        if (savedQuote) {
            try {
                setItems(JSON.parse(savedQuote));
            } catch (e) {
                console.error('Failed to parse quote cart', e);
            }
        }
    }, []);

    // Save to local storage whenever items change
    useEffect(() => {
        localStorage.setItem('sakshi_quote_cart', JSON.stringify(items));
    }, [items]);

    const addToQuote = useCallback((product: Product, quantity: number, selectedVariant?: any) => {
        setItems((prev) => {
            const existing = prev.find((item) => (item.selectedVariant?.id === selectedVariant?.id) && (item.id === product.id));

            if (existing) {
                toast.info("Updated quantity in Quote Cart");
                return prev.map((item) =>
                    (item.selectedVariant?.id === selectedVariant?.id) && (item.id === product.id)
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }

            toast.success("Added to Quote Cart");
            const newItem: QuoteItem = {
                ...product,
                quantity,
                selectedVariant,
                // Override base price if variant is selected for display/total purposes
                price: selectedVariant ? selectedVariant.price : product.price
            };
            return [...prev, newItem];
        });
    }, []);

    const removeFromQuote = useCallback((id: string) => {
        setItems((prev) => prev.filter((item) => {
            const itemId = item.selectedVariant ? `${item.id}-${item.selectedVariant.id}` : item.id;
            return itemId !== id;
        }));
        toast.success("Removed from Quote Cart");
    }, []);

    const clearQuote = useCallback(() => {
        setItems([]);
    }, []);

    const value = useMemo(() => ({
        items,
        addToQuote,
        removeFromQuote,
        clearQuote,
        quoteCount: items.length
    }), [items, addToQuote, removeFromQuote, clearQuote]);

    return (
        <QuoteContext.Provider value={value}>
            {children}
        </QuoteContext.Provider>
    );
}

export function useQuote() {
    const context = useContext(QuoteContext);
    if (context === undefined) {
        throw new Error('useQuote must be used within a QuoteProvider');
    }
    return context;
}
