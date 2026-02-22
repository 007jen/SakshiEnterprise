import { useUser, useAuth } from '@clerk/clerk-react';
import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Mail, Phone, Calendar, FileText, Plus, Trash2, Edit2, ImageIcon, Save, X } from 'lucide-react';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { toast } from 'sonner';
const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

interface Lead {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
    createdAt: string;
}

interface QuoteItem {
    id: string;
    productName: string;
    quantity: number;
}

interface QuoteRequest {
    id: string;
    fullName: string;
    companyName: string;
    email: string;
    phone: string;
    additionalNotes?: string;
    createdAt: string;
    items: QuoteItem[];
}

interface Category {
    id: string;
    name: string;
    description?: string;
    icon?: string;
    products?: Product[];
}

interface Product {
    id: string;
    name: string;
    description?: string;
    price: number;
    image?: string;
    inStock: boolean;
    defaultQuantity: number;
    categoryId: string;
    category?: Category;
    tags?: string[];
}

export default function AdminPage() {
    const { user, isSignedIn, isLoaded } = useUser();
    const { getToken } = useAuth();

    const [leads, setLeads] = useState<Lead[]>([]);
    const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    // Category Form State
    const [isAddingCategory, setIsAddingCategory] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [categoryForm, setCategoryForm] = useState({
        name: '',
        description: '',
        icon: 'Gift'
    });

    // Product Form State
    const [isAddingProduct, setIsAddingProduct] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [productForm, setProductForm] = useState({
        name: '',
        description: '',
        price: '',
        categoryId: '',
        inStock: true,
        defaultQuantity: '1',
        tags: ''
    });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const fetchData = async () => {
        try {
            const token = await getToken();
            const headers = {
                'Authorization': `Bearer ${token}`,
            };

            const [leadsRes, quotesRes, categoriesRes, productsRes] = await Promise.all([
                fetch(`${apiBaseUrl}/api/admin/leads`, { headers }),
                fetch(`${apiBaseUrl}/api/admin/quotes`, { headers }),
                fetch(`${apiBaseUrl}/api/categories`),
                fetch(`${apiBaseUrl}/api/products`)
            ]);

            if (leadsRes.ok && quotesRes.ok && categoriesRes.ok && productsRes.ok) {
                const leadsData = await leadsRes.json();
                const quotesData = await quotesRes.json();
                const categoriesData = await categoriesRes.json();
                const productsData = await productsRes.json();
                setLeads(leadsData);
                setQuotes(quotesData);
                setCategories(categoriesData);
                setProducts(productsData);
            }
        } catch (error) {
            console.error('Error fetching admin data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isLoaded && isSignedIn && user) {
            const userEmail = user.primaryEmailAddress?.emailAddress?.toLowerCase() || '';
            const adminEmails = (import.meta.env.VITE_ADMIN_EMAIL || '').split(',').map((e: string) => e.trim().toLowerCase());

            if (!adminEmails.includes(userEmail)) {
                toast.error(`Security alert: Unauthorized access attempt from ${userEmail}`);
            }
        }
    }, [isLoaded, isSignedIn, user]);

    useEffect(() => {
        if (isSignedIn) {
            fetchData();
        }
    }, [isSignedIn]);

    // Security Redirect MUST happen after all hooks
    if (isLoaded && isSignedIn) {
        const userEmail = user?.primaryEmailAddress?.emailAddress?.toLowerCase() || '';
        const adminEmails = (import.meta.env.VITE_ADMIN_EMAIL || '').split(',').map((e: string) => e.trim().toLowerCase());

        if (!adminEmails.includes(userEmail)) {
            return <Navigate to="/home" />;
        }
    }

    if (!isLoaded) return <div className="min-h-screen flex items-center justify-center text-accent">Loading auth...</div>;
    if (!isSignedIn) return <Navigate to="/" />;


    const handleCategorySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!categoryForm.name.trim()) return;
        try {
            const token = await getToken();
            const url = editingCategory
                ? `${apiBaseUrl}/api/admin/categories/${editingCategory.id}`
                : `${apiBaseUrl}/api/admin/categories`;

            const res = await fetch(url, {
                method: editingCategory ? 'PATCH' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(categoryForm)
            });

            if (res.ok) {
                toast.success(editingCategory ? 'Category updated' : 'Category added');
                setCategoryForm({ name: '', description: '', icon: 'Gift' });
                setIsAddingCategory(false);
                setEditingCategory(null);
                fetchData();
            }
        } catch (error) {
            console.error('Save category error:', error);
            toast.error('Failed to save category');
        }
    };

    const handleDeleteCategory = async (id: string) => {
        if (!confirm('Are you sure? This will delete all products in this category!')) return;
        try {
            const token = await getToken();
            const res = await fetch(`${apiBaseUrl}/api/admin/categories/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (res.ok) {
                toast.success('Category deleted');
                fetchData();
            }
        } catch (error) {
            console.error('Delete category error:', error);
            toast.error('Failed to delete category');
        }
    };

    const handleProductSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = await getToken();
            const formData = new FormData();
            formData.append('name', productForm.name);
            formData.append('description', productForm.description);
            formData.append('price', productForm.price);
            formData.append('categoryId', productForm.categoryId);
            formData.append('inStock', String(productForm.inStock));
            formData.append('defaultQuantity', productForm.defaultQuantity);
            formData.append('tags', productForm.tags);
            if (selectedFile) {
                formData.append('image', selectedFile);
            }

            const url = editingProduct
                ? `${apiBaseUrl}/api/admin/products/${editingProduct.id}`
                : `${apiBaseUrl}/api/admin/products`;

            const res = await fetch(url, {
                method: editingProduct ? 'PATCH' : 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (res.ok) {
                toast.success(editingProduct ? 'Product updated' : 'Product added');
                setProductForm({
                    name: '',
                    description: '',
                    price: '',
                    categoryId: '',
                    inStock: true,
                    defaultQuantity: '1',
                    tags: ''
                });
                setSelectedFile(null);
                setIsAddingProduct(false);
                setEditingProduct(null);
                fetchData();
            }
        } catch (error) {
            console.error('Save product error:', error);
            toast.error('Failed to save product');
        }
    };

    const handleEditProduct = (product: Product) => {
        setEditingProduct(product);
        setProductForm({
            name: product.name,
            description: product.description || '',
            price: String(product.price),
            categoryId: product.categoryId,
            inStock: product.inStock,
            defaultQuantity: String(product.defaultQuantity),
            tags: product.tags?.join(', ') || ''
        });
        setSelectedFile(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDeleteProduct = async (id: string) => {
        if (!confirm('Are you sure you want to delete this product?')) return;
        try {
            const token = await getToken();
            const res = await fetch(`${apiBaseUrl}/api/admin/products/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (res.ok) {
                toast.success('Product deleted');
                fetchData();
            }
        } catch (error) {
            console.error('Delete product error:', error);
            toast.error('Failed to delete product');
        }
    };

    if (!isLoaded) return <div className="min-h-screen flex items-center justify-center text-accent">Loading auth...</div>;
    if (!isSignedIn) return <Navigate to="/" />;

    return (
        <div className="min-h-screen pt-32 pb-20 px-6 bg-background">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-bold text-accent">Admin Dashboard</h1>
                    <button
                        onClick={fetchData}
                        className="text-sm bg-accent/10 text-accent px-4 py-2 rounded-md hover:bg-accent/20 transition-colors"
                    >
                        Refresh Data
                    </button>
                </div>

                <Tabs defaultValue="leads" className="w-full">
                    <TabsList className="mb-8">
                        <TabsTrigger value="leads">Leads ({leads.length})</TabsTrigger>
                        <TabsTrigger value="quotes">Quote Requests ({quotes.length})</TabsTrigger>
                        <TabsTrigger value="products">Products ({products.length})</TabsTrigger>
                        <TabsTrigger value="categories">Categories ({categories.length})</TabsTrigger>
                    </TabsList>

                    <TabsContent value="leads">
                        {/* ... Existing Leads Content ... */}
                        <div className="grid gap-6">
                            {leads.map((lead) => (
                                <Card key={lead.id} className="border-accent/20">
                                    <CardHeader className="flex flex-row items-center justify-between">
                                        <CardTitle className="text-xl">
                                            {lead.firstName} {lead.lastName}
                                        </CardTitle>
                                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                                            <Calendar size={12} />
                                            {new Date(lead.createdAt).toLocaleDateString()}
                                        </span>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                                            <div className="flex items-center gap-2 text-sm">
                                                <Mail size={16} className="text-accent" />
                                                {lead.email}
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <Phone size={16} className="text-accent" />
                                                {lead.phone || 'No phone provided'}
                                            </div>
                                        </div>
                                        <div className="p-4 bg-muted/50 rounded-md border border-accent/10">
                                            <h4 className="font-semibold text-sm mb-2 uppercase tracking-wider text-accent/70">{lead.subject}</h4>
                                            <p className="text-sm text-foreground/80 leading-relaxed">{lead.message}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                            {leads.length === 0 && !loading && (
                                <div className="text-center py-20 text-muted-foreground">No leads found.</div>
                            )}
                        </div>
                    </TabsContent>

                    <TabsContent value="quotes">
                        {/* ... Existing Quotes Content ... */}
                        <div className="grid gap-6">
                            {quotes.map((quote) => (
                                <Card key={quote.id} className="border-accent/20">
                                    <CardHeader className="flex flex-row items-center justify-between">
                                        <CardTitle className="text-xl">
                                            {quote.fullName} <span className="text-sm font-normal text-muted-foreground">({quote.companyName})</span>
                                        </CardTitle>
                                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                                            <Calendar size={12} />
                                            {new Date(quote.createdAt).toLocaleDateString()}
                                        </span>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                                            <div className="flex items-center gap-2 text-sm">
                                                <Mail size={16} className="text-accent" />
                                                {quote.email}
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <Phone size={16} className="text-accent" />
                                                {quote.phone}
                                            </div>
                                        </div>

                                        <div className="mb-4">
                                            <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                                                <FileText size={16} className="text-accent" />
                                                Requested Items:
                                            </h4>
                                            <div className="grid gap-2">
                                                {quote.items.map((item) => (
                                                    <div key={item.id} className="flex justify-between items-center bg-muted/30 p-2 rounded border border-accent/5">
                                                        <span className="text-sm">{item.productName}</span>
                                                        <span className="text-sm font-bold text-accent">Qty: {item.quantity}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {quote.additionalNotes && (
                                            <div className="p-4 bg-accent/5 rounded-md border border-accent/10 italic text-sm text-foreground/70">
                                                "{quote.additionalNotes}"
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}
                            {quotes.length === 0 && !loading && (
                                <div className="text-center py-20 text-muted-foreground">No quote requests found.</div>
                            )}
                        </div>
                    </TabsContent>

                    <TabsContent value="categories">
                        <div className="space-y-6">
                            <Card className="border-accent/20">
                                <CardHeader>
                                    <div className="flex justify-between items-center">
                                        <CardTitle className="text-xl">Categories</CardTitle>
                                        <Button
                                            onClick={() => setIsAddingCategory(!isAddingCategory)}
                                            className="bg-accent text-accent-foreground"
                                        >
                                            {isAddingCategory ? <X size={16} className="mr-2" /> : <Plus size={16} className="mr-2" />}
                                            {isAddingCategory ? 'Cancel' : 'Add Category'}
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    {(isAddingCategory || editingCategory) && (
                                        <form onSubmit={handleCategorySubmit} className="space-y-4 mb-8 p-6 bg-accent/5 rounded-lg border border-accent/20">
                                            <div className="grid md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="catName">Category Name *</Label>
                                                    <Input
                                                        id="catName"
                                                        value={categoryForm.name}
                                                        onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                                                        placeholder="e.g. Corporate Gifts"
                                                        required
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="catIcon">Icon</Label>
                                                    <select
                                                        id="catIcon"
                                                        className="w-full bg-background border border-input h-10 px-3 py-2 text-sm rounded-md"
                                                        value={categoryForm.icon}
                                                        onChange={(e) => setCategoryForm({ ...categoryForm, icon: e.target.value })}
                                                    >
                                                        <option value="Gift">Gift (Default)</option>
                                                        <option value="Briefcase">Briefcase (Corporate)</option>
                                                        <option value="Heart">Heart (Personalised)</option>
                                                        <option value="Shirt">Shirt (Apparel)</option>
                                                        <option value="Coffee">Coffee (Drinkware)</option>
                                                        <option value="FolderOpen">FolderOpen (Office)</option>
                                                        <option value="Award">Award (Premium)</option>
                                                        <option value="Leaf">Leaf (Eco-Friendly)</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="catDesc">Description</Label>
                                                <Textarea
                                                    id="catDesc"
                                                    value={categoryForm.description}
                                                    onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                                                    placeholder="Short description for the hover menu..."
                                                    rows={2}
                                                />
                                            </div>
                                            <div className="flex justify-end gap-3">
                                                <Button type="button" variant="outline" onClick={() => { setIsAddingCategory(false); setEditingCategory(null); }}>
                                                    Cancel
                                                </Button>
                                                <Button type="submit" className="bg-accent text-accent-foreground">
                                                    {editingCategory ? 'Update Category' : 'Create Category'}
                                                </Button>
                                            </div>
                                        </form>
                                    )}

                                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {categories.map((category) => (
                                            <div key={category.id} className="flex flex-col p-4 bg-muted/30 rounded-lg border border-accent/10">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <h3 className="font-bold">{category.name}</h3>
                                                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest">{category.id}</p>
                                                    </div>
                                                    <span className="text-xs font-semibold bg-accent/10 px-2 py-1 rounded">{category.products?.length || 0} Products</span>
                                                </div>
                                                {category.description && (
                                                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4 italic">
                                                        "{category.description}"
                                                    </p>
                                                )}
                                                <div className="flex gap-2 mt-auto border-t border-accent/5 pt-3">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-8 text-xs flex-1 hover:bg-accent/10"
                                                        onClick={() => {
                                                            setEditingCategory(category);
                                                            setCategoryForm({
                                                                name: category.name,
                                                                description: category.description || '',
                                                                icon: category.icon || 'Gift'
                                                            });
                                                            setIsAddingCategory(false);
                                                        }}
                                                    >
                                                        <Edit2 size={12} className="mr-1" /> Edit
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-8 text-xs flex-1 text-red-500 hover:bg-red-50 hove:text-red-600"
                                                        onClick={() => handleDeleteCategory(category.id)}
                                                    >
                                                        <Trash2 size={12} className="mr-1" /> Delete
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="products">
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <h2 className="text-2xl font-semibold text-accent">Manage Products</h2>
                                <Button
                                    onClick={() => {
                                        setIsAddingProduct(!isAddingProduct);
                                        setEditingProduct(null);
                                        setProductForm({ name: '', description: '', price: '', categoryId: '', inStock: true, defaultQuantity: '1', tags: '' });
                                        setSelectedFile(null);
                                    }}
                                    className="bg-accent text-accent-foreground"
                                >
                                    {isAddingProduct ? <X size={16} className="mr-2" /> : <Plus size={16} className="mr-2" />}
                                    {isAddingProduct ? 'Cancel' : 'Add New Product'}
                                </Button>
                            </div>

                            {(isAddingProduct || editingProduct) && (
                                <Card className="border-accent/40 bg-accent/5">
                                    <CardHeader>
                                        <CardTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <form onSubmit={handleProductSubmit} className="space-y-4">
                                            <div className="grid md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="name">Product Name *</Label>
                                                    <Input
                                                        id="name"
                                                        value={productForm.name}
                                                        onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                                                        required
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="category">Category *</Label>
                                                    <select
                                                        id="category"
                                                        className="w-full bg-background border border-input h-10 px-3 py-2 text-sm rounded-md"
                                                        value={productForm.categoryId}
                                                        onChange={(e) => setProductForm({ ...productForm, categoryId: e.target.value })}
                                                        required
                                                    >
                                                        <option value="">Select Category</option>
                                                        {categories.map(c => (
                                                            <option key={c.id} value={c.id}>{c.name}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="description">Description (Optional)</Label>
                                                <Textarea
                                                    id="description"
                                                    value={productForm.description}
                                                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                                                    rows={3}
                                                />
                                            </div>

                                            <div className="grid md:grid-cols-3 gap-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="price">Price *</Label>
                                                    <Input
                                                        id="price"
                                                        type="number"
                                                        step="0.01"
                                                        value={productForm.price}
                                                        onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                                                        required
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="quantity">Default Quantity</Label>
                                                    <Input
                                                        id="quantity"
                                                        type="number"
                                                        value={productForm.defaultQuantity}
                                                        onChange={(e) => setProductForm({ ...productForm, defaultQuantity: e.target.value })}
                                                    />
                                                </div>
                                                <div className="flex items-end h-10 pb-2">
                                                    <label className="flex items-center gap-2 cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            checked={productForm.inStock}
                                                            onChange={(e) => setProductForm({ ...productForm, inStock: e.target.checked })}
                                                            className="w-4 h-4 accent-accent"
                                                        />
                                                        <span className="text-sm font-medium">In Stock</span>
                                                    </label>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="image">Product Image</Label>
                                                <div className="flex items-center gap-4">
                                                    <Input
                                                        id="image"
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                                                        className="flex-1"
                                                    />
                                                    {(selectedFile || editingProduct?.image) && (
                                                        <div className="w-12 h-12 rounded border border-accent/20 overflow-hidden bg-white">
                                                            {selectedFile ? (
                                                                <img src={URL.createObjectURL(selectedFile)} alt="Preview" className="w-full h-full object-cover" />
                                                            ) : (
                                                                <img src={editingProduct?.image?.startsWith('/uploads') ? `${apiBaseUrl}${editingProduct?.image}` : editingProduct?.image || ''} alt="Current" className="w-full h-full object-cover" />
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="tags">Tags (comma separated)</Label>
                                                {/* <Input
                                                    id="tags"
                                                    value={productForm.tags}
                                                    onChange={(e) => setProductForm({ ...productForm, tags: e.target.value })}
                                                    placeholder="e.g. Bulk, Premium, Eco, New Arrival"
                                                /> */}
                                                <div className="mt-2 text-xs font-semibold text-accent p-2 bg-accent/5 border border-accent/20 rounded">
                                                    Customization & bulk orders available. Contact us today!
                                                </div>
                                            </div>

                                            <div className="flex justify-end gap-3 mt-6">
                                                <Button type="button" variant="outline" onClick={() => { setIsAddingProduct(false); setEditingProduct(null); }}>
                                                    Cancel
                                                </Button>
                                                <Button type="submit" className="bg-accent text-accent-foreground">
                                                    <Save size={16} className="mr-2" />
                                                    {editingProduct ? 'Update Product' : 'Save Product'}
                                                </Button>
                                            </div>
                                        </form>
                                    </CardContent>
                                </Card>
                            )}

                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {products.map((product) => (
                                    <Card key={product.id} className="overflow-hidden border-accent/20 group">
                                        <div className="aspect-video relative bg-muted overflow-hidden">
                                            {product.image ? (
                                                <img
                                                    src={product.image.startsWith('/uploads') ? `${apiBaseUrl}${product.image}` : product.image}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                                    <ImageIcon size={48} opacity={0.3} />
                                                </div>
                                            )}
                                            <div className="absolute top-2 right-2">
                                                <span className={`px-2 py-1 text-[10px] font-bold rounded uppercase ${product.inStock ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                                                    {product.inStock ? 'In Stock' : 'Out of Stock'}
                                                </span>
                                            </div>
                                        </div>
                                        <CardContent className="p-4">
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <h3 className="font-bold text-lg">{product.name}</h3>
                                                    <p className="text-xs text-muted-foreground">{product.category?.name}</p>
                                                </div>
                                                <span className="font-bold text-accent">₹{product.price}</span>
                                            </div>

                                            <div className="flex flex-wrap gap-1 mb-4">
                                                <span className="text-[9px] bg-accent/10 text-accent border border-accent/30 px-1.5 py-0.5 rounded font-semibold italic">
                                                    Customization & bulk orders available
                                                </span>
                                                {product.tags && product.tags.length > 0 && product.tags.map(tag => (
                                                    <span key={tag} className="text-[9px] bg-accent/5 text-accent border border-accent/20 px-1.5 py-0.5 rounded">
                                                        #{tag}
                                                    </span>
                                                ))}
                                            </div>
                                            <p className="text-sm text-muted-foreground line-clamp-2 mb-4 h-10">
                                                {product.description || 'No description provided.'}
                                            </p>
                                            <div className="flex border-t border-accent/10 pt-4 gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="flex-1 text-xs"
                                                    onClick={() => handleEditProduct(product)}
                                                >
                                                    <Edit2 size={14} className="mr-1" /> Edit
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="flex-1 text-xs border-red-500/50 text-red-500 hover:bg-red-50"
                                                    onClick={() => handleDeleteProduct(product.id)}
                                                >
                                                    <Trash2 size={14} className="mr-1" /> Delete
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                            {products.length === 0 && !loading && (
                                <div className="text-center py-20 text-muted-foreground">No products found. Add your first product above!</div>
                            )}
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
