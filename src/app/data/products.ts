export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  image: string;
  customizable: boolean;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export const categories: Category[] = [
  {
    id: 'ayurvedic',
    name: 'Ayurvedic Range',
    description: 'Authentic Ayurvedic preparations and immunity boosters',
    icon: 'Leaf'
  },
  {
    id: 'healthcare',
    name: 'Healthcare Essentials',
    description: 'Selected surgical and OTC wellness products',
    icon: 'Heart'
  },
  {
    id: 'preventive',
    name: 'Preventive Care',
    description: 'Products for everyday health and wellness',
    icon: 'Shield'
  },
  {
    id: 'surgical',
    name: 'Surgical Items',
    description: 'Quality surgical essentials for healthcare partners',
    icon: 'Activity'
  }
];

export const products: Product[] = [
  {
    id: '1',
    name: 'Executive Leather Notebook Set',
    description: 'Premium leather-bound notebook with pen, perfect for corporate gifting',
    category: 'corporate',
    image: 'https://images.unsplash.com/photo-1740664651822-3a02ec12c121',
    customizable: true
  },
  {
    id: '2',
    name: 'Luxury Gift Hamper',
    description: 'Curated selection of premium items in elegant packaging',
    category: 'hampers',
    image: 'https://images.unsplash.com/photo-1617394391227-4cb6cba53b12',
    customizable: true
  },
  {
    id: '3',
    name: 'Premium Gift Box Collection',
    description: 'Elegant gift box with personalized branding options',
    category: 'premium',
    image: 'https://images.unsplash.com/photo-1760804876166-aae5861ec7c1',
    customizable: true
  },
  {
    id: '4',
    name: 'Branded Corporate Drinkware Set',
    description: 'High-quality mugs and tumblers with custom branding',
    category: 'drinkware',
    image: 'https://images.unsplash.com/photo-1767023442932-ec95b9a13e71',
    customizable: true
  },
  {
    id: '5',
    name: 'Eco-Friendly Product Set',
    description: 'Sustainable gifts made from recycled materials',
    category: 'eco',
    image: 'https://images.unsplash.com/photo-1633878353628-5fc8b983325c',
    customizable: true
  },
  {
    id: '6',
    name: 'Office Desk Organizer Kit',
    description: 'Premium desk accessories for the modern workspace',
    category: 'office',
    image: 'https://images.unsplash.com/photo-1713775285581-706ebc919e7b',
    customizable: true
  },
  {
    id: '7',
    name: 'Personalized Welcome Kit',
    description: 'Custom welcome packages for new employees or clients',
    category: 'personalized',
    image: 'https://images.unsplash.com/photo-1759563874745-47e35c0a9572',
    customizable: true
  },
  {
    id: '8',
    name: 'Corporate Apparel Bundle',
    description: 'Branded t-shirts, polo shirts and accessories',
    category: 'apparel',
    image: 'https://images.unsplash.com/photo-1496180470114-6ef490f3ff22',
    customizable: true
  },
  {
    id: '9',
    name: 'Premium Desk Set',
    description: 'Complete desk organization set including pen holder, pad, and card holder',
    category: 'corporate',
    image: 'https://images.unsplash.com/photo-1518458028785-8fbcd101ebb9',
    customizable: true
  },
  {
    id: '10',
    name: 'Custom Branded Power Bank',
    description: 'High-capacity power bank with your company logo',
    category: 'corporate',
    image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485',
    customizable: true
  },
  {
    id: '11',
    name: 'Corporate Wellness Kit',
    description: 'Health and wellness essentials for employee well-being',
    category: 'hampers',
    image: 'https://images.unsplash.com/photo-1603093503923-d92e597dfc2a',
    customizable: true
  },
  {
    id: '12',
    name: 'Stainless Steel Water Bottle',
    description: 'Double-walled insulated bottle, keeps drinks hot/cold for 24h',
    category: 'drinkware',
    image: 'https://images.unsplash.com/photo-1602143407151-0111419500be',
    customizable: true
  },
  {
    id: '13',
    name: 'Tech Organizer Pouch',
    description: 'Compact travel pouch for cables and accessories',
    category: 'office',
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363',
    customizable: true
  }
];

export const testimonials = [
  {
    id: '1',
    quote: 'The quality of Ayurvedic preparations from Sakshi Enterprise is exceptional. Their reliable supply has helped us serve our patients better.',
    author: 'Dr. Rajesh Mehta',
    designation: 'Pharmacy Owner'
  },
  {
    id: '2',
    quote: 'Sakshi Enterprise has been our go-to partner for authentic immunity boosters. Their professional approach and prompt delivery are unmatched.',
    author: 'Anita Sharma',
    designation: 'Wellness Retailer'
  },
  {
    id: '3',
    quote: 'Reliable and ethical sourcing is what makes Sakshi Enterprise stand out. A dependable partner for long-term healthcare distribution.',
    author: 'Suresh Patel',
    designation: 'Healthcare Distributor'
  }
];
