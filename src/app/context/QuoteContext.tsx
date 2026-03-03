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
}
import { toast } from 'sonner';

export interface QuoteItem extends Product {
    quantity: number;
    customNotes?: string;
}

interface QuoteContextType {
    items: QuoteItem[];
    addToQuote: (product: Product, quantity: number, customNotes?: string) => void;
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

    const addToQuote = useCallback((product: Product, quantity: number, customNotes?: string) => {
        setItems((prev) => {
            const existing = prev.find((item) => item.id === product.id);
            if (existing) {
                toast.info("Updated quantity in Quote Cart");
                return prev.map((item) =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + quantity, customNotes: customNotes || item.customNotes }
                        : item
                );
            }
            toast.success("Added to Quote Cart");
            return [...prev, { ...product, quantity, customNotes }];
        });
    }, []);

    const removeFromQuote = useCallback((productId: string) => {
        setItems((prev) => prev.filter((item) => item.id !== productId));
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
